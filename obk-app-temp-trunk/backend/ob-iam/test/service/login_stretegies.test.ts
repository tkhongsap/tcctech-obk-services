import * as loginStrategies from '../../src/services/auth_service/login_strategies';
import { Request } from 'express';
import {
  ApiKeyRepository,
  ExternalIdentityRepository,
  IdentityRepository,
  OtpRepository,
  TokenRepository,
} from '../../src/repositories';
import { DateTime } from 'luxon';
import * as encrypt from '../../src/utils/encrypt';
jest.mock('../../src/repositories'); // Mock the module
jest.mock('../../src/utils/encrypt');

describe('Login strategies', () => {
  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();

  describe('using api key strategy', () => {
    describe('with valid api key', () => {
      it('should return account', async () => {
        const mockRequest = {
          headers: {
            'x-api-key-id': 'super-secret-id',
            'x-api-key-secret': 'super-secret-secret',
          },
        } as unknown as Request;

        jest.spyOn(ApiKeyRepository.prototype, 'findActive').mockReturnValue(
          Promise.resolve({
            id: '1',
            secret: 'super-secret-id',
            account_id: 'super-secret-secret',
            created_at: jsDate,
            updated_at: jsDate,
            expired_at: null,
            account: {
              id: '1111',
              password: 'xxxxx',
              created_at: jsDate,
              deleted_at: null,
              updated_at: jsDate,
            },
          }),
        );

        const result = await loginStrategies.apiKeyStrategy(mockRequest);

        expect(result).toEqual({
          id: '1111',
          password: 'xxxxx',
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
        });
      });
    });
    describe('with invalid api key', () => {
      it('should return account', async () => {
        const mockRequest = {
          headers: {
            'x-api-key-id': 'super-secret-id',
            'x-api-key-secret': 'super-secret-secret',
          },
        } as unknown as Request;

        jest
          .spyOn(ApiKeyRepository.prototype, 'findActive')
          .mockReturnValue(Promise.resolve(null));

        const result = await loginStrategies.apiKeyStrategy(mockRequest);

        expect(result).toEqual(null);
      });
    });
  });

  it('should get account successfull', async () => {
    const mockRequest = {
      headers: {
        'x-access-token': 'aabbs',
      },
    } as unknown as Request;

    jest.spyOn(TokenRepository.prototype, 'findBy').mockReturnValue(
      Promise.resolve({
        id: '1',
        account_id: '1111',
        value: '111122',
        expired_date: jsDate,
        active: true,
        created_at: jsDate,
        updated_at: jsDate,
        type: 'long live',
        account: {
          id: '1111',
          password: 'xxxxx',
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
        },
      }),
    );

    const result = await loginStrategies.tokenStrategy(mockRequest);

    expect(result).toEqual({
      id: '1111',
      password: 'xxxxx',
      created_at: jsDate,
      deleted_at: null,
      updated_at: jsDate,
    });
  });

  it('should get account failed', async () => {
    const mockRequest = {
      headers: {
        'x-access-token': 'aabbs',
      },
    } as unknown as Request;

    jest
      .spyOn(TokenRepository.prototype, 'findBy')
      .mockReturnValue(Promise.resolve(null));

    const result = await loginStrategies.tokenStrategy(mockRequest);

    expect(result).toBeNull();
  });

  it('should get account successfull', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.n@gmail.com',
          provider: 'email',
        },
      },
    } as Request;

    jest.spyOn(OtpRepository.prototype, 'findBy').mockReturnValue(
      Promise.resolve({
        id: '1234',
        code: '000000',
        reference: 'abc',
        identifier: 'rungwat.n@gmail.com',
        expired_at: jsDate,
        created_at: jsDate,
        updated_at: jsDate,
      }),
    );

    jest.spyOn(IdentityRepository.prototype, 'findBy').mockReturnValue(
      Promise.resolve({
        id: '1',
        identifier: 'rungwat.n@gmail.com',
        provider: 'email',
        verified_at: null,
        linked_at: null,
        unlinked_at: null,
        account_id: '1111',
        created_at: jsDate,
        updated_at: jsDate,
        default: true,
        meta: {},
        account: {
          id: '1111',
          password: 'xxxxx',
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
        },
      }),
    );

    const result = await loginStrategies.otpStrategy(
      mockRequest,
      '1234',
      'abc',
    );

    expect(result).toEqual({
      id: '1111',
      password: 'xxxxx',
      created_at: jsDate,
      deleted_at: null,
      updated_at: jsDate,
    });
  });

  it('should get account unsuccessfull otpStrategy', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.n@gmail.com',
          provider: 'email',
        },
      },
    } as Request;

    jest
      .spyOn(OtpRepository.prototype, 'findBy')
      .mockReturnValue(Promise.resolve(null));

    const result = await loginStrategies.otpStrategy(
      mockRequest,
      '1234',
      'abc',
    );

    expect(result).toEqual(null);
  });

  it('should get account successfull type mail', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.n@gmail.com',
          provider: 'email',
        },
        password: 'xxxx',
      },
    } as Request;

    jest.spyOn(IdentityRepository.prototype, 'findBy').mockReturnValue(
      Promise.resolve({
        id: '1',
        identifier: 'rungwat.n@gmail.com',
        provider: 'email',
        verified_at: null,
        linked_at: null,
        unlinked_at: null,
        account_id: '1111',
        created_at: jsDate,
        updated_at: jsDate,
        default: true,
        meta: {},
        account: {
          id: '1111',
          password: 'xxxxx',
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
        },
      }),
    );

    jest
      .spyOn(encrypt, 'comparePassword')
      .mockReturnValue(Promise.resolve(true));

    const result = await loginStrategies.passwordStrategy(mockRequest);

    expect(result).toEqual({
      id: '1111',
      password: 'xxxxx',
      created_at: jsDate,
      deleted_at: null,
      updated_at: jsDate,
    });
  });

  it('should get account unsuccessfull no password', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.n@gmail.com',
          provider: 'email',
        },
      },
    } as Request;

    const result = await loginStrategies.passwordStrategy(mockRequest);

    expect(result).toEqual(null);
  });

  it('should get account unsuccessfull acccount password is null', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.n@gmail.com',
          provider: 'email',
        },
        password: 'xxxx',
      },
    } as Request;

    jest.spyOn(IdentityRepository.prototype, 'findBy').mockReturnValue(
      Promise.resolve({
        id: '1',
        identifier: 'rungwat.n@gmail.com',
        provider: 'email',
        verified_at: null,
        linked_at: null,
        unlinked_at: null,
        account_id: '1111',
        created_at: jsDate,
        updated_at: jsDate,
        default: true,
        meta: {},
        account: {
          id: '1111',
          password: null,
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
        },
      }),
    );

    jest
      .spyOn(encrypt, 'comparePassword')
      .mockReturnValue(Promise.resolve(true));

    const result = await loginStrategies.passwordStrategy(mockRequest);

    expect(result).toEqual(null);
  });

  it('should get account successfull type sso', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.n@gmail.com',
          provider: 'sso',
          type: 'google',
        },
      },
    } as Request;

    jest.spyOn(ExternalIdentityRepository.prototype, 'find').mockReturnValue(
      Promise.resolve({
        id: '1',
        uid: '1',
        meta: {},
        type: 'google',
        identifier: 'rungwat.n@gmail.com',
        created_at: jsDate,
        updated_at: jsDate,
        account_id: '1111',
        account: {
          id: '1111',
          password: 'xxxxx',
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
        },
      }),
    );

    const result = await loginStrategies.passwordStrategy(mockRequest);

    expect(result).toEqual({
      id: '1111',
      password: 'xxxxx',
      created_at: jsDate,
      deleted_at: null,
      updated_at: jsDate,
    });
  });
});
