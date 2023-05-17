output "artifact_registry_repo_name" {
  value = google_artifact_registry_repository.registry_repo.name
  description = "Artifact registry repository name"
}