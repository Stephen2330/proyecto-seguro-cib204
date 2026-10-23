# Etapa 1: instalar dependencias de producción
FROM node:24-trixie-slim AS build
RUN npm install --global npm@11.21.1
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# Etapa 2: runtime con ping, ejecutado sin privilegios
FROM node:24-trixie-slim
WORKDIR /app
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
 && apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y --no-install-recommends iputils-ping \
 && rm -rf /var/lib/apt/lists/* \
 && chown node:node /app
COPY --from=build --chown=node:node /app/ /app/
USER node
EXPOSE 3000
CMD ["node", "servidor.js"]