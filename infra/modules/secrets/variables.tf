variable "db_username_secret" {
  description = "Name of secret for DB username"
  type = string
}

variable "db_username_secret_version" {
  description = "Version of secret for DB username"
  type = number
}

variable "db_password_secret" {
  description = "Name of secret for DB password"
  type = string
}

variable "db_password_secret_version" {
  description = "Version of secret for DB password"
  type = number
}