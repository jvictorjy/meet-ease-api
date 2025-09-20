#!/bin/bash

if [[ -d /vault/secrets ]];
then
    for file in /vault/secrets/*;
    do
        source "$file";
    done;
fi;

npx prisma migrate deploy --schema=./dist/_core/@shared/infrastructure/adapters/database/prisma/schema.prisma

exec node "${@}"

set -e

echo "🔧 Setting up environment..."

# Verificar se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL is not set!"
    exit 1
fi

echo "🗄️ DATABASE_URL configured"

# Criar arquivo .env na raiz do projeto
echo "Creating .env file for Prisma..."
cat > /app/.env << EOF
DATABASE_URL=$DATABASE_URL
EOF

# Criar arquivo .env na pasta do Prisma (local correto conforme package.json)
echo "Creating .env file in Prisma directory..."
mkdir -p /app/src/_core/@shared/infrastructure/adapters/database/prisma
cat > /app/src/_core/@shared/infrastructure/adapters/database/prisma/.env << EOF
DATABASE_URL=$DATABASE_URL
EOF

echo "✅ Environment files created"
echo "📁 .env created at: /src/_core/@shared/infrastructure/adapters/database/prisma/.env"
echo "🏁 Starting application..."

# Executar comando passado
exec "$@"