variable "aws_region" {
  type        = string
  description = "The target AWS Region for all provisioned services"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Deployment environment suffix to prevent resource naming collisions"
  default     = "dev"
}