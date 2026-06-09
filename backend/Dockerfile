# Etap 1: Budowanie (Build)
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Etap 2: Produkcja (Runtime)
FROM node:18-alpine

WORKDIR /app

# Kopiujemy tylko to, co niezbędne do uruchomienia aplikacji
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Ustawiamy użytkownika nie-root (bezpieczeństwo)
USER node

EXPOSE 5000
CMD ["node", "dist/index.js"]