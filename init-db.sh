#!/bin/bash
set -e
echo "Odtwarzanie bazy danych z pliku binarnego (custom-format dump)..."
pg_restore --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB" -1 /tmp/app.dump
