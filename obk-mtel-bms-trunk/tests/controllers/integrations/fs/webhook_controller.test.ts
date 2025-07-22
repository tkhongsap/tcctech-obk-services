import app from '../../../../src/app';
import request from 'supertest';

import WebhookService from '../../../../src/services/webhook_service';

jest.mock('../../../../src/services/webhook_service');

const headers: { [key: string]: string } = {};

beforeEach(() => {
  headers['x-permissions'] =
    'eyJwZXJtaXNzaW9uIjogWyAgeyAidmFsdWUiOiB7InJlc291cmNlX3R5cGUiOiAiZnMiLCAiYWN0aW9ucyI6IFsiKiJdIH0gfV19';
});

describe('POST /intefrations/fs/webhook', () => {
  it('should return 200 type callLift', async () => {
    jest.spyOn(WebhookService.prototype, 'handle').mockReturnValue(Promise.resolve());
    const response = await request(app)
      .post('/integrations/fs/webhook')
      .set(headers)
      .send({
        action: 'lift.called',
        payload: {
          personID: 'xxxx',
          liftName: '4',
          floorName: '3D',
          towerName: 'test',
        },
      });
    expect(response.status).toBe(200);
  });
  it('should return 200 type access-turnstile', async () => {
    jest.spyOn(WebhookService.prototype, 'handle').mockReturnValue(Promise.resolve());
    const response = await request(app)
      .post('/integrations/fs/webhook')
      .set(headers)
      .send({
        action: 'visitor.passed',
        payload: {
          inviteID: 'xxxx',
          liftName: '4',
          floorName: '3D',
          towerName: 'test',
        },
      });
    expect(response.status).toBe(200);
  });
  it('should return 500', async () => {
    jest.spyOn(WebhookService.prototype, 'handle').mockRejectedValue(new Error());
    const response = await request(app)
      .post('/integrations/fs/webhook')
      .set(headers)
      .send({
        action: 'xxxxx',
        payload: {
          personID: 'xxxx',
          liftName: '4',
          floorName: '3D',
          towerName: 'test',
        },
      });
    expect(response.status).toBe(500);
  });
});
