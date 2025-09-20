FROM node:22-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY /src/_core/@shared/infrastructure/adapters/database/prisma ./src/_core/@shared/infrastructure/adapters/database/prisma/

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .
RUN npm install

# Build da aplicação
RUN npm run build

# Gerar Prisma Client
RUN npx prisma generate

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]