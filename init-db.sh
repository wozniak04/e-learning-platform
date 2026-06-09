#!/bin/bash
set -e

echo ">>> Rozpoczynanie procesu inicjalizacji bazy danych..."

# Sprawdzenie czy plik jest binarny (Custom Format) czy zwykły SQL
if pg_restore -l /tmp/app.dump > /dev/null 2>&1; then
    echo ">>> Wykryto format BINARNY (custom-format). Używam pg_restore..."
    pg_restore --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB" -1 /tmp/app.dump
else
    echo ">>> Wykryto format TEKSTOWY (SQL). Używam psql..."
    psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /tmp/app.dump
fi

echo ">>> Inicjalizacja bazy zakończona pomyślnie!"
