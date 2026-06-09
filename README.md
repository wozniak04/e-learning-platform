# E-learning Platform

Fullstackowa platforma edukacyjna stworzona z myślą o udostępnianiu i przeglądaniu kursów online.

## 🚀 Główne funkcjonalności
* **Zarządzanie kursami:** Tworzenie, edycja, publikowanie i usuwanie kursów.
* **Moduł nauki:** Dodawanie lekcji i materiałów z wykorzystaniem Markdown.
* **Czat na żywo:** Dedykowany, działający w czasie rzeczywistym czat dla uczestników każdego kursu (Socket.io + MQTT).
* **System ról i uprawnień:** Podział na twórcę kursu (zarządzanie) oraz kursanta (tylko odczyt materiałów).
* **Wielojęzyczność:** Wbudowane wsparcie dla języka polskiego i angielskiego (i18next).
* **Bezpieczeństwo i logowanie:** System autoryzacji sesyjnej zabezpieczony tokenami CSRF oraz zintegrowane logowanie kontem Google (OAuth 2.0).

## 🛠️ Stack technologiczny
* **Frontend:** React, TypeScript, Vite, Zustand (zarządzanie stanem). Serwowany przez serwer Nginx (pełniący również rolę Reverse Proxy do backendu).
* **Backend:** Node.js (Express), TypeScript.
* **Bazy danych i komunikacja:** 
  * PostgreSQL 17 (główna relacyjna baza danych)
  * Redis (obsługa szybkiego cache / sesji)
  * Eclipse Mosquitto (broker MQTT do asynchronicznych reklam i czatów na żywo)
* **Infrastruktura:** Docker & Docker Compose.
* **Zewnętrzne usługi (API):**
  * **Cloudinary** (chmurowy hosting i optymalizacja okładek kursów)
  * **Google Cloud Console** (obsługa logowania Google Auth)

## ⚙️ Jak uruchomić aplikacje lokalnie?

Aplikacja jest w 100% skonteneryzowana. Aby ją uruchomić, potrzebujesz jedynie zainstalowanego środowiska Docker.

1. Sklonuj repozytorium na swój dysk.
2. Skonfiguruj środowisko:
   * W folderze `backend/` oraz `frontend/` utwórz pliki `.env` bazując na (`.example.env`).
   * W plikach podaj niezbędne hasła do bazy PostgreSQL, klucze JWT czy porty.
3. Zbuduj i uruchom całe środowisko jedną komendą:
   ```bash
   docker-compose up -d
   ```
4. Gotowe! Aplikacja jest dostępna pod adresem: `http://localhost:3000`

*Uwaga: Przy pierwszym uruchomieniu, kontener bazy danych automatycznie odtworzy potrzebne tabele i wgra dane startowe z przygotowanego zrzutu podstawowym jest app.sql.*

