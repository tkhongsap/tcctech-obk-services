import request from 'supertest';
import app from '../src/app';

const server = app.listen(); // This starts the server

afterAll((done) => {
  server.close(done); // Close server after all tests
});

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
  });
});

describe('GET /docs', () => {
  it('should return 301 OK', async () => {
    const res = await request(server).get('/docs');
    expect(res.status).toBe(301);
  });
});
