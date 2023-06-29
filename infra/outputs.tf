output "artifact_registry_repo" {
  value       = module.artifact_registry.artifact_registry_repo_name
  description = "Artifact registry repo name"
}

output "db_connection_name" {
  value       = module.cloud_sql.db_connection_name
  description = "Cloud SQL DB connection name"
}