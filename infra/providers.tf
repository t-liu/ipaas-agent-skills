terraform {
  required_version = ">= 1.8.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
  # For local learning, state stores on your machine. 
  # For production teams, swap this to an S3 backend with DynamoDB state locking.
  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = var.aws_region
}