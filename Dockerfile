# syntax = docker/dockerfile:1

# -------------------------------------------------------------
# Base image
# -------------------------------------------------------------
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

# O ambiente final será production
ENV NODE_ENV=production

# -------------------------------------------------------------
# Build stage
# -------------------------------------------------------------
FROM base AS build

# Define temporariamente NODE_ENV=development para incluir devDeps
ENV NODE_ENV=development

# Instala dependências de compilação
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copia os arquivos de dependências
COPY package*.json ./

# Instala todas as dependências (incluindo dev)
RUN npm ci

# Copia o código-fonte
COPY . .

# Compila o TypeScript
RUN npm run build

# -------------------------------------------------------------
# Production stage
# -------------------------------------------------------------
FROM base

# Instala apenas dependências de produção
COPY package*.json ./
RUN npm ci --omit=dev

# Copia o código compilado da etapa anterior
COPY --from=build /app/dist ./dist

# Porta opcional (usada se o Fly precisar de health check)
EXPOSE 3000

# Comando padrão
CMD ["node", "dist/index.js"]