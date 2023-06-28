output "db_username" {
  value = data.google_secret_manager_secret_version.db_username.secret_data
  description = "Cloud SQL DB username"
  sensitive = true
}

output "db_password" {
  value = data.google_secret_manager_secret_version.db_password.secret_data
  description = "Cloud SQL DB password"
  sensitive = true
}