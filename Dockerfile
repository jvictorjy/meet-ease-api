FROM node:22-alpine

WORKDIR /app

# Instalar curl para debug
RUN apk add --no-cache curl

COPY ./docker-entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Reinstalar para pegar devDependencies necessárias para build
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Remover devDependencies após build
RUN npm prune --production

# Expor porta
EXPOSE 3000

ENTRYPOINT [ "/usr/bin/entrypoint.sh" ]

# Comando de inicialização
CMD ["sh", "-c", "echo 'DATABASE_URL check:' $DATABASE_URL && if [ -z \"$DATABASE_URL\" ]; then echo 'ERROR: DATABASE_URL is not set!'; exit 1; fi && npx prisma migrate deploy && npm run start:prod"]