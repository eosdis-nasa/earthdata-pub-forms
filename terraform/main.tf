provider "aws" {
  region     = var.aws_region
}

resource "aws_s3_bucket" "example" {
  bucket = "${var.prefix}-${var.stage}"
  acl    = "private"
}
