import os
import boto3
from boto3.dynamodb.conditions import Attr
from fastapi import FastAPI, Query
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

    # Allow local dev servers without changing Lambda config
    if os.environ.get("ENVIRONMENT") == "dev":
        origins += [
            "http://localhost:5173",   # Vite default
            "http://localhost:4173",   # Vite preview
        ]

    return origins

# Cross-Origin Resource Sharing rules to accept calls from your local Vue frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

# Fetching the table name directly from OpenTofu injected environment variables
TABLE_NAME = os.environ.get("DYNAMODB_TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

@app.get("/v1/skills")
def get_skills(search: str = Query(None, description="Search term for filtering skills")):
    try:
        if not search:
            response = table.scan()
            items = response.get("Items", [])
            return sorted(items, key=lambda x: int(x.get("downloads", 0)), reverse=True)

        search_lower = search.lower()
        filter_expression = (
            Attr("displayName_lower").contains(search_lower) |
            Attr("description_lower").contains(search_lower) |
            Attr("tags_string_lower").contains(search_lower)
        )

        response = table.scan(FilterExpression=filter_expression)
        return response.get("Items", [])

    except Exception as e:
        return {"error": str(e), "status": 500}

handler = Mangum(app, lifespan="off")