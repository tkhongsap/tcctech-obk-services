#!/bin/bash

# example ./script.sh ob-iam

# Check if workspace name is provided
if [ -z "$1" ]; then
    echo "No workspace name provided. Usage: ./script.sh <workspace-name>"
    exit 1
fi

# Assign the argument to a variable
WORKSPACE=$1

# Install dependencies
echo "Installing dependencies..."
yarn install

# Generate Prisma client
echo "Generating Prisma client..."
yarn workspace $WORKSPACE prisma:generate

# Deploy database migrations
echo "Deploying database migrations..."
yarn workspace $WORKSPACE prisma:migrate:deploy

echo "Script completed."