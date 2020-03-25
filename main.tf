provider "aws" {
  region     = var.aws_region
}

resource "aws_s3_bucket" "example" {
  bucket = "${var.prefix}-terraform-example"
  acl    = "private"
}

variable "aws_region" {
  type = string
}

variable "prefix" {
  type = string
}