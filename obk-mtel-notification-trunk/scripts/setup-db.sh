#!/bin/bash

# Default values
PORT=5432

while [[ "$#" -gt 0 ]]; do
  case $1 in
  --name)
    dbName="$2"
    shift
    ;;
  --port)
    PORT="$2"
    shift
    ;;
  *)
    echo "Unknown parameter passed: $1"
    exit 1
    ;;
  esac
  shift
done

if [[ ! $dbName ]]; then
  echo "Please specify the database name using --name."
  exit 1
fi

container_id=$(docker ps -aqf "name=$dbName")

# If the container does not exist, create it
if [[ -z "$container_id" ]]; then
  echo "Creating new container..."
  docker pull postgres:16

  container_id=$(docker run -d \
    --name $dbName \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=$dbName \
    -e POSTGRES_HOST_AUTH_METHOD=trust \
    -p $PORT:5432 \
    postgres:16)
else
  # If the container exists but is stopped, start it
  container_status=$(docker inspect --format '{{.State.Status}}' $container_id)
  if [[ "$container_status" == "exited" ]]; then
    echo "Starting the existing stopped container..."
    docker start $container_id
  else
    echo "Using the already running container..."
  fi
fi

echo "Waiting for PostgreSQL to start..."

timeout=30
counter=0
sp='/-\|'
printf ' '

# Check the logs until PostgreSQL is ready to accept connections or timeout reached
until docker logs $container_id 2>&1 | grep "database system is ready to accept connections" || [[ $counter -eq $timeout ]]; do
  printf '\b%.1s' "$sp"
  sp=${sp#?}${sp%???}
  sleep 1
  ((counter++))
done

printf '\b '

if [[ $counter -eq $timeout ]]; then
  echo "Failed to start PostgreSQL within $timeout seconds."
  exit 1
fi

# Echo the connection string
echo "Database setup complete!"
echo "Connection string: postgresql://postgres@localhost:$PORT/$dbName"
