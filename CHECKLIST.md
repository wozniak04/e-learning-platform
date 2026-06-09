# Checklist projektu Docker

## Instrukcja uruchomienia (od zera)
1. Sklonuj repozytorium.
2. Skopiuj pliki `.env.example` do `.env` w folderach `backend/` i `frontend/` (oraz w głównym katalogu, jeśli wymagane).
3. Uruchomienie standardowe (frontend, api, bazy):
   ```bash
   docker-compose up --build -d
   ```
4. Uruchomienie z opcjonalnym workerem MQTT (użycie profili):
   ```bash
   docker-compose --profile full up --build -d
   ```
5. Odczekaj ok. 30-60 sekund na inicjalizację bazy danych i statusy healthy.

## Lista usług, obrazów i portów
| Usługa        | Obraz (Tag)               | Port (Zewn.) | Opis |
|--------------|---------------------------|--------------|------|
| Frontend     | elearning-frontend:1.0.0  | 3000         | React + Nginx |
| Backend      | elearning-backend:1.0.0   | -            | Node.js Express API |
| Backend-MQTT | elearning-backend:1.0.0   | -            | Worker (Profil: worker) |
| Postgres     | postgres:17-alpine        | -            | Baza danych (Wolumen: pg_data) |
| Redis        | redis:7-alpine            | -            | Cache (Wolumen: redis_data) |
| Mosquitto    | eclipse-mosquitto:2       | -            | Broker MQTT |

## Komendy testowe i weryfikacja wymagań

1. **Sprawdzenie kontenerów:**
   `docker compose ps` -> Wszystkie główne usługi powinny mieć status `running (healthy)`.

2. **Weryfikacja użytkownika non-root (Bezpieczeństwo):**
   `docker exec elearning-backend id` -> Powinno zwrócić `uid=1000(node)`.

3. **Weryfikacja limitów zasobów:**
   `docker stats --no-stream` -> Wyświetla nałożone limity CPU i MEMORY dla kontenerów.

4. **Weryfikacja rotacji logów:**
   `docker inspect elearning-backend --format '{{json .HostConfig.LogConfig}}'` -> Powinno zwrócić `max-size: 10m` oraz `max-file: 3`.

5. **Weryfikacja Graceful Shutdown:**
   `docker compose stop backend-mqtt` -> `docker logs elearning-backend-mqtt` powinno zawierać wpis "Otrzymano SIGTERM. Zamykanie połączeń...".

6. **Test trwałości danych (Persistence):**
   - Dodaj dane w aplikacji.
   - Uruchom `docker compose down`.
   - Uruchom ponownie `docker compose up -d`.
   - Dane powinny nadal być widoczne w aplikacji.

7. **Test API (Endpoint /health):**
   `docker exec elearning-backend wget -qO- http://localhost:5000/health` -> Powinno zwrócić status OK.


### Architektura i Dockerfile
- **Multi-stage build:** Zastosowany w `backend/Dockerfile` i `frontend/Dockerfile` w celu optymalizacji rozmiaru obrazów.
- **Bezpieczeństwo:** Backend uruchamiany z uprawnieniami użytkownika `node`, nie `root`.
- **Optymalizacja budowania:** Wykorzystanie plików `.dockerignore` do pomijania node_modules i logów.

### Sieci i Izolacja
- **Separacja sieci:** `frontend-net` dla komunikacji zewnętrznej i `backend-net` dla komunikacji wewnętrznej między API a bazami danych.
- **Izolacja baz danych:** Baza Postgres, Redis i broker Mosquitto nie wystawiają portów na hosta. Ruch przechodzi wyłącznie przez backend lub reverse proxy.

### Wolumeny i Konfiguracja
- **Named Volumes:** `pg_data` oraz `redis_data` zapewniają trwałość danych.
- **Zmienne środowiskowe:** Pełna konfiguracja przez pliki `.env`, brak hardkodowanych haseł w obrazach.

### Mechanizmy niezawodności
- **Healthchecki:** Zdefiniowane dla wszystkich kluczowych usług (Postgres, Redis, Backend, Frontend).
- **Zależności:** Zastosowanie `depends_on` z warunkiem `service_healthy`.
- **Limity:** Każda usługa posiada zdefiniowane limity CPU i pamięci RAM.
- **Logi:** Skonfigurowana rotacja logów `json-file` zapobiegająca przepełnieniu dysku.

### Funkcjonalności specyficzne
- **Graceful Shutdown:** Backend i Worker obsługują sygnał SIGTERM, zamykając połączenia z bazą danych i brokerem MQTT przed zakończeniem pracy.
- **Profile:** Możliwość uruchomienia środowiska w wersji podstawowej lub pełnej (z workerem MQTT).

## Diagram architektury (uproszczony)
```text
[Internet/Browser] -> [Frontend (Nginx :3000)] -> [Backend (API :5000)]
                                                  |-> [Postgres (DB)]
                                                  |-> [Redis (Cache)]
                                                  |-> [Mosquitto (MQTT)] <- [Backend-MQTT (Worker)]
```
`docker inspect --format='{{json .State.Health}}' elearning-frontend` logi healtchecku dla fronta