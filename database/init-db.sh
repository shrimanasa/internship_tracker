#!/bin/bash
set -e

echo "=== Starting database initialization ==="

# Define the correct order of SQL files
SQL_DIR="/docker-entrypoint-initdb.d/sql"

files=(
  "schema.sql"
  "constraints.sql"
  "indexes.sql"
  "views.sql"
  "functions.sql"
  "triggers.sql"
  "seed.sql"
)

for file in "${files[@]}"; do
  echo "Executing: $file..."
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$SQL_DIR/$file"
done

echo "=== Database initialization completed successfully ==="
