// auth.js
// Verificacion de identidad (IAM). Comprueba que la peticion traiga un token valido
// emitido por Keycloak. Asi solo los usuarios autenticados usan el servicio.
//
// Para empezar SIN Keycloak, deja AUTH_ENABLED=false: el servicio funciona sin token.
// Cuando configures Keycloak (Seccion 6 de la guia), pon AUTH_ENABLED=true.
//
// NOTA IMPORTANTE (integracion):
//  - El token que emite Keycloak lleva un "issuer" (iss) igual al host desde el que
//    lo pediste. Como lo pides desde tu equipo, iss = http://localhost:8080/...
//  - Pero la app corre DENTRO de la red de contenedores y alcanza a Keycloak por el
//    nombre del servicio: http://keycloak:8080/...
//  Por eso separamos: ISSUER (lo que se valida) y JWKS_URI (donde se leen las llaves).

const AUTH_ENABLED = process.env.AUTH_ENABLED === 'true';

// Por defecto (sin auth), el middleware deja pasar la peticion.
let middleware = (req, res, next) => next();

if (AUTH_ENABLED) {
  const { expressjwt } = require('express-jwt');
  const jwksRsa = require('jwks-rsa');

  const ISSUER   = process.env.KEYCLOAK_ISSUER   || 'http://localhost:8080/realms/appmovil';
  const JWKS_URI = process.env.KEYCLOAK_JWKS_URI || 'http://keycloak:8080/realms/appmovil/protocol/openid-connect/certs';

  middleware = expressjwt({
    secret: jwksRsa.expressJwtSecret({ cache: true, jwksUri: JWKS_URI }),
    issuer: ISSUER,
    algorithms: ['RS256']
  });
}

function verificarToken(req, res, next) {
  return middleware(req, res, next);
}

module.exports = { verificarToken };
