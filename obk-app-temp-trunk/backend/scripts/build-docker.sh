#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Default values
NODE_ENV="dev"

# Parse named arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
    --env)
        NODE_ENV="$2"
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

# Get the short SHA of the latest commit
GIT_SHA=$(git rev-parse --short HEAD)

# Build the Docker image
docker build --build-arg NODE_ENV=$NODE_ENV -t ob-notification:$VERSION-$GIT_SHA -t ob-notification:latest .

echo "Docker image built with NODE_ENV=$NODE_ENV and tags: $VERSION-$GIT_SHA and latest"
