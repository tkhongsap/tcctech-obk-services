import { DateTime } from 'luxon';
import { BASE_PERMISSION } from '../../../src/constants/base_permission';
import AuthService from '../../../src/services/auth_service';
import { PermitteeType, Prisma } from '../../../db/client/index';
import * as jwt from 'jsonwebtoken';
import AccountRepository from '../../../src/repositories/account_repository';
import * as loginStrategies from '../../../src/services/auth_service/login_strategies';
import { LoginBody } from '../../../src/controllers/auth_controller.interfaces';
import { resetDB } from '../../helpers/db';
import { exportKey, generateKeyPair } from '../../../src/utils/encrypt';
import { TypedRequest } from '../../../src/libs/custom_express';
import { CustomError } from '../../../src/midlewares/error';
import { OBError } from '../../../src/utils/error_spec';
import SettingRepository from '../../../src/repositories/setting_repository';
import AttachedPermissionRepository from '../../../src/repositories/attached_permission_repository';
import { DateTimeUtils } from '../../../src/utils/datetime';
import dayjs from 'dayjs';
import TokenRepository from '../../../src/repositories/token_repository';
import DeviceRepository from '../../../src/repositories/device_repository';
import WhitelistRepository from '../../../src/repositories/whitelist_repository';
import * as EventProducer from '../../../src/utils/kafka/event_producer';

jest.mock('../../../src/services/auth_service/login_strategies');
jest.mock('jsonwebtoken');
type accountWithIdentitiesType = Prisma.accountGetPayload<{
  include: {
    identities: true;
  };
}>;
describe('Auth service - generateToken', () => {
  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();

  beforeEach(async () => {
    await resetDB();
  });

  it('should generate token success', async () => {
    const attachedPermissions: Prisma.attached_permissionCreateManyAccountInput[] = BASE_PERMISSION.map(
      (permission) => {
        return {
          permittee_type: PermitteeType.account,
          value: JSON.parse(JSON.stringify(permission)),
        };
      },
    );
    const mockAccount = await AccountRepository.create({
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
        attached_permission: { createMany: { data: attachedPermissions } },
      },
      include: { identities: true },
    });
    jest.spyOn(loginStrategies, 'compositeStrategy').mockResolvedValue({
      account: mockAccount,
      strategy: 'passwordStrategy',
      result: false,
    });

    jest.spyOn(jwt, 'sign').mockReturnValue();
    jest.spyOn(EventProducer, 'send').mockReturnValue();

    const authService = new AuthService();
    const token = await authService.generateToken(mockAccount.id);

    expect(token).not.toBeNull();
  });

  it('should generate not success', async () => {
    const authService = new AuthService();
    try {
      expect(await authService.generateToken('1111')).toThrowError();
    } catch (error) {
      expect(error).toStrictEqual(new Error('Failed to generate token'));
    }
  });
});
describe('Auth service - login', () => {
  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();

  let mockAccount: accountWithIdentitiesType;
  let mockDeletedAccount: accountWithIdentitiesType;
  beforeAll(async () => {
    await resetDB();
    const attachedPermissions: Prisma.attached_permissionCreateManyAccountInput[] = BASE_PERMISSION.map(
      (permission) => {
        return {
          permittee_type: PermitteeType.account,
          value: JSON.parse(JSON.stringify(permission)),
        };
      },
    );
    mockAccount = await AccountRepository.create({
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
        attached_permission: { createMany: { data: attachedPermissions } },
      },
      include: { identities: true },
    });
    mockDeletedAccount = await AccountRepository.create({
      data: {
        password: 'aaaa',
        created_at: jsDate,
        deleted_at: jsDate.toISOString(),
        updated_at: jsDate,
        identities: {
          createMany: {
            data: {
              identifier: 'testdelete@mail.com',
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
        attached_permission: { createMany: { data: attachedPermissions } },
      },
      include: { identities: true },
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should login success', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: mockAccount.identities[0].identifier,
          provider: mockAccount.identities[0].provider,
        },
        password: mockAccount.password,
        device: {
          device_id: 'abc',
          os: 'ios',
        },
      },
    } as TypedRequest<LoginBody>;
    const ssoAccount = {
      profile: {
        first_name: 'rungwat',
        middle_name: '',
        last_name: 'naksuwan',
        dob: '1994/11/09',
        gender: 'male',
      },
      identities: [
        {
          identifier: 'rungwat.nak@mtel.co.th',
          provider: 'sso',
        },
      ],
      password: null,
      device: {
        device_id: '1123',
        os: 'ios',
      },
      push_token: {
        value: 'xx',
        type: 'FCM',
      },
    };

    const mockAccountSSO = {
      id: '1111',
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: null,
      suspend_at: null,
      ...ssoAccount,
    };

    jest.spyOn(loginStrategies, 'compositeStrategy').mockResolvedValue({
      account: mockAccountSSO,
      strategy: 'passwordStrategy',
      result: false,
    });

    const setting: any = {
      id: '1',
      account_id: '1111',
      two_factor_authentication_enabled: false,
      updated_at: jsDate,
      created_at: jsDate,
    };
    jest.spyOn(SettingRepository, 'findFirstOrThrow').mockReturnValue(setting);

    jest.spyOn(AttachedPermissionRepository, 'findMany').mockReturnValue(
      Promise.resolve([
        {
          id: '1',
          account_id: '1111',
          permittee_type: PermitteeType.account,
          value: '',
          created_at: jsDate,
          updated_at: jsDate,
          deleted_at: null,
          account_group_id: null,
          role_id: '111',
        },
      ]) as any,
    );

    jest.spyOn(jwt, 'sign').mockReturnValue();

    jest.spyOn(DateTimeUtils, 'formatDate').mockReturnValue(jsDate.toDateString());
    const currentDay = dayjs();
    jest.spyOn(DateTimeUtils, 'getCurrentDateTime').mockReturnValue(currentDay);

    jest.spyOn(DateTimeUtils, 'addTime').mockReturnValue(currentDay);

    jest.spyOn(DateTimeUtils, 'formatDate').mockReturnValue(currentDay.toString());

    jest.spyOn(TokenRepository, 'create').mockReturnValue(
      Promise.resolve({
        id: '1',
        value: 'xxx',
        account_id: '1111',
        expired_date: jsDate,
        type: 'long live',
        created_at: jsDate,
        updated_at: jsDate,
        active: true,
      }) as any,
    );
    jest.spyOn(DeviceRepository, 'create').mockReturnValue(
      Promise.resolve({
        id: '1',
        account_id: '1111',
        device_id: '1111',
        os: 'ios',
        active: true,
        created_at: jsDate,
        updated_at: jsDate,
      }) as any,
    );
    const authService = new AuthService();
    const token = await authService.login(mockRequest);

    expect(token).not.toBeNull();
  });

  it('should login unsuccess return error when account was deleted', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: mockDeletedAccount.identities[0].identifier,
          provider: mockDeletedAccount.identities[0].provider,
        },
        password: mockDeletedAccount.password,
      },
    } as TypedRequest<LoginBody>;

    jest.spyOn(loginStrategies, 'compositeStrategy').mockResolvedValue({
      account: mockDeletedAccount,
      strategy: 'passwordStrategy',
      result: false,
    });

    const authService = new AuthService();

    await expect(async () => authService.login(mockRequest)).rejects.toThrowError(
      new CustomError(OBError.IAM_AUTH_003),
    );
  });

  it('should login unsuccess return result', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'no@email.com',
          provider: mockAccount.identities[0].provider,
        },
        password: mockAccount.password,
      },
    } as TypedRequest<LoginBody>;

    jest.spyOn(loginStrategies, 'compositeStrategy').mockResolvedValue({
      account: null,
      strategy: 'passwordStrategy',
      result: false,
    });

    const authService = new AuthService();

    await expect(async () => authService.login(mockRequest)).rejects.toThrowError(
      new CustomError(OBError.IAM_AUTH_002),
    );
  });
});

describe('AuthService', () => {
  beforeEach(async () => {
    await resetDB();
    jest.restoreAllMocks();
  });

  describe('generateQRToken', () => {
    it('should create QR token successfully', async () => {
      const fsKeyPair = await generateKeyPair();
      const fsParkingKeyPair = await generateKeyPair();

      await AccountRepository.create({
        data: {
          api_key: {
            create: {
              secret: 'super-secret',
              key_pairs: {
                createMany: {
                  data: [
                    {
                      name: 'fs',
                      public: await exportKey(fsKeyPair.publicKey),
                      private: await exportKey(fsKeyPair.privateKey),
                    },
                    {
                      name: 'fs_parking',
                      public: await exportKey(fsParkingKeyPair.publicKey),
                      private: await exportKey(fsParkingKeyPair.privateKey),
                    },
                  ],
                },
              },
            },
          },
        },
      });

      const account = await AccountRepository.create({
        data: {
          external_identity: {
            create: {
              type: 'fs',
              uid: '1234',
              identifier: '1234',
              meta: {},
            },
          },
        },
      });

      const authService = new AuthService();
      const qrToken = await authService.generateQRToken(account.id);
      // TODO: add test to verify qr token payload
      expect(qrToken).not.toBeNull();
    });
  });

  describe('validateIdentity', () => {
    describe('without existing identty', () => {
      it('return true', async () => {
        process.env.ENABLE_REGISTRATION_WHITELIST = 'false';

        const authService = new AuthService();
        const result = await authService.validateIdentity('test@test.com', 'email');

        expect(result).toBe(true);
      });
    });

    describe('with existing identty', () => {
      it('return false', async () => {
        process.env.ENABLE_REGISTRATION_WHITELIST = 'false';

        await AccountRepository.create({
          data: {
            identities: {
              create: {
                identifier: 'test@test.com',
                provider: 'email',
              },
            },
          },
        });

        const authService = new AuthService();
        const result = await authService.validateIdentity('test@test.com', 'email');

        expect(result).toBe(false);
      });
    });

    describe('with whitelist enabled', () => {
      describe('when identity is not in the whitelist', () => {
        it('return false', async () => {
          process.env.ENABLE_REGISTRATION_WHITELIST = 'true';

          const authService = new AuthService();

          await expect(authService.validateIdentity('test@test.com', 'email')).rejects.toThrow(
            new CustomError(OBError.IAM_IDT_0010),
          );
          process.env.ENABLE_REGISTRATION_WHITELIST = 'false';
        });
      });

      describe('when identity type is keycloak', () => {
        it('return true', async () => {
          process.env.ENABLE_REGISTRATION_WHITELIST = 'true';
          await WhitelistRepository.create({ data: { type: 'email', value: 'test@test.com' } });
          const authService = new AuthService();
          const result = await authService.validateIdentity('test@test.com', 'keycloak');

          expect(result).toBe(true);
        });
      });
    });
  });

  describe('validateWhitelist', () => {
    beforeEach(() => {
      process.env.ENABLE_REGISTRATION_WHITELIST = 'true';
    });

    afterEach(() => {
      process.env.ENABLE_REGISTRATION_WHITELIST = 'false';
      process.env.REGISTRATION_WHITELIST_EMAIL_DOMAIN = '';
      process.env.REGISTRATION_WHITELIST_EMAIL = '';
      process.env.REGISTRATION_WHITELIST_PHONE_NUMBER = '';
    });

    describe('with whitelisted domain', () => {
      describe('when domain is not whitelisted', () => {
        it('should return false', async () => {
          const authService = new AuthService();
          const result = await authService.validateWhitelist('test@test.com', 'email');

          expect(result).toBe(false);
        });
      });
    });

    describe('with whitelisted domain', () => {
      describe('when domain is whitelisted', () => {
        it('return true', async () => {
          await WhitelistRepository.create({ data: { type: 'domain', value: 'test1.com' } });
          await WhitelistRepository.create({ data: { type: 'domain', value: 'test2.com' } });

          const authService = new AuthService();
          const result1 = await authService.validateWhitelist('test@test1.com', 'email');
          const result2 = await authService.validateWhitelist('test@test2.com', 'email');

          expect(result1).toBe(true);
          expect(result2).toBe(true);
        });
      });

      describe('when domain is not whitelisted', () => {
        it('return false', async () => {
          const authService = new AuthService();
          const result = await authService.validateWhitelist('test@test1.com', 'email');

          expect(result).toBe(false);
        });
      });
    });

    describe('with whitelisted email', () => {
      describe('when email is whitelisted', () => {
        it('return true', async () => {
          await WhitelistRepository.create({ data: { type: 'email', value: 'test@test1.com' } });
          await WhitelistRepository.create({ data: { type: 'email', value: 'test@test2.com' } });

          const authService = new AuthService();
          const result1 = await authService.validateWhitelist('test@test1.com', 'email');
          const result2 = await authService.validateWhitelist('test@test2.com', 'email');

          expect(result1).toBe(true);
          expect(result2).toBe(true);
        });
      });

      describe('when email is not whitelisted', () => {
        it('return false', async () => {
          const authService = new AuthService();
          const result = await authService.validateWhitelist('test@test1.com', 'email');

          expect(result).toBe(false);
        });
      });
    });

    describe('with whitelisted phone number', () => {
      describe('when phone number is whitelisted', () => {
        it('return true', async () => {
          await WhitelistRepository.create({ data: { type: 'phone', value: '123' } });
          await WhitelistRepository.create({ data: { type: 'phone', value: '456' } });

          const authService = new AuthService();
          const result1 = await authService.validateWhitelist('123', 'phone');
          const result2 = await authService.validateWhitelist('456', 'phone');

          expect(result1).toBe(true);
          expect(result2).toBe(true);
        });
      });

      describe('when phone is not whitelisted', () => {
        it('return false', async () => {
          const authService = new AuthService();
          const result = await authService.validateWhitelist('123', 'phone');

          expect(result).toBe(false);
        });
      });
    });
  });
});
