import app from '../../../../src/app';
import request from 'supertest';
import { JobService } from '../../../../src/services';

jest.mock('../../../../src/services');

describe('JobController', () => {
  it('should return 200 sync tower file success', async () => {
    jest.spyOn(JobService.prototype, 'sync').mockReturnValue(Promise.resolve({ sync: { result: true, jobError: [] } }));

    const response = await request(app).post('/integrations/fs/job/sync').send({
      name: 'tower',
    });
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      sync: { result: true, jobError: [] },
    });
  });

  it('should return 200 sync location file success', async () => {
    jest.spyOn(JobService.prototype, 'sync').mockReturnValue(Promise.resolve({ sync: { result: true, jobError: [] } }));

    const response = await request(app).post('/integrations/fs/job/sync').send({
      name: 'location',
    });
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      sync: { result: true, jobError: [] },
    });
  });

  it('should return 200 on successful autosync', async () => {
    jest.spyOn(JobService.prototype, 'sync').mockReturnValue(Promise.resolve({ sync: { result: true, jobError: [] } }));

    const response = await request(app).post('/integrations/fs/job/auto_sync');
    expect(response.status).toBe(200);
  });
});
