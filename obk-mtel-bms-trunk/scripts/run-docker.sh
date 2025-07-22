#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Run the Docker container
docker run -p 3000:3000 ob-bms

echo "Docker container running on http://localhost:3000"
