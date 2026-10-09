// servidor.js
// El servicio web. Expone dos endpoints protegidos: /cifrar y /descifrar.

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { generarLlaves, cifrar, descifrar } = require('./cifrado');
const { verificarToken } = require('./auth');

const app = express();
// CORS: permite que la aplicacion movil (cliente) consuma el servicio.
// En laboratorio se permite cualquier origen; en produccion se debe RESTRINGIR
// a los origenes de confianza (requisito de seguridad).
app.use(cors());
app.use(express.json());

// Si no existen las llaves, las genera al arrancar.
if (!fs.existsSync('clave_publica.pem') || !fs.existsSync('clave_privada.pem')) {
  generarLlaves();
  console.log('Llaves RSA generadas.');
}
const clavePublica = fs.readFileSync('clave_publica.pem', 'utf8');
const clavePrivada = fs.readFileSync('clave_privada.pem', 'utf8');

// Endpoint de salud (para saber que el servicio esta vivo).
app.get('/salud', (req, res) => res.json({ estado: 'ok' }));

// Cifrar: recibe { "texto": "..." } y devuelve { "cifrado": "..." }
app.post('/cifrar', verificarToken, (req, res) => {
  const texto = req.body.texto;
  // Validacion de entrada (requisito de seguridad).
  if (typeof texto !== 'string' || texto.length === 0 || texto.length > 180) {
    return res.status(400).json({ error: 'Entrada invalida' });
  }
  res.json({ cifrado: cifrar(texto, clavePublica) });
});

// Descifrar: recibe { "cifrado": "..." } y devuelve { "texto": "..." }
app.post('/descifrar', verificarToken, (req, res) => {
  try {
    res.json({ texto: descifrar(req.body.cifrado, clavePrivada) });
  } catch (e) {
    // No revelamos detalles internos del error (buena practica).
    res.status(400).json({ error: 'No se pudo descifrar' });
  }
});

const PORT = process.env.PORT || 3000;
// Solo escucha si se ejecuta directamente (node servidor.js).
// Al importarlo desde una prueba de integracion, NO arranca el puerto.
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => console.log('Servicio de cifrado en el puerto ' + PORT));
}
module.exports = app;
