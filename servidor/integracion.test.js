// Prueba de INTEGRACION: verifica que el servidor web y el modulo de cifrado
// funcionan juntos de extremo a extremo (sin token, con AUTH_ENABLED=false).
process.env.AUTH_ENABLED = 'false';
const request = require('supertest');
const app = require('./servidor');

describe('Integracion del servicio de cifrado', () => {
  test('GET /salud responde estado ok', async () => {
    const r = await request(app).get('/salud');
    expect(r.status).toBe(200);
    expect(r.body.estado).toBe('ok');
  });

  test('cifrar y luego descifrar devuelve el texto original', async () => {
    const texto = 'Mensaje de integracion CIB-204';
    const c = await request(app).post('/cifrar').send({ texto });
    expect(c.status).toBe(200);
    expect(typeof c.body.cifrado).toBe('string');
    const d = await request(app).post('/descifrar').send({ cifrado: c.body.cifrado });
    expect(d.status).toBe(200);
    expect(d.body.texto).toBe(texto);
  });

  test('rechaza una entrada invalida (texto vacio)', async () => {
    const r = await request(app).post('/cifrar').send({ texto: '' });
    expect(r.status).toBe(400);
  });
});
