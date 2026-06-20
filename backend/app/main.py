import os
import boto3
from boto3.dynamodb.conditions import Attr
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI(title="iPaaS Agent Skills Marketplace API", version="1.0.0")

# Cross-Origin Resource Sharing rules to accept calls from your local Vue frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fetching the table name directly from OpenTofu injected environment variables
TABLE_NAME = os.environ.get("DYNAMODB_TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

@app.get("/v1/skills")
def get_skills(search: str = Query(None, description="Search term for filtering skills")):
    """
    Scans and filters marketplace agent skills from DynamoDB.
    Fulfills client queries by searching across tags, names, and descriptions.
    """
    try:
        if not search:
            # If no search parameter, return all items sorted by popularity or default scan
            response = table.scan()
            items = response.get("Items", [])
            # Sort locally by downloads descending for the "Top Rated Skills" feature
            return sorted(items, key=lambda x: int(x.get("downloads", 0)), reverse=True)
        
        # Build multi-attribute filter expression for search strings
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

# The Mangum handler acts as the interface layer translating API Gateway events to FastAPI
handler = Mangum(app, lifespan="off")