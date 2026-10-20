# Dockerfile del servicio de cifrado (imagen endurecida)

# --- Etapa 1: construccion ---
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# --- Etapa 2: imagen final (mas pequena, sin herramientas de build) ---
FROM node:20-slim
WORKDIR /app
# Crear un usuario sin privilegios
RUN useradd -m appuser \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
COPY --from=build /app /app
# Dar propiedad de /app al usuario para que pueda escribir las llaves RSA al arrancar
RUN chown -R appuser:appuser /app
USER appuser
EXPOSE 3000
CMD ["node", "servidor.js"]
