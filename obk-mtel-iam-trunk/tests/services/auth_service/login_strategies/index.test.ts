import * as loginStrategies from '../../../../src/services/auth_service/login_strategies';
import AccountRepository from '../../../../src/repositories/account_repository';
import { DateTime } from 'luxon';
import * as encrypt from '../../../../src/utils/encrypt';
import { LoginBody } from '../../../../src/controllers/auth_controller.interfaces';
jest.mock('../../../../src/utils/encrypt');

import { resetDB } from '../../../helpers/db';
import { ExternalIdentityType } from '../../../../db/client/index';
import { compositeStrategy, passwordStrategy } from '../../../../src/services/auth_service/login_strategies';
import { TypedRequest } from '../../../../src/libs/custom_express';

describe('Login strategies', () => {
  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();

  describe('Login strategies - passwordStrategy', () => {
    beforeEach(async () => {
      await resetDB();
    });

    it('should get account successfull type mail', async () => {
      const account = await AccountRepository.create({
        data: {
          password: 'xxxxx',
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
          suspend_at: null,
          identities: {
            createMany: {
              data: {
                identifier: 'test@mail.com',
                provider: 'email',
                verified_at: null,
                linked_at: null,
                unlinked_at: null,
                created_at: jsDate,
                updated_at: jsDate,
                default: true,
                meta: {},
              },
            },
          },
        },
        include: { identities: true },
      });
      const mockRequestEmail = {
        body: {
          identity: {
            identifier: account.identities[0].identifier,
            provider: account.identities[0].provider,
          },
          password: account.password,
        },
      } as TypedRequest<LoginBody>;
      jest.spyOn(encrypt, 'comparePassword').mockReturnValue(Promise.resolve(true));

      const result = await loginStrategies.passwordStrategy(mockRequestEmail);

      expect(result).toEqual({
        id: account.id,
        password: account.password,
        created_at: account.created_at,
        deleted_at: account.deleted_at,
        updated_at: account.updated_at,
        suspend_at: account.suspend_at,
      });
    });

    it('should get account unsuccessfull no password', async () => {
      const mockRequesNoPassword = await AccountRepository.create({
        data: {
          password: null,
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
          identities: {
            createMany: {
              data: {
                identifier: 'testnopass@mail.com',
                provider: 'email',
                verified_at: null,
                linked_at: null,
                unlinked_at: null,
                created_at: jsDate,
                updated_at: jsDate,
                default: true,
                meta: {},
              },
            },
          },
        },
        include: { identities: true },
      });
      const mockRequest = {
        body: {
          identity: {
            identifier: mockRequesNoPassword.identities[0].identifier,
            provider: mockRequesNoPassword.identities[0].provider,
          },
        },
      } as TypedRequest<LoginBody>;

      const result = await loginStrategies.passwordStrategy(mockRequest);

      expect(result).toEqual(null);
    });

    it('should get account unsuccessfull acccount password is null', async () => {
      const mockRequesNoPassword = await AccountRepository.create({
        data: {
          password: null,
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
          identities: {
            createMany: {
              data: {
                identifier: 'testnopass@mail.com',
                provider: 'email',
                verified_at: null,
                linked_at: null,
                unlinked_at: null,
                created_at: jsDate,
                updated_at: jsDate,
                default: true,
                meta: {},
              },
            },
          },
        },
        include: { identities: true },
      });
      const mockRequest = {
        body: {
          identity: {
            identifier: mockRequesNoPassword.identities[0].identifier,
            provider: mockRequesNoPassword.identities[0].provider,
          },
          password: '12345678',
        },
      } as TypedRequest<LoginBody>;
      jest.spyOn(encrypt, 'comparePassword').mockReturnValue(Promise.resolve(true));

      const result = await loginStrategies.passwordStrategy(mockRequest);

      expect(result).toEqual(null);
    });

    it('should get account successfull type sso', async () => {
      const identifier = 'testsso@mail.com';
      const accountNoPassword = await AccountRepository.create({
        data: {
          password: null,
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
          identities: {
            createMany: {
              data: {
                identifier: identifier,
                provider: 'sso',
                verified_at: null,
                linked_at: null,
                unlinked_at: null,
                created_at: jsDate,
                updated_at: jsDate,
                default: true,
                meta: {},
              },
            },
          },
          external_identity: {
            createMany: {
              data: {
                identifier: identifier,
                uid: '',
                type: 'google' as ExternalIdentityType,
                meta: {},
              },
            },
          },
        },
        include: { identities: true, external_identity: true },
      });
      const mockRequest = {
        body: {
          identity: {
            identifier: accountNoPassword.identities[0].identifier,
            provider: accountNoPassword.identities[0].provider,
            type: accountNoPassword.external_identity[0].type,
          },
        },
      } as TypedRequest<LoginBody>;

      const result = await loginStrategies.passwordStrategy(mockRequest);

      expect(result).toEqual({
        id: accountNoPassword.id,
        password: accountNoPassword.password,
        created_at: accountNoPassword.created_at,
        deleted_at: accountNoPassword.deleted_at,
        updated_at: accountNoPassword.updated_at,
        suspend_at: accountNoPassword.suspend_at,
      });
    });
  });
  describe('Login strategies - compositeStrategy', () => {
    beforeEach(async () => {
      await resetDB();
    });

    it('should get account successfull type mail', async () => {
      const accountMock = await AccountRepository.create({
        data: {
          password: 'xxxxx',
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
          identities: {
            createMany: {
              data: {
                identifier: 'test@mail.com',
                provider: 'email',
                verified_at: null,
                linked_at: null,
                unlinked_at: null,
                created_at: jsDate,
                updated_at: jsDate,
                default: true,
                meta: {},
              },
            },
          },
        },
        include: { identities: true },
      });
      const mockRequestEmail = {
        body: {
          identity: {
            identifier: accountMock.identities[0].identifier,
            provider: accountMock.identities[0].provider,
          },
          password: accountMock.password,
        },
      } as TypedRequest<LoginBody>;
      const { account } = await compositeStrategy(mockRequestEmail, [passwordStrategy]);

      jest.spyOn(encrypt, 'comparePassword').mockReturnValue(Promise.resolve(true));

      const result = await loginStrategies.passwordStrategy(mockRequestEmail);

      expect(result).toEqual({
        id: account?.id,
        password: account?.password,
        created_at: account?.created_at,
        updated_at: account?.updated_at,
        deleted_at: account?.deleted_at,
        suspend_at: account?.suspend_at,
      });
    });
    it('should get account unsuccessfull no password', async () => {
      const mockRequesNoPassword = await AccountRepository.create({
        data: {
          password: null,
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
          identities: {
            createMany: {
              data: {
                identifier: 'testnopass@mail.com',
                provider: 'email',
                verified_at: null,
                linked_at: null,
                unlinked_at: null,
                created_at: jsDate,
                updated_at: jsDate,
                default: true,
                meta: {},
              },
            },
          },
        },
        include: { identities: true },
      });
      const mockRequest = {
        body: {
          identity: {
            identifier: mockRequesNoPassword.identities[0].identifier,
            provider: mockRequesNoPassword.identities[0].provider,
          },
        },
      } as TypedRequest<LoginBody>;

      const { account } = await compositeStrategy(mockRequest, [passwordStrategy]);

      expect(account).toEqual(null);
    });
  });
});
