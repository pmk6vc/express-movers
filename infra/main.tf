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

module "artifact_registry" {
  source               = "./modules/artifact_registry"
  gcp_project_id       = var.gcp_project_id
  registry_repo_region = var.region
}