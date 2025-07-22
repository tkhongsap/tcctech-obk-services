#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# REPLACE THIS
APP_NAME="ob-notification"

# Run the Docker container
docker run -p 3000:3000 $APP_NAME

echo "Docker container running on http://localhost:3000"
