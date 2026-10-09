// cifrado.js
// Modulo de cifrado y descifrado con RSA.
// Usa el modulo 'crypto' que ya viene incluido en Node.js (no requiere librerias de pago).

const crypto = require('crypto');
const fs = require('fs');

// ------------------------------------------------------------------
// Funcion de utilidad: genera un par de llaves RSA (publica y privada)
// y las guarda en archivos .pem.
// - La llave PUBLICA sirve para CIFRAR.
// - La llave PRIVADA sirve para DESCIFRAR (es secreta, no se comparte).
// ------------------------------------------------------------------
function generarLlaves() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // tamano de la llave en bits
    publicKeyEncoding:  { type: 'spki',  format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  fs.writeFileSync('clave_publica.pem', publicKey);
  fs.writeFileSync('clave_privada.pem', privateKey);
  return { publicKey, privateKey };
}

// ------------------------------------------------------------------
// Cifrar: convierte texto legible en texto cifrado (base64).
// Usa relleno seguro OAEP con SHA-256 (la forma correcta de usar RSA).
// ------------------------------------------------------------------
function cifrar(textoPlano, clavePublica) {
  const cifrado = crypto.publicEncrypt(
    { key: clavePublica, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    Buffer.from(textoPlano, 'utf8')
  );
  return cifrado.toString('base64');
}

// ------------------------------------------------------------------
// Descifrar: convierte el texto cifrado de vuelta en texto legible.
// ------------------------------------------------------------------
function descifrar(textoCifradoB64, clavePrivada) {
  const descifrado = crypto.privateDecrypt(
    { key: clavePrivada, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    Buffer.from(textoCifradoB64, 'base64')
  );
  return descifrado.toString('utf8');
}

module.exports = { generarLlaves, cifrar, descifrar };
