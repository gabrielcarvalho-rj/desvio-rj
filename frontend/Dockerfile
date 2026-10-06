# ============================================================
# Frontend Desvio RJ - React + Vite servido por Nginx
# Build em duas etapas (multi-stage):
#   1) "build": instala dependencias e gera os arquivos estaticos (npm run build)
#   2) "runtime": Nginx serve apenas a pasta dist/ resultante
# ============================================================

# ---------- Etapa 1: build ----------
# Vite 8 exige Node 20.19+ ou 22.12+
FROM node:22 AS build
WORKDIR /app

# Dependencias primeiro (melhor uso de cache)
COPY package.json package-lock.json ./
RUN npm ci

# URL da API que o NAVEGADOR vai usar.
# O Vite grava esse valor no JavaScript no momento do build.
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ---------- Etapa 2: Nginx ----------
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
