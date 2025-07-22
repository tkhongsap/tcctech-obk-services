import { createServer } from '../../src/utils/server';
import { Application } from 'express';
import request from 'supertest';
import { EventConsumer } from 'ob-common-lib/dist/utils/kafka';

jest.mock('ob-common-lib/dist/utils/kafka');

describe('createServer', () => {
  let app: Application;

  beforeEach(async () => {
    jest.spyOn(EventConsumer, 'start');
    app = await createServer();
  });

  it('should return a valid Express application', () => {
    expect(app).toBeDefined();
  });

  it('should handle a GET request to the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should handle a non-existing route and return a 404 error', async () => {
    const response = await request(app).get('/non-existing');
    expect(response.status).toBe(500);
  });
});
