# Proyecto Final CIB-204 · Servicio de Cifrado RSA (DevSecOps)

Aplicación de ejemplo para el proyecto final del curso **CIB-204 Seguridad del Software**.
Es un servicio en **Node.js** que **cifra y descifra** texto con **RSA**, empaquetado en
**Docker**, protegido con **IAM (Keycloak)** y con un **pipeline DevSecOps** en GitHub Actions.

> Todos los archivos ya están escritos. Solo tienes que instalarlos y ejecutarlos siguiendo
> la guía de laboratorio. Este README es el resumen rápido.

## Estructura del proyecto

```
proyecto-seguro-cib204/
├── README.md                  <- este archivo
├── .gitignore                 <- archivos que NO se suben (llave privada, node_modules)
├── docker-compose.yml         <- levanta la app + Keycloak con un comando
├── servidor/                  <- el servicio de cifrado
│   ├── package.json           <- dependencias y comandos (start, test, lint)
│   ├── Dockerfile             <- cómo se construye la imagen (endurecida)
│   ├── .dockerignore
│   ├── .eslintrc.json         <- reglas de análisis estático (SAST local)
│   ├── cifrado.js             <- módulo RSA (cifrar / descifrar)
│   ├── auth.js                <- verificación de identidad (IAM)
│   ├── servidor.js            <- el servicio web (endpoints /cifrar y /descifrar)
│   ├── prueba.js              <- prueba rápida por consola
│   └── cifrado.test.js        <- pruebas automáticas (Jest)
├── app-movil/
│   └── README.md              <- cómo crear la app móvil (Expo) que consume el servicio
├── .github/workflows/
│   └── devsecops.yml          <- pipeline: SAST, SCA, imagen, DAST
├── docs/
│   ├── plantilla_diagnostico.csv
│   └── matriz_riesgo.csv
└── .env.example               <- variables de entorno de ejemplo
```

## Inicio rápido (3 pasos)

1. Instala **Docker Desktop** en tu equipo (Windows, macOS o Linux).
2. Abre una terminal en esta carpeta y ejecuta:

   ```
   docker compose up -d --build
   ```

3. Prueba el servicio (por defecto NO pide token). Abre otra terminal y ejecuta:

   ```
   curl -X POST http://localhost:3000/cifrar -H "Content-Type: application/json" -d "{\"texto\":\"hola\"}"
   ```

   Deberías recibir un JSON con el campo `cifrado`.

## Activar la seguridad de identidad (IAM)

Por defecto `AUTH_ENABLED=false` para que puedas probar de inmediato.
Cuando configures Keycloak (Sección 6 de la guía), cambia en `docker-compose.yml`
`AUTH_ENABLED` a `"true"` y el endpoint exigirá un token válido.

## Comandos útiles (dentro de la carpeta servidor/)

```
npm install      # instala dependencias
npm start        # inicia el servicio
npm test         # ejecuta las pruebas (Jest)
npm run lint     # análisis estático (ESLint)
```
