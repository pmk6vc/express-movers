output "auth_config_id" {
  value = google_identity_platform_project_default_config.auth_methods.id
  description = "Auth config resource ID"
  sensitive = true
}

output "auth_config_name" {
  value = google_identity_platform_project_default_config.auth_methods.name
  description = "Auth config resource name"
  sensitive = true
}