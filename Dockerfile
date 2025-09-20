FROM node:22-alpine

WORKDIR /app

# Instalar curl para debug
RUN apk add --no-cache curl

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Reinstalar para pegar devDependencies necessárias para build
RUN npm install

# Build da aplicação
RUN npm run build

# Remover devDependencies após build
RUN npm prune --production

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["sh", "-c", "echo 'DATABASE_URL:' $DATABASE_URL && npx prisma generate && npx prisma migrate deploy && npm run start:prod"]