/**
* Create service account to use for CI/CD
* Needs to be applied before this service account can be used to manage cloud resources via CI/CD
*/
resource "google_service_account" "service_account" {
  project = var.gcp_project_id
  account_id = var.service_account
  display_name = "Terraform-managed service account"
}

/**
* Assign the role required to manage IAM policies
* Needs to be applied before this service account can be used to manage other IAM policies during CI/CD
*/
resource "google_project_iam_member" "project_iam_admin" {
  project = var.gcp_project_id
  role = "roles/resourcemanager.projectIamAdmin"
  member = "serviceAccount:${google_service_account.service_account.email}"
}

/**
* Assign the role required to modify Terraform state file in GCS bucket
* Needs to be applied before this service account can be used to manage cloud resources during CI/CD
* Also assumes that Terraform has been set up with pre-existing bucket as remote backend
*/
#resource "google_project_iam_member" "storage_object_admin" {
#  project = var.gcp_project_id
#  role = "roles/storage.objectAdmin"
#  member = "serviceAccount:${google_service_account.service_account.email}"
#}
resource "google_storage_bucket_iam_member" "tf_state_bucket_storage_object_admin" {
  bucket = "zugzwang-terraform-backend"
  role = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.service_account.email}"
}

/**
* Create OpenID provider to manage keyless authentication for GitHub CI/CD workflows
* Needs to be applied before service account can authenticate in GitHub Actions
* See resources for more details:
* - GCP page: https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions
* - Example: https://github.com/terraform-google-modules/terraform-google-github-actions-runners/tree/master/modules/gh-oidc
*
* NOTE - cannot move this to separate module, since sensitive SA outputs cannot be used in terraform for_each arguments
*/
module "oidc" {
  source = "terraform-google-modules/github-actions-runners/google//modules/gh-oidc"
  project_id = var.gcp_project_id
  pool_id = "tf-managed-pool"
  provider_id = "tf-managed-pool-provider"
  sa_mapping = {
    (google_service_account.service_account.account_id) = {
      sa_name = google_service_account.service_account.name
      attribute = "attribute.repository/pmk6vc/express-movers"
    }
  }
}

#resource "google_project_iam_member" "project_editor" {
#  project = var.gcp_project_id
#  role    = "roles/editor"
#  member  = "serviceAccount:${google_service_account.service_account.email}"
#}

#resource "google_project_iam_member" "workload_identity_user" {
#  project = var.gcp_project_id
#  role    = "roles/iam.workloadIdentityUser"
#  member  = "serviceAccount:${google_service_account.service_account.email}"
#}
#
#resource "google_project_iam_member" "service_account_token_creator" {
#  project = var.gcp_project_id
#  role    = "roles/iam.serviceAccountTokenCreator"
#  member  = "serviceAccount:${google_service_account.service_account.email}"
#}

#resource "google_project_iam_member" "storage_admin" {
#  project = var.gcp_project_id
#  role    = "roles/storage.admin"
#  member  = "serviceAccount:${google_service_account.service_account.email}"
#}
#
#resource "google_project_iam_member" "artifact_registry_admin" {
#  project = var.gcp_project_id
#  role    = "roles/artifactregistry.admin"
#  member  = "serviceAccount:${google_service_account.service_account.email}"
#}
#
#resource "google_project_iam_member" "secret_accessor" {
#  project = var.gcp_project_id
#  role    = "roles/secretmanager.secretAccessor"
#  member  = "serviceAccount:${google_service_account.service_account.email}"
#}