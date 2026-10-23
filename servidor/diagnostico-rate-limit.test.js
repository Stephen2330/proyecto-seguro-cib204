process.env.AUTH_ENABLED = 'false';
process.env.DIAGNOSTIC_ALLOWED_HOSTS = '8.8.8.8';

const request = require('supertest');
const app = require('./servidor');

describe('Límite de solicitudes de /diagnostico', () => {
  test('responde 429 al superar cinco solicitudes por minuto', async () => {
    const responses = [];

    for (let attempt = 0; attempt < 6; attempt += 1) {
      responses.push(
        await request(app)
          .get('/diagnostico')
          .query({ host: '8.8.8.8;id' })
      );
    }

    expect(responses.slice(0, 5).map((response) => response.status))
      .toEqual([400, 400, 400, 400, 400]);
    expect(responses[5].status).toBe(429);
    expect(responses[5].body.error)
      .toBe('Demasiadas solicitudes de diagnóstico. Intenta más tarde.');
  });
});
