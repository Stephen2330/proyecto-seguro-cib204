# Colección de Bruno — API de cifrado (CIB-204)

Peticiones listas para probar el servicio con **Bruno** (https://www.usebruno.com),
una aplicación gratuita y de código abierto, sin necesidad de cuenta.

## Cómo usarla
1. Abre Bruno.
2. Pulsa **Open Collection** y selecciona esta carpeta (`api-bruno`).
3. Arriba a la derecha, en el selector de entornos, elige **Local**
   (define `host` = http://localhost:3000 y `keycloak` = http://localhost:8080).
4. Haz clic en cualquier petición y pulsa **Send** (o Ctrl+Enter).

## Peticiones incluidas
- **1-Salud** — comprueba que el servicio está arriba.
- **2-Cifrar-sin-token** — cifra un texto (válido con AUTH_ENABLED=false).
- **3-Descifrar** — descifra (pega antes el valor "cifrado" que obtuviste).
- **4-Pedir-token** — pide un token a Keycloak y lo guarda automáticamente
  en la variable `token`. Antes de enviarla, cambia `password` por la clave real del usuario demo.
- **5-Cifrar-con-token** — cifra usando el token del paso anterior (envío autenticado).
