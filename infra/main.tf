# 1. Persistence Layer: DynamoDB Table
resource "aws_dynamodb_table" "agent_skills" {
  name         = "ipaas-agent-skills-${var.environment}"
  billing_mode = "PAY_PER_REQUEST" # Zero idle-cost model
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Environment = var.environment
    Project     = "ipaas-marketplace"
  }
}

# 2. Package Backend Code dynamically during deployment
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend"
  output_path = "${path.module}/files/backend.zip"
}

# 3. Compute Layer: IAM Execution Role & Lambda Function
resource "aws_iam_role" "lambda_exec" {
  name = "ipaas-marketplace-lambda-exec-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Simple policy alignment to allow Lambda to read/write to your skills table
resource "aws_iam_policy" "lambda_dynamodb" {
  name = "ipaas-marketplace-dynamodb-${var.environment}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ]
      Resource = aws_dynamodb_table.agent_skills.arn
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_db_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_dynamodb.arn
}

resource "aws_lambda_function" "api_handler" {
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  function_name    = "ipaas-marketplace-api-${var.environment}"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "app.main.handler" # Routes requests inside Python to Mangum/FastAPI
  runtime          = "python3.12"
  memory_size      = 256
  timeout          = 10

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.agent_skills.name
      ENVIRONMENT         = var.environment
      FRONTEND_URL        = "https://${local.fqdn}"
    }
  }
}

# 4. Routing Layer: Amazon API Gateway (HTTP API v2 for optimal speed/cost)
resource "aws_apigatewayv2_api" "http_api" {
  name          = "ipaas-marketplace-gateway-${var.environment}"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api_handler.invoke_arn
  payload_format_version = "2.0"
}

# Catch-all route to map everything to FastAPI's internal router
resource "aws_apigatewayv2_route" "catch_all" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 50
    throttling_rate_limit  = 100
  }
}

resource "aws_apigatewayv2_route" "options_preflight" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "OPTIONS /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_lambda_permission" "api_gw_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}