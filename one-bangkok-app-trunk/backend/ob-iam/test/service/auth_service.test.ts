import DeviceService from '../../src/services/device_service';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { DateTime } from 'luxon';
import {
  AccountRepository,
  IdentityRepository,
  TokenRepository,
  SettingRepository,
  ExternalIdentityRepository,
} from '../../src/repositories';
import AttachedPermissionRepository from '../../src/repositories/attached_permission_repository';
import { AuthService } from '../../src/services';
import {
  IdentityProvider,
  PermitteeType,
  ProfileGender,
} from '../../db/client';
import * as jwt from 'jsonwebtoken';
import * as utils from 'ob-common-lib/dist';
import dayjs from 'dayjs';
import { Request } from 'express';
import * as loginStrategies from '../../src/services/auth_service/login_strategies';
import { CustomError } from '../../src/middlewares/error';
import { OBError } from '../../src/openapi/error_spec';
import BaseRepository from '../../src/repositories/base_repository';

jest.mock('../../src/services/auth_service/login_strategies'); // Mock the module

jest.mock('jsonwebtoken'); // Mock the module
jest.mock('ob-common-lib/dist');
jest.mock('../../src/repositories/base_repository');

describe('Auth service', () => {
  let accountRepository: AccountRepository;
  let identityRepository: IdentityRepository;
  let tokenRepository: TokenRepository;
  let settingRepository: SettingRepository;
  let attachedPermissionRepository: AttachedPermissionRepository;
  let deviceService: DeviceService;
  let authService: AuthService;
  let externalIdentityRepository: ExternalIdentityRepository;

  beforeEach(() => {
    accountRepository = mock(AccountRepository);
    identityRepository = mock(IdentityRepository);
    tokenRepository = mock(TokenRepository);
    settingRepository = mock(SettingRepository);
    attachedPermissionRepository = mock(AttachedPermissionRepository);
    deviceService = mock(DeviceService);
    externalIdentityRepository = mock(ExternalIdentityRepository);
    authService = new AuthService(
      instance(accountRepository),
      instance(identityRepository),
      instance(tokenRepository),
      instance(settingRepository),
      instance(attachedPermissionRepository),
      instance(deviceService),
      instance(externalIdentityRepository),
    );
  });

  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();

  const ssoAccount = {
    profile: {
      first_name: 'rungwat',
      middle_name: '',
      last_name: 'naksuwan',
      dob: '1994/11/09',
      gender: ProfileGender.male,
    },
    identities: [
      {
        identifier: 'rungwat.nak@mtel.co.th',
        provider: IdentityProvider.sso,
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

  it('should validate identity successful return false', async () => {
    when(
      identityRepository.findIdentity('rungwat.nak@mtel.co.th', 'phone'),
    ).thenReturn(
      Promise.resolve({
        id: '',
        account_id: '',
        identifier: '',
        provider: IdentityProvider.email,
        verified_at: jsDate,
        linked_at: jsDate,
        unlinked_at: jsDate,
        updated_at: jsDate,
        created_at: jsDate,
        default: true,
        meta: {},
      }),
    );

    const result = await authService.validateIdentity(
      'rungwat.nak@mtel.co.th',
      'phone',
    );

    expect(result).toEqual(false);
  });

  it('should validate identity successful return true', async () => {
    when(
      identityRepository.findIdentity('rungwat.nak@mtel.co.th', 'phone'),
    ).thenReturn(Promise.resolve(null));

    const result = await authService.validateIdentity(
      'rungwat.nak@mtel.co.th',
      'phone',
    );

    expect(result).toEqual(true);
  });

  it('should validate identity successful return true', async () => {
    when(
      identityRepository.findIdentity('rungwat.nak@mtel.co.th', 'phone'),
    ).thenReturn(Promise.resolve(null));

    const result = await authService.validateIdentity(
      'rungwat.nak@mtel.co.th',
      'phone',
    );

    expect(result).toEqual(true);
  });

  it('should generate token success', async () => {
    when(
      attachedPermissionRepository.findMany(deepEqual({ account_id: '1111' })),
    ).thenReturn(
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
      ]),
    );

    jest.spyOn(jwt, 'sign').mockReturnValue();

    jest
      .spyOn(utils.DateTimeUtils, 'formatDate')
      .mockReturnValue(jsDate.toDateString());
    const currentDay = dayjs();
    jest
      .spyOn(utils.DateTimeUtils, 'getCurrentDateTime')
      .mockReturnValue(currentDay);

    jest.spyOn(utils.DateTimeUtils, 'addTime').mockReturnValue(currentDay);

    jest
      .spyOn(utils.DateTimeUtils, 'formatDate')
      .mockReturnValue(currentDay.toString());

    when(
      tokenRepository.updateMany(
        deepEqual({ account_id: '1111', type: 'long live' }),
        deepEqual({ active: false }),
      ),
    ).thenResolve();

    when(
      tokenRepository.createToken(
        deepEqual({
          account: { connect: { id: '1111' } },
          value: undefined,
          expired_date: currentDay.toString(),
          type: 'long live',
        }),
      ),
    ).thenReturn(
      Promise.resolve({
        id: '1',
        value: 'xxx',
        account_id: '1111',
        expired_date: jsDate,
        type: 'long live',
        created_at: jsDate,
        updated_at: jsDate,
        active: true,
      }),
    );

    jest.spyOn(BaseRepository.prototype, 'transaction').mockResolvedValue({
      id: '1',
      value: 'xxx',
      account_id: '1111',
      expired_date: jsDate,
      type: 'long live',
      created_at: jsDate,
      updated_at: jsDate,
      active: true,
    });

    const token = await authService.generateToken('1111');

    expect(token).not.toBeNull();
  });

  it('should generate not success', async () => {
    when(
      attachedPermissionRepository.findMany(deepEqual({ account_id: '1111' })),
    ).thenReturn();

    await expect(async () =>
      authService.generateToken('1111'),
    ).rejects.toThrowError(new CustomError(OBError.IAM_IDT_003));
  });

  it('should logout success', async () => {
    when(
      tokenRepository.update(
        deepEqual({ value: '112233' }),
        deepEqual({ active: false }),
      ),
    ).thenReturn(
      Promise.resolve({
        id: '1',
        value: '112233',
        account_id: '1111',
        expired_date: jsDate,
        type: 'long live',
        created_at: jsDate,
        updated_at: jsDate,
        active: true,
      }),
    );

    const result = await authService.logout('112233');

    expect(result).toEqual({
      id: '1',
      value: '112233',
      account_id: '1111',
      expired_date: jsDate,
      type: 'long live',
      created_at: jsDate,
      updated_at: jsDate,
      active: true,
    });
  });

  it('should logout unsuccess return IAM_STT_001', async () => {
    when(
      tokenRepository.update(
        deepEqual({ value: '112233' }),
        deepEqual({ active: false }),
      ),
    ).thenReturn();

    await expect(async () => authService.logout('112233')).rejects.toThrowError(
      new CustomError(OBError.IAM_STT_001),
    );
  });

  it('should login success', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.nak@mtel.co.th',
          provider: 'email',
        },
        password: 'xxxxx',
        device: {
          devide_id: 'abc',
          os: 'ios',
        },
      },
    } as Request;

    const mockAccount = {
      id: '1111',
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: null,
      ...ssoAccount,
    };

    jest.spyOn(loginStrategies, 'compositeStrategy').mockResolvedValue({
      account: mockAccount,
      strategy: 'passwordStrategy',
      result: false,
    });

    when(settingRepository.find(deepEqual({ account_id: '1111' }))).thenReturn(
      Promise.resolve({
        id: '1',
        account_id: '1111',
        two_factor_authentication_enabled: false,
        updated_at: jsDate,
        created_at: jsDate,
      }),
    );

    when(
      attachedPermissionRepository.findMany(deepEqual({ account_id: '1111' })),
    ).thenReturn(
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
      ]),
    );

    jest.spyOn(jwt, 'sign').mockReturnValue();

    jest
      .spyOn(utils.DateTimeUtils, 'formatDate')
      .mockReturnValue(jsDate.toDateString());
    const currentDay = dayjs();
    jest
      .spyOn(utils.DateTimeUtils, 'getCurrentDateTime')
      .mockReturnValue(currentDay);

    jest.spyOn(utils.DateTimeUtils, 'addTime').mockReturnValue(currentDay);

    jest
      .spyOn(utils.DateTimeUtils, 'formatDate')
      .mockReturnValue(currentDay.toString());

    when(
      tokenRepository.createToken(
        deepEqual({
          account: { connect: { id: '1111' } },
          value: undefined,
          expired_date: currentDay.toString(),
          type: 'long live',
        }),
      ),
    ).thenReturn(
      Promise.resolve({
        id: '1',
        value: 'xxx',
        account_id: '1111',
        expired_date: jsDate,
        type: 'long live',
        created_at: jsDate,
        updated_at: jsDate,
        active: true,
      }),
    );

    const token = await authService.login(mockRequest);

    expect(token).not.toBeNull();
  });

  describe('with API key', () => {
    describe('having an existing token', () => {
      it('should return existing token', async () => {
        const MOCKED_ACCOUNT = {
          id: 'test',
          password: 'test',
          updated_at: new Date(),
          created_at: new Date(),
          deleted_at: null,
        };
        jest.spyOn(loginStrategies, 'compositeStrategy').mockResolvedValueOnce({
          account: MOCKED_ACCOUNT,
          strategy: 'apiKeyStrategy',
          result: true,
        });

        when(
          tokenRepository.findActiveBy(
            deepEqual({
              account: MOCKED_ACCOUNT,
            }),
          ),
        ).thenReturn(
          Promise.resolve({
            id: 'test',
            value: 'test',
            type: 'test',
            active: true,
            expired_date: new Date(),
            account_id: 'test',
            created_at: new Date(),
            updated_at: new Date(),
            account: MOCKED_ACCOUNT,
          }),
        );

        const res = await authService.login({} as Request);

        expect(res.token?.value).toEqual('test');

        jest.clearAllMocks();
      });
    });
  });

  it('should login unsuccess return IAM_IDT_003', async () => {
    const mockRequest = {
      body: {
        identity: {
          provider: 'email',
        },
        password: 'xxxxx',
        device: {
          devide_id: 'abc',
          os: 'ios',
        },
      },
    } as Request;

    const mockAccount = {
      id: '1111',
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: null,
      ...ssoAccount,
    };

    jest.spyOn(loginStrategies, 'compositeStrategy').mockResolvedValue({
      account: mockAccount,
      strategy: 'passwordStrategy',
      result: false,
    });

    await expect(async () =>
      authService.login(mockRequest),
    ).rejects.toThrowError(new CustomError(OBError.IAM_IDT_003));
  });

  it('should login unsuccess return IAM_IDT_003', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.n@gmail.com',
          provider: 'email',
        },
        password: 'xxxxx',
        device: {
          devide_id: 'abc',
          os: 'ios',
        },
      },
    } as Request;

    const mockAccount = {
      id: '1111',
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: jsDate,
      ...ssoAccount,
    };

    jest.spyOn(loginStrategies, 'compositeStrategy').mockResolvedValue({
      account: mockAccount,
      strategy: 'passwordStrategy',
      result: false,
    });

    when(
      identityRepository.findBy(
        deepEqual({
          identifier: mockRequest.body.identity.identifier,
          provider: 'email',
          account: { deleted_at: { not: null } },
        }),
      ),
    ).thenReturn(
      Promise.resolve({
        id: '1',
        identifier: 'rungwat.n@gmail.com',
        provider: 'email',
        created_at: jsDate,
        account_id: '1111',
        default: true,
        verified_at: null,
        linked_at: null,
        updated_at: jsDate,
        unlinked_at: null,
        account: {
          id: '1111',
          password: 'xxxxx',
          created_at: jsDate,
          deleted_at: jsDate,
          updated_at: jsDate,
        },
        meta: {},
      }),
    );

    await expect(async () =>
      authService.login(mockRequest),
    ).rejects.toThrowError();
  });

  it('should login unsuccess return result', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.n@gmail.com',
          provider: 'email',
        },
        password: 'xxxxx',
        device: {
          devide_id: 'abc',
          os: 'ios',
        },
      },
    } as Request;

    const mockAccount = {
      id: '1111',
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: jsDate,
      ...ssoAccount,
    };

    jest.spyOn(loginStrategies, 'compositeStrategy').mockResolvedValue({
      account: mockAccount,
      strategy: 'passwordStrategy',
      result: true,
    });

    when(settingRepository.find(deepEqual({ account_id: '1111' }))).thenReturn(
      Promise.resolve({
        id: '1',
        account_id: '1111',
        two_factor_authentication_enabled: true,
        updated_at: jsDate,
        created_at: jsDate,
      }),
    );

    when(
      identityRepository.findBy(
        deepEqual({
          account_id: '1111',
          provider: 'phone',
          default: true,
        }),
      ),
    ).thenReturn(
      Promise.resolve({
        id: '1',
        identifier: '0675051111',
        provider: 'phone',
        created_at: jsDate,
        account_id: '1111',
        default: true,
        verified_at: null,
        linked_at: null,
        updated_at: jsDate,
        unlinked_at: null,
        account: {
          id: '1111',
          password: 'xxxxx',
          created_at: jsDate,
          deleted_at: null,
          updated_at: jsDate,
        },
        meta: {},
      }),
    );

    await authService.login(mockRequest);
  });

  it('should login success', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.nak@mtel.co.th',
          provider: 'email',
        },
        password: 'xxxxx',
        device: {
          devide_id: 'abc',
          os: 'ios',
        },
      },
    } as Request;

    const mockAccount = {
      id: '1111',
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: null,
      ...ssoAccount,
    };

    jest.spyOn(loginStrategies, 'compositeStrategy').mockResolvedValue({
      account: mockAccount,
      strategy: 'passwordStrategy',
      result: false,
    });

    when(settingRepository.find(deepEqual({ account_id: '1111' }))).thenReturn(
      Promise.resolve({
        id: '1',
        account_id: '1111',
        two_factor_authentication_enabled: false,
        updated_at: jsDate,
        created_at: jsDate,
      }),
    );

    when(
      attachedPermissionRepository.findMany(deepEqual({ account_id: '1111' })),
    ).thenReturn(
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
      ]),
    );

    jest.spyOn(jwt, 'sign').mockReturnValue();

    jest
      .spyOn(utils.DateTimeUtils, 'formatDate')
      .mockReturnValue(jsDate.toDateString());
    const currentDay = dayjs();
    jest
      .spyOn(utils.DateTimeUtils, 'getCurrentDateTime')
      .mockReturnValue(currentDay);

    jest.spyOn(utils.DateTimeUtils, 'addTime').mockReturnValue(currentDay);

    jest
      .spyOn(utils.DateTimeUtils, 'formatDate')
      .mockReturnValue(currentDay.toString());

    when(
      tokenRepository.createToken(
        deepEqual({
          account: { connect: { id: '1111' } },
          value: undefined,
          expired_date: currentDay.toString(),
          type: 'long live',
        }),
      ),
    ).thenReturn(
      Promise.resolve({
        id: '1',
        value: 'xxx',
        account_id: '1111',
        expired_date: jsDate,
        type: 'long live',
        created_at: jsDate,
        updated_at: jsDate,
        active: true,
      }),
    );

    const token = await authService.reactivate(mockRequest);

    expect(token).not.toBeNull();
  });
});
