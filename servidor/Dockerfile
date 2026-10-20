# Etapa 1: instalar dependencias de producción
FROM node:24-trixie-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# Etapa 2: runtime mínimo, ejecutado sin privilegios
FROM gcr.io/distroless/nodejs24-debian13:nonroot
WORKDIR /app
COPY --from=build --chown=65532:65532 /app/ /app/
USER 65532:65532
EXPOSE 3000
CMD ["servidor.js"]