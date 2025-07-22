terraform {
  # backend "s3" {
    # Var cannot be used here, please configure this according to a desired enviroment
  #   bucket = "sharge-infra"
  #   key    = "environments/staging/terraform.tfstate"
  #   region = "ap-southeast-1"
  # }
  
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = ">=4.0.0"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      # Name = "one-bangkok-dev"
      Client = "One Bangkok"
    }
  }
}
