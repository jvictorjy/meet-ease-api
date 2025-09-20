#!/bin/bash

set -e

APP_DIR="/opt/meet-ease-api"
DOCKER_IMAGE="$1/meet-ease-api:latest"

cd $APP_DIR

echo "🚀 Starting deployment..."

# Pull da nova imagem
echo "📦 Pulling latest image..."
docker pull $DOCKER_IMAGE

# Parar container existente
echo "⏹️  Stopping existing container..."
docker stop meet-ease-api || true
docker rm meet-ease-api || true

# Iniciar novo container
echo "🆕 Starting new container..."
docker run -d \
  --name meet-ease-api \
  --restart unless-stopped \
  --network app-net \
  -p 3000:3000 \
  --env-file .env \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  $DOCKER_IMAGE

# Aguardar container inicializar
echo "⏳ Waiting for container to start..."
sleep 10

# Verificar saúde do container
if docker ps | grep -q meet-ease-api; then
    echo "✅ Container started successfully!"
    
    # Testar endpoint de health
    echo "🔍 Testing health endpoint..."
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ Health check passed!"
    else
        echo "⚠️  Health check failed, but container is running"
    fi
else
    echo "❌ Container failed to start!"
    docker logs meet-ease-api
    exit 1
fi

# Limpeza de imagens antigas
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "🎉 Deployment completed successfully!"
