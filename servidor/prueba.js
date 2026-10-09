// prueba.js
// Prueba rapida por consola:  node prueba.js
const { generarLlaves, cifrar, descifrar } = require('./cifrado');

const { publicKey, privateKey } = generarLlaves();
const mensaje = 'Nota privada de prueba';
const textoCifrado = cifrar(mensaje, publicKey);
const textoDescifrado = descifrar(textoCifrado, privateKey);

console.log('Mensaje original :', mensaje);
console.log('Cifrado (base64) :', textoCifrado.slice(0, 40) + '...');
console.log('Descifrado       :', textoDescifrado);
console.log('Coincide?        :', mensaje === textoDescifrado);
