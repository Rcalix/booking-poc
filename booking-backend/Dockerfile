FROM node:20-alpine AS build

WORKDIR /app

# Instalar openssl
RUN apk add --no-cache openssl

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Generar cliente Prisma con ruta explícita al schema
RUN npx prisma generate --schema=./src/prisma/schema.prisma

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/prisma ./prisma
COPY --from=build /app/package*.json ./

# Exponer puerto
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]