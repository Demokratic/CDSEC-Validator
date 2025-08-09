# Multi-stage build pour optimiser la taille de l'image finale
FROM node:20-alpine AS frontend-builder

# Installer pnpm
RUN npm install -g pnpm

# Copier les fichiers du frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copier le code source et construire
COPY frontend/ ./
RUN pnpm run build

# Stage pour le backend
FROM node:20-alpine AS backend

# Installer les dépendances système
RUN apk add --no-cache sqlite

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S cdsec -u 1001

# Répertoire de travail
WORKDIR /app

# Copier les fichiers package du backend
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier le code source du backend
COPY backend/ ./

# Copier les fichiers construits du frontend
COPY --from=frontend-builder /app/frontend/dist ./public

# Créer les répertoires nécessaires
RUN mkdir -p data logs && chown -R cdsec:nodejs /app

# Changer vers l'utilisateur non-root
USER cdsec

# Exposer le port
EXPOSE 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_PATH=/app/data/validator.db
ENV LOG_LEVEL=info

# Commande de démarrage
CMD ["node", "app.js"]

