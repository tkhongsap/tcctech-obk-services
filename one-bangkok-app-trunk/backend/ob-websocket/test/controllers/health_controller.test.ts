import { NextFunction } from 'express';
import logging from '../../src/utils/logging';
import HealthController from '../../src/controllers/health_controller';
import { TypedRequest, TypedResponse } from '../../src/libs/custom_express';
import { schemas } from '../../src/openapi/interfaces/schemas';

jest.mock('../../src/services/register_service');
jest.mock('../../src/utils/logging');

describe('health', () => {
  let req: TypedRequest<never>;
  let res: TypedResponse<schemas['HealthResponse']>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        gender: 'male',
        title: 'Mr.',
        firstName: 'John',
        middleName: 'Doe',
        lastName: 'Smith',
        dob: '1990-01-01',
        identity: [
          {
            identifier: '1234567890',
            provider: 'phone',
            uid: 'abc123',
            providerType: 'sms',
          },
        ],
      },
    } as TypedRequest<never>;

    res = {
      json: jest.fn(),
    } as unknown as  TypedResponse<schemas['HealthResponse']>;

    next = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call health', async () => {
    const loggingInfoSpy = jest.spyOn(logging, 'info');
    const health = new HealthController();
    await health.get(req, res);

    expect(loggingInfoSpy).toHaveBeenCalledWith('start call health');
    expect(loggingInfoSpy).toHaveBeenCalledWith('finish call health');
    expect(next).not.toHaveBeenCalled();
  });
});
