import config, { validate } from './configuration';
import { Logger } from '@nestjs/common';

describe('Config validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return an object', () => {
    const result = config();
    expect(typeof result).toBe('object');
    expect(result).not.toBeNull();
  });

  it('should return parsed config when valid', () => {
    const result = validate({ PORT: '3000', DATABASE_URL: 'test' });

    expect(result).toEqual({ PORT: '3000', DATABASE_URL: 'test' });
  });

  it('should log and throw when config is invalid', () => {
    const loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation();

    expect(() => validate({ PORT: '' })).toThrow(
      'Environment validation failed',
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Environment validation failed with the following errors:',
      expect.anything(),
    );

    loggerErrorSpy.mockRestore();
  });
});
