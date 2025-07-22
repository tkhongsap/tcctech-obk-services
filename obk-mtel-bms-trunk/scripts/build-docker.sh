#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Default values
NODE_ENV="dev"

# Initialize GIT_SHA with a default value
GIT_SHA=$(git rev-parse --short HEAD)

# Parse named arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
    --env)
        NODE_ENV="$2"
        shift
        ;;
    --sha)
        GIT_SHA="$2"
        shift
        ;;
    *)
        echo "Unknown parameter passed: $1"
        exit 1
        ;;
    esac
    shift
done

# Extract version from package.json
VERSION=$(node -p "require('./package.json').version")

# Build the Docker image
docker build --platform=linux/amd64 --build-arg NODE_ENV=$NODE_ENV -t ob-bms:$GIT_SHA -t ob-bms:latest .

echo "Docker image built with NODE_ENV=$NODE_ENV and tags: $GIT_SHA and latest"
