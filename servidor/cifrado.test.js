// cifrado.test.js
// Pruebas automaticas con Jest:  npm test
const { generarLlaves, cifrar, descifrar } = require('./cifrado');

const { publicKey, privateKey } = generarLlaves();

test('el texto descifrado es igual al original', () => {
  const mensaje = 'dato secreto';
  const c = cifrar(mensaje, publicKey);
  expect(descifrar(c, privateKey)).toBe(mensaje);
});

test('el texto cifrado NO es igual al original', () => {
  const mensaje = 'dato secreto';
  expect(cifrar(mensaje, publicKey)).not.toBe(mensaje);
});

test('un dato alterado no se descifra (integridad)', () => {
  const c = cifrar('hola', publicKey);
  const alterado = 'AA' + c.slice(2);
  expect(() => descifrar(alterado, privateKey)).toThrow();
});
