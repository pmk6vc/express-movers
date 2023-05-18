output "service_account_id" {
  value = google_service_account.service_account.account_id
  description = "Service account ID"
  sensitive = true
}

output "service_account_name" {
  value = google_service_account.service_account.name
  description = "Service account name"
  sensitive = true
}

output "service_account_email" {
  value = google_service_account.service_account.email
  description = "Service account email"
  sensitive = true
}