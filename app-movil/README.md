# Aplicacion movil (cliente) - Cifrado CIB-204

App Expo / React Native que consume el servicio de cifrado (endpoints /cifrar y /descifrar).

## Ejecutar en la nube (Expo Web, lo mas simple)
1. Ten el servicio corriendo:  docker compose up -d --build   (desde la raiz del proyecto)
2. En una terminal, entra a esta carpeta:  cd app-movil
3. Instala dependencias:  npm install
4. Inicia en modo web:  npx expo start --web
5. Se abrira una pagina (Codespaces reenvia el puerto). Deja la URL del servicio en
   http://localhost:3000, escribe un texto y pulsa "Cifrar" y luego "Descifrar".

Si el navegador bloquea la llamada, confirma que el servicio tiene CORS activado
(ya viene activado en servidor.js) y que esta en ejecucion.

## Ejecutar en un telefono (opcional)
1. Instala "Expo Go" desde la tienda de tu telefono.
2. Ejecuta:  npx expo start --tunnel   y escanea el codigo QR.
3. Cambia la URL del servicio por la URL publica que reenvia Codespaces para el puerto 3000.

## Con autenticacion (AUTH_ENABLED=true)
Obten un token (ver la guia, seccion IAM) y pegalo en el campo "Token" de la app.

## Requisitos de seguridad de la app movil (para el informe)
- Comunicacion cifrada (HTTPS/TLS) con el servicio en produccion.
- No almacenar la clave privada ni secretos en el dispositivo.
- Validar la entrada antes de enviarla.
- Manejar los errores sin exponer detalles internos.
