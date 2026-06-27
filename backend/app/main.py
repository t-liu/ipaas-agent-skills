import os
import json
import base64
import boto3
from boto3.dynamodb.conditions import Attr, Key
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI(title="iPaaS Agent Skills Marketplace API", version="1.0.0")

def get_allowed_origins() -> list[str]:
    frontend_url = os.environ.get("FRONTEND_URL")
    if not frontend_url:
        raise RuntimeError(
            "Missing required environment variable: FRONTEND_URL. "
            "Add it to your Lambda environment via OpenTofu."
        )
    origins = [frontend_url]

    if os.environ.get("ENVIRONMENT") == "dev":
        origins += [
            "http://localhost:5173",
            "http://localhost:4173",
        ]

    return origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

TABLE_NAME = os.environ.get("DYNAMODB_TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def encode_next_key(last_key: dict | None) -> str | None:
    if not last_key:
        return None
    return base64.b64encode(json.dumps(last_key).encode()).decode()


@app.get("/v1/skills")
def list_skills(
    search: str = Query(None, description="Search term for filtering skills"),
    category: str = Query(None, description="Filter by category"),
    limit: int = Query(50, ge=1, le=200, description="Max items per page"),
    next_token: str = Query(None, alias="nextToken", description="Pagination cursor"),
):
    try:
        kwargs = {}
        use_query = False

        if category:
            kwargs["IndexName"] = "CategoryIndex"
            kwargs["KeyConditionExpression"] = Key("category").eq(category)
            use_query = True
        elif search:
            search_lower = search.lower()
            kwargs["FilterExpression"] = (
                Attr("displayName_lower").contains(search_lower) |
                Attr("description_lower").contains(search_lower) |
                Attr("tags_string_lower").contains(search_lower)
            )

        kwargs["Limit"] = limit

        if next_token:
            try:
                decoded = base64.b64decode(next_token).decode()
                kwargs["ExclusiveStartKey"] = json.loads(decoded)
            except (ValueError, json.JSONDecodeError):
                raise HTTPException(status_code=400, detail="Invalid nextToken")

        if use_query:
            response = table.query(**kwargs)
        else:
            response = table.scan(**kwargs)

        items = response.get("Items", [])
        items.sort(key=lambda x: int(x.get("downloads", 0)), reverse=True)

        return {
            "items": items,
            "nextToken": encode_next_key(response.get("LastEvaluatedKey")),
            "count": len(items),
        }

    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e), "status": 500}


@app.get("/v1/skills/{name}")
def get_skill(name: str):
    try:
        response = table.scan(
            FilterExpression=Attr("name").eq(name),
            Limit=1
        )
        items = response.get("Items", [])
        if not items:
            raise HTTPException(status_code=404, detail="Skill not found")
        return items[0]

    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e), "status": 500}


handler = Mangum(app, lifespan="off")
