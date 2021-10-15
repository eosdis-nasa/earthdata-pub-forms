# Terraform infrastructure code for Earthdata Pub Forms

Earthdata Pub Forms use Terraform to create AWS infrastructure.

## Create AWS resources

To create infrastructure in AWS, run the following commands:

``` bash
terraform plan    # continue if plan is successful
terraform apply   # actually creates AWS resources
```

_TODO: Remove `var.stage` to a different location to vacillate deployment to
other environments._

## Deploy code to AWS

(This is temporary. TODO: automate deployment through Bamboo.)

To deploy artifacts:

``` bash
aws s3 sync ../dist s3://${var.prefix}-${var.stage}
```
