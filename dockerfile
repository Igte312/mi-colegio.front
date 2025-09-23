# 1. Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos package.json y pnpm-lock.yaml si usas pnpm
COPY package.json .
# COPY pnpm-lock.yaml .  # descomenta si usas pnpm

# Instalamos dependencias (puedes cambiar npm install → pnpm install si quieres)
RUN npm install

# Copiamos el resto del proyecto, incluido .env si quieres para local
COPY . .

# Build de producción
# VITE_API_URL se puede pasar como ARG en build o usar Azure App Settings
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# 2. Serve stage
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copiamos build
COPY --from=build /app/dist .

# Exponemos puerto
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
