terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
  # Point to manually created and configured bucket to manage TF state
  backend "gcs" {
    bucket = "zugzwang-terraform-backend"
    prefix = "terraform/express-movers-state"
  }
}

provider "google" {
  project = var.gcp_project_id
}

module "iam" {
  source          = "./modules/iam"
  gcp_project_id  = var.gcp_project_id
  service_account = var.service_account
}

module "artifact_registry" {
  source               = "./modules/artifact_registry"
  gcp_project_id       = var.gcp_project_id
  registry_repo_region = var.region
}

module "secrets" {
  source                     = "./modules/secrets"
  db_username_secret         = var.db_username_secret
  db_username_secret_version = var.db_username_secret_version
  db_password_secret         = var.db_password_secret
  db_password_secret_version = var.db_password_secret_version
}

module "cloud_sql" {
  source           = "./modules/cloud_sql"
  gcp_project_id   = var.gcp_project_id
  cloud_sql_region = var.region
  db_username      = module.secrets.db_username
  db_password      = module.secrets.db_password
}