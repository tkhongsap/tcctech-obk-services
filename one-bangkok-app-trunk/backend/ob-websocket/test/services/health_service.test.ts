import { HealthService } from '../../src/services/health_service';
// import {
//   IdentityData,
//   RegisterServiceData,
// } from '../../src/services/interfaces/register_interface';
// import { instance, mock, when } from 'ts-mockito';
// import { DateTime } from 'luxon';
// import { CustomError } from '../../src/middlewares/error_middleware';

describe('HealthService', () => {
  let healthService: HealthService;

  beforeEach(() => {
    healthService = new HealthService();
  });

  it('should check health successfully', async () => {

    const token = await healthService.checkHealth();

    expect(token).toBeDefined();
    // Add more assertions as needed
  });

  
});
