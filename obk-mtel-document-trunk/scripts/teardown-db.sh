#!/bin/bash

set -e

name=""
destroy=false

while [[ "$#" -gt 0 ]]; do
  case $1 in
  --name)
    name="$2"
    shift
    ;;
  --destroy)
    destroy=true
    ;;
  *)
    echo "Unknown parameter passed: $1"
    exit 1
    ;;
  esac
  shift
done

if [[ ! $name ]]; then
  echo "Error: You must specify a container name with --name"
  exit 1
fi

# Connect to the PostgreSQL container and drop all tables
docker exec $name psql -U postgres -d $name -c "
DO \$\$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || r.tablename || ' CASCADE';
    END LOOP;
END \$\$;"

echo "All tables dropped from $name."

# Stop the container
docker stop $name

echo "Container $name stopped."

# Destroy the container if the flag is set
if $destroy; then
  docker rm $name
  echo "Container $name removed."
fi
