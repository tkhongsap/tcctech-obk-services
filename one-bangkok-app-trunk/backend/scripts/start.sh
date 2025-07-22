#!/bin/bash

# example ./scripts/start.sh ob-iam

# Check if workspace name is provided
if [ -z "$1" ]; then
    echo "No workspace name provided. Usage: ./script.sh <workspace-name>"
    exit 1
fi

# Assign the argument to a variable
WORKSPACE=$1

# Install dependencies for ob-common-lib
echo "Installing ob-common-lib dependencies..."
yarn install

# Compile ob-common-lib
echo "Compile ob-common-lib..."
tsc -d --project ob-common-lib

# Remove node_modules
echo "Remove node_modules..."
rm -rf node_modules

# Setup project
echo "Setup project..."
./scripts/setup.sh $WORKSPACE

# Run service
echo "Run service..."
yarn workspace $WORKSPACE dev

echo "Script completed."