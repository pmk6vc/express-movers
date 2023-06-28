# Global common data
variable "gcp_project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "Region for cloud resources"
  type        = string
}

variable "service_account" {
  description = "Service account ID to manage cloud resources and CI/CD"
  type        = string
}

# Secrets
variable "db_username_secret" {
  description = "Name of secret for DB username"
  type        = string
}

variable "db_username_secret_version" {
  description = "Version of secret for DB username"
  type        = number
}

variable "db_password_secret" {
  description = "Name of secret for DB password"
  type        = string
}

variable "db_password_secret_version" {
  description = "Version of secret for DB password"
  type        = number
}