resource "google_artifact_registry_repository" "registry_repo" {
  project = var.gcp_project_id
  location = var.registry_repo_region
  repository_id = "express-movers-repo-${terraform.workspace}"
  description = "Docker image repo for ${terraform.workspace}"
  format = "DOCKER"
}