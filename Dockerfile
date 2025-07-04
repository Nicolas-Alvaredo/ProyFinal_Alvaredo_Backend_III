# 1. Imagen base más liviana
FROM node:alpine

# 2. Directorio de trabajo
WORKDIR /app

# 3. Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# 4. Copiar el resto del código
COPY . .

# 5. Exponer puerto
EXPOSE 3000

# 6. Comando para iniciar el servidor
CMD ["npm", "start"]
