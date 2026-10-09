# Requisitos de seguridad y amenazas

## Alcance
App móvil, API Node.js, módulo RSA, Keycloak, Docker Compose y pipeline DevSecOps.

## Requisitos de seguridad

| ID | Propiedad | Requisito | Amenaza relacionada | Control | Verificación |
|---|---|---|---|---|---|
| R-C01 | Confidencialidad | La app no debe guardar el texto sensible en claro; el servicio debe protegerlo con RSA-OAEP. | Divulgación del texto por exposición del dispositivo o del tráfico. | No persistir el texto en el móvil; cifrarlo con RSA-OAEP en el servicio. | Verificar que la app no lo almacene y probar el ciclo de cifrado/descifrado. Anotar que el texto llega al servicio antes de cifrarse. |
| R-I01 | Integridad | El servicio debe rechazar datos o textos cifrados alterados y no procesarlos como válidos. | Modificación de una petición o del texto cifrado. | Validar el formato y fallar de forma segura al descifrar; documentar firma digital o MAC como control adicional si no está implementado. | Alterar un texto cifrado de prueba y comprobar que se rechace sin revelar el texto original ni detalles internos del error. |
| R-D01 | Disponibilidad | La API debe rechazar entradas malformadas o mayores al límite establecido y recuperarse ante fallas del contenedor. | Sobrecarga o caída causada por solicitudes excesivas o malformadas. | Validar las entradas y su tamaño; verificar la política de reinicio configurada en Docker Compose. | Probar entradas inválidas o excesivas y comprobar que el contenedor se reinicie después de detenerlo. |
| R-A01 | Autenticación | Solo solicitudes con un JWT válido de Keycloak pueden usar los endpoints de cifrado y descifrado. | Acceso no autorizado o suplantación mediante un token inválido o ausente. | La API debe validar el JWT de Keycloak antes de permitir el acceso a esas operaciones. | Comprobar que sin token o con token inválido se rechace la solicitud y con uno válido se permita. |

## Modelo de amenazas STRIDE

| Categoría STRIDE | Componente | Amenaza | Control | Propiedad afectada |
|---|---|---|---|---|
| Spoofing (suplantación) | API de cifrado / Keycloak | Una persona sin autorización intenta hacerse pasar por un usuario autorizado para usar el cifrado o descifrado. | La API valida el JWT emitido por Keycloak antes de permitir esas operaciones. | Autenticación |
| Tampering (alteración) | API de cifrado / imagen del contenedor / workflow GitHub Actions | Se modifica el texto cifrado, se sustituye la imagen o se altera el workflow para omitir controles. | Validar y rechazar datos alterados; restringir y revisar cambios en workflows; verificar el digest o firma de imagen cuando se implemente. | Integridad |
| Repudiation (repudio) | API de cifrado / Keycloak | Un usuario niega una operación, o un cambio de configuración queda sin responsable identificable. | Registrar eventos relevantes con fecha y hora; proteger los registros y no incluir texto sensible, contraseñas ni tokens. | Trazabilidad e integridad |
| Information Disclosure (divulgación de información) | App móvil / API / clave privada / registros | Se exponen texto claro, clave privada, JWT o credenciales desde el dispositivo, una petición, los registros o el repositorio. | No guardar secretos en el repositorio ni registrar texto, contraseñas o tokens; limitar el acceso a la clave privada. RSA-OAEP protege los datos una vez que llegan al servicio. | Confidencialidad |
| Denial of Service (denegación de servicio) | API Node.js / contenedor | Un atacante envía muchas solicitudes o entradas demasiado grandes para agotar recursos y dejar el servicio inaccesible. | Validar solicitudes y limitar el tamaño de entrada; verificar la política de reinicio del contenedor. | Disponibilidad |
| Elevation of Privilege (elevación de privilegios) | Contenedor del servicio / API | Un proceso o usuario obtiene permisos superiores a los necesarios, por ejemplo, si el contenedor se ejecuta como root. | Ejecutar el servicio como usuario no-root y aplicar mínimo privilegio; comprobar la configuración del Dockerfile. | Confidencialidad e integridad |