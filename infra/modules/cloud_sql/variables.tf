variable "gcp_project_id" {
  description = "GCP project ID"
  type = string
}

variable "cloud_sql_region" {
  description = "Region for Cloud SQL DB instance"
  type = string
}

variable "db_username" {
  description = "Cloud SQL DB username"
  type = string
  sensitive = true
}

variable "db_password" {
  description = "Cloud SQL DB password"
  type = string
  sensitive = true
}