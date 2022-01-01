locals {
  project = "<%= project %>"
  environment = terraform.workspace
  prefix = "${local.project}-${local.environment}_"
}

