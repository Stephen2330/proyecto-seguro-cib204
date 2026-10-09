# Jerarquia de diseno del sistema (CIB-204)

Estructura general y relacion entre modulos y componentes.

Sistema de cifrado seguro
|
|- 1. Aplicacion movil (cliente)            [app-movil/]
|     |- App.js .............. interfaz: cifrar / descifrar, maneja token
|     |- consume via HTTP ->  API de cifrado
|
|- 2. Servicio de cifrado (backend Node.js) [servidor/]
|     |- servidor.js ......... API REST: /salud, /cifrar, /descifrar (+ CORS)
|     |- cifrado.js .......... modulo criptografico RSA-OAEP (cifrar/descifrar/llaves)
|     |- auth.js ............. verificacion de identidad (JWT) - IAM
|     |- Dockerfile ......... imagen endurecida (no-root)
|
|- 3. Gestion de identidad (IAM)            [Keycloak]
|     |- emite y firma tokens JWT (OIDC)
|
|- 4. Orquestacion                          [docker-compose.yml]
|     |- levanta: servicio de cifrado + Keycloak
|
|- 5. Pipeline DevSecOps                     [.github/workflows/]
      |- SAST, SCA, escaneo de imagen, DAST

Relacion principal:
  App movil  --(HTTP + token)-->  Servicio de cifrado  --(valida token)-->  Keycloak
  Servicio de cifrado  --(usa)-->  modulo cifrado.js (RSA)
