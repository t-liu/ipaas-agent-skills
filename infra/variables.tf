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

variable "hosted_zone_name" {
  type        = string
  default     = "thomasliu.click"
  description = "The root DNS hosted zone name in Route 53"
}

variable "subdomain_prefix" {
  type        = string
  default     = "agentskills"
  description = "The subdomain prefix for this specific deployment"
}

locals {
  fqdn = "${var.subdomain_prefix}.${var.hosted_zone_name}"
}