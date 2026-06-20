output "api_endpoint" {
  value       = aws_apigatewayv2_api.http_api.api_endpoint
  description = "The public execution URL for your API Gateway. Plug this into your Vue 3 composable."
}

output "dynamodb_table_name" {
  value       = aws_dynamodb_table.agent_skills.name
  description = "The provisioned DynamoDB database target table name"
}

output "frontend_url" {
  description = "The public global CDN domain address for your Vue client dashboard"
  value       = "https://${aws_cloudfront_distribution.frontend_cdn.domain_name}"
}