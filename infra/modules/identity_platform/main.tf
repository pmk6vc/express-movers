resource "google_identity_platform_project_default_config" "auth_methods" {
  project = var.gcp_project_id
  sign_in {
    email {
      enabled = true
      password_required = false
    }
  }
}