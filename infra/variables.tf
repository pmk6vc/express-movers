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