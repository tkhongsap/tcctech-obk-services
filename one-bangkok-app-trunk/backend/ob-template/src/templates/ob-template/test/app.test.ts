/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer } from '../src/utils/server';
import request from 'supertest';

describe('App', () => {
  let server: any;

  beforeAll(async () => {
    server = await createServer();
    server.listen(3000, () => {
      console.log(`Listening on http://localhost:3000`);
    });
  });

  it('should return a 200 status code', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
  });
});
