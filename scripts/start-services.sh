#!/bin/bash

cd /opt/meet-ease-api

echo "🚀 Starting all services..."

# Criar rede se não existir
docker network create app-net || true

# Iniciar serviços de infraestrutura
echo "📦 Starting infrastructure services..."
docker-compose up -d postgres redis

# Aguardar PostgreSQL ficar pronto
echo "⏳ Waiting for PostgreSQL..."
until docker exec meet-ease-postgres pg_isready -U postgres; do
    sleep 2
done

echo "✅ All services started successfully!"
