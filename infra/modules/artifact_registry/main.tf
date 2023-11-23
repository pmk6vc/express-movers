resource "google_artifact_registry_repository" "registry_repo" {
  project = var.gcp_project_id
  location = var.registry_repo_region
  repository_id = "express-movers-api-repo"
  description = "Docker image repo for the express-movers API"
  format = "DOCKER"
}