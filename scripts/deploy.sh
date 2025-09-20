#!/bin/bash

set -e

APP_DIR="/opt/meet-ease-api"
DOCKER_IMAGE="$1/meet-ease-api:latest"
CONTAINER_NAME="meet-ease-api"

cd $APP_DIR

echo "🚀 Starting deployment..."

# Pull da nova imagem
echo "📦 Pulling latest image..."
docker pull $DOCKER_IMAGE

# Parar e remover container existente (MELHORADO)
echo "⏹️  Stopping and removing existing containers..."

# Para containers em execução
docker stop $CONTAINER_NAME 2>/dev/null || echo "No running container to stop"

# Remove containers
docker rm $CONTAINER_NAME 2>/dev/null || echo "No container to remove"

# Mata processos na porta 3000 se houver
sudo fuser -k 3000/tcp 2>/dev/null || echo "Port 3000 is free"

# Criar rede se não existir
docker network create app-net 2>/dev/null || echo "Network app-net already exists"

# Iniciar novo container
echo "🆕 Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
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
if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ Container started successfully!"

    # Testar endpoint de health
    echo "🔍 Testing health endpoint..."
    for i in {1..30}; do
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            echo "✅ Health check passed!"
            break
        elif [ $i -eq 30 ]; then
            echo "⚠️  Health check timeout, but container is running"
        else
            echo "Waiting for app to be ready... ($i/30)"
            sleep 2
        fi
    done
else
    echo "❌ Container failed to start!"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Limpeza de imagens antigas
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "🎉 Deployment completed successfully!"