resource "random_id" "db_name_suffix" {
  byte_length = 4
}

resource "google_sql_database_instance" "db" {
  project = var.gcp_project_id
  name = "postgres-${terraform.workspace}-${random_id.db_name_suffix.hex}"
  database_version = "POSTGRES_15"
  region = var.cloud_sql_region

  settings {
    tier = "db-f1-micro"
    activation_policy = "ALWAYS"
    disk_size = 10
    disk_autoresize_limit = 25
    disk_type = "PD_HDD"
    password_validation_policy {
      enable_password_policy = true
      disallow_username_substring = true
      complexity = "COMPLEXITY_DEFAULT"
      min_length = 12
    }
  }
}

resource "google_sql_user" "db_user" {
  instance = google_sql_database_instance.db.name
  name = var.db_username
  password = var.db_password
}