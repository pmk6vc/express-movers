###########################
# Node server variables
###########################
NODE_ENV=development
SERVICE_PORT=5495

###########################
# Node environment configuration
###########################
# Config profile handler to load
NODE_CONFIG_ENV=local-dev
# Config dir path in Docker image
NODE_CONFIG_DIR=/app/config

###########################
# Database configuration
###########################
DB_NAME=postgres
DB_HOST=0.0.0.0
DB_PORT=5432
DB_USERNAME=database_username
DB_PASSWORD=database_password