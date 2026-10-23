const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { generarLlaves, cifrar, descifrar } = require('./cifrado');
const { verificarToken } = require('./auth');
const { execFile } = require('node:child_process');
const net = require('node:net');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedDiagnosticHosts = new Set(
  (process.env.DIAGNOSTIC_ALLOWED_HOSTS || '')
    .split(',')
    .map((host) => host.trim())
    .filter((host) => net.isIPv4(host))
);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

if (!fs.existsSync('clave_publica.pem') || !fs.existsSync('clave_privada.pem')) {
  generarLlaves();
  console.log('Llaves RSA generadas.');
}

const clavePublica = fs.readFileSync('clave_publica.pem', 'utf8');
const clavePrivada = fs.readFileSync('clave_privada.pem', 'utf8');

app.get('/salud', (req, res) => res.json({ estado: 'ok' }));

app.get('/diagnostico', verificarToken, (req, res) => {
  const host = req.query.host;

  if (typeof host !== 'string' || !allowedDiagnosticHosts.has(host)) {
    return res.status(400).json({ error: 'Host invalido' });
  }

  execFile(
    '/usr/bin/ping',
    ['-n', '-c', '1', '-W', '2', host],
    { timeout: 3000, maxBuffer: 1024 },
    (error) => {
      if (error && ['ENOENT', 'EACCES', 'EPERM'].includes(error.code)) {
        return res.status(503).json({ error: 'Diagnostico no disponible' });
      }

      return res.json({ host, alcanzable: !error });
    }
  );
});

app.post('/cifrar', verificarToken, (req, res) => {
  const texto = req.body.texto;

  if (typeof texto !== 'string' || texto.length === 0 || texto.length > 180) {
    return res.status(400).json({ error: 'Entrada invalida' });
  }

  res.json({ cifrado: cifrar(texto, clavePublica) });
});

app.post('/descifrar', verificarToken, (req, res) => {
  try {
    res.json({ texto: descifrar(req.body.cifrado, clavePrivada) });
  } catch (e) {
    res.status(400).json({ error: 'No se pudo descifrar' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'No autorizado' });
  }

  return res.status(500).json({ error: 'Error interno' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => console.log('Servicio de cifrado en el puerto ' + PORT));
}

module.exports = app;