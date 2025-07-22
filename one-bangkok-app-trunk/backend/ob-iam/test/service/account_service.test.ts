import DeviceService from '../../src/services/device_service';
import { deepEqual, instance, mock, verify, when } from 'ts-mockito';
import { DateTime } from 'luxon';
import { AccountService, AuthService } from '../../src/services';
import {
  AccountRepository,
  IdentityRepository,
  ProfileRepository,
  OtpRepository,
} from '../../src/repositories';
import { IdentityProvider, ProfileGender, ProfileTitle } from '../../db/client';
import { CustomError } from '../../src/middlewares/error';
import { Request } from 'express';

import * as loginStrategies from '../../src/services/auth_service/login_strategies';
import { EventProducer } from 'ob-common-lib/dist';
import { OBError } from '../../src/openapi/error_spec';
import ExternalIdentityService from '../../src/services/external_identity_service';

jest.mock('../../src/services/auth_service/login_strategies'); // Mock the module
jest.mock('ob-common-lib/dist');

describe('Account service', () => {
  let accountRepository: AccountRepository;
  let identityRepository: IdentityRepository;
  let profileRepoitory: ProfileRepository;
  let otpRepositoryMock: OtpRepository;
  let authService: AuthService;
  let deviceService: DeviceService;
  let accountService: AccountService;
  let externalIdentityService: ExternalIdentityService;

  beforeEach(() => {
    accountRepository = mock(AccountRepository);
    identityRepository = mock(IdentityRepository);
    profileRepoitory = mock(ProfileRepository);
    otpRepositoryMock = mock(OtpRepository);
    authService = mock(AuthService);
    deviceService = mock(DeviceService);
    externalIdentityService = mock(ExternalIdentityService);
    accountService = new AccountService(
      instance(authService),
      instance(accountRepository),
      instance(identityRepository),
      instance(profileRepoitory),
      instance(otpRepositoryMock),
      instance(deviceService),
      instance(externalIdentityService),
    );

    jest.spyOn(EventProducer, 'send');
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
    identities: {
      identifier: 'rungwat.nak@mtel.co.th',
      provider: IdentityProvider.sso,
    },

    password: null,
    device: {
      device_id: '1123',
      os: 'ios',
    },
    push_token: {
      value: 'xxx',
      type: 'FCM',
    },
  };

  it('should register successfull', async () => {
    when(
      authService.validateIdentity('rungwat.nak@mtel.co.th', 'sso'),
    ).thenReturn(Promise.resolve(true));
    const result = await accountService.register(ssoAccount);

    expect(result).toBeDefined();
  });

  it('should register unsuccessfull return IAM_IDT_006', async () => {
    when(
      authService.validateIdentity('rungwat.n@gmail.com', 'email'),
    ).thenReturn(Promise.resolve(true));

    // Use async/await in the function passed to expect
    await expect(async () =>
      accountService.register({
        ...ssoAccount,
        identities: {
          identifier: '',
          provider: 'sso',
        },
      }),
    ).rejects.toThrowError(new CustomError(OBError.IAM_IDT_006));
  });

  it('should register unsuccessfull return IAM_IDT_004', async () => {
    when(
      authService.validateIdentity('rungwat.n@gmail.com', 'email'),
    ).thenReturn(Promise.resolve(true));

    // Act and Assert

    await expect(async () =>
      accountService.register({
        ...ssoAccount,
        identities: {
          identifier: 'rungwat.n@gmail.com',
          provider: 'email',
        },
      }),
    ).rejects.toThrowError(new CustomError(OBError.IAM_IDT_004));
  });

  it('should register unsuccessfull return IAM_IDT_002', async () => {
    when(authService.validateIdentity('rungwat.n@gmail.com', 'sso')).thenReturn(
      Promise.resolve(false),
    );

    await expect(async () =>
      accountService.register({
        ...ssoAccount,
        identities: {
          identifier: 'rungwat.n@gmail.com',
          provider: 'sso',
        },
      }),
    ).rejects.toThrowError(new CustomError(OBError.IAM_IDT_002));
  });

  it('should create identity success', async () => {
    const otpId = '000000';
    // Set up the mock behavior for the findBy method
    when(otpRepositoryMock.findBy(deepEqual({ id: otpId }))).thenReturn(
      Promise.resolve({
        id: otpId,
        code: otpId,
        identifier: ssoAccount.identities.identifier,
        reference: 'aabbcc',
        created_at: jsDate,
        updated_at: jsDate,
        expired_at: jsDate,
      }),
    );

    when(
      identityRepository.findAll(
        deepEqual({
          account_id: '1111',
          provider: ssoAccount.identities.provider,
        }),
      ),
    ).thenReturn(Promise.resolve([]));

    const result = await accountService.createIdentity(
      ssoAccount.identities,
      '1111',
      otpId,
    );
    expect(result).toEqual(true);
  });

  it('should create identity unsuccess return IAM_IDT_004', async () => {
    const otpId = '000000';
    // Set up the mock behavior for the findBy method
    when(otpRepositoryMock.findBy(deepEqual({ id: otpId }))).thenReturn(
      Promise.resolve(null),
    );

    await expect(async () =>
      accountService.createIdentity(ssoAccount.identities, '1111', otpId),
    ).rejects.toThrowError(new CustomError(OBError.IAM_IDT_004));
  });

  it('should create identity unsuccess return IAM_IDT_009', async () => {
    const otpId = '000000';
    // Set up the mock behavior for the findBy method
    when(otpRepositoryMock.findBy(deepEqual({ id: otpId }))).thenReturn(
      Promise.resolve({
        id: otpId,
        code: otpId,
        identifier: ssoAccount.identities.identifier,
        reference: 'aabbcc',
        created_at: jsDate,
        updated_at: jsDate,
        expired_at: jsDate,
      }),
    );

    when(
      identityRepository.findAll(
        deepEqual({
          account_id: '1111',
          provider: ssoAccount.identities.provider,
        }),
      ),
    ).thenReturn(
      Promise.resolve([
        {
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
        },
        {
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
        },
        {
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
        },
      ]),
    );

    await expect(async () =>
      accountService.createIdentity(ssoAccount.identities, '1111', otpId),
    ).rejects.toThrowError(new CustomError(OBError.IAM_IDT_009));
  });

  it('should get profile success', async () => {
    when(profileRepoitory.find('1111')).thenReturn(
      Promise.resolve({
        id: '1',
        account_id: '1111',
        first_name: 'rungwat',
        middle_name: '',
        last_name: 'naksuwan',
        dob: jsDate,
        gender: ProfileGender.male,
        title: 'dr',
        created_at: jsDate,
        updated_at: jsDate,
      }),
    );

    const result = await accountService.getProfile('1111');
    expect(result).toEqual({
      id: '1',
      account_id: '1111',
      first_name: 'rungwat',
      middle_name: '',
      last_name: 'naksuwan',
      dob: jsDate,
      gender: ProfileGender.male,
      title: 'dr',
      created_at: jsDate,
      updated_at: jsDate,
    });
  });

  it('should update profile success', async () => {
    const profileData = {
      first_name: 'rungwat',
      middle_name: '',
      last_name: 'naksuwan',
      dob: jsDate,
      gender: ProfileGender.male,
    };
    const profileReturnData = {
      id: '1',
      account_id: '1111',
      first_name: 'rungwat',
      middle_name: '',
      last_name: 'naksuwan',
      dob: jsDate,
      gender: ProfileGender.male,
      title: ProfileTitle.dr,
      created_at: jsDate,
      updated_at: jsDate,
    };
    when(profileRepoitory.find('1111')).thenReturn(
      Promise.resolve({ ...profileReturnData }),
    );
    when(profileRepoitory.update('1111', { ...profileData })).thenReturn(
      Promise.resolve({
        ...profileReturnData,
      }),
    );

    const result = await accountService.updateProfile('1111', profileData);
    expect(result).toEqual({
      ...profileReturnData,
    });
  });

  it('should update success', async () => {
    when(
      accountRepository.update(
        deepEqual({ password: 'xxxx' }),
        deepEqual({ id: '1111' }),
      ),
    ).thenReturn();

    await accountService.update({ password: 'xxxx' }, { id: '1111' });
    verify(
      accountRepository.update(
        deepEqual({ password: 'xxxx' }),
        deepEqual({ id: '1111' }),
      ),
    ).once();
  });

  it('should bulk delete success', async () => {
    when(
      accountRepository.bulkDelete(
        deepEqual({
          id: '1111',
        }),
      ),
    ).thenReturn();

    await accountService.bulkDelete({ id: '1111' });
    verify(accountRepository.bulkDelete(deepEqual({ id: '1111' }))).once();
  });

  it('should verify password success', async () => {
    when(
      accountRepository.find(
        deepEqual({
          id: '1111',
          password: {
            not: null,
          },
        }),
      ),
    ).thenReturn(
      Promise.resolve({
        id: '1111',
        password: 'vincent1234',
        created_at: jsDate,
        updated_at: jsDate,
        deleted_at: null,
      }),
    );

    await accountService.verifyPassword('1111', 'vincent1234');
  });

  it('should verify password unsuccess return IAM_IDT_003', async () => {
    when(
      accountRepository.find(
        deepEqual({
          id: '1111',
          password: {
            not: null,
          },
        }),
      ),
    ).thenReturn();

    await expect(async () =>
      accountService.verifyPassword('1111', 'vincent1234'),
    ).rejects.toThrowError(new CustomError(OBError.IAM_IDT_003));
  });

  it('should verify password unsuccess return IAM_ACC_005', async () => {
    when(
      accountRepository.find(
        deepEqual({
          id: '1111',
          password: {
            not: null,
          },
        }),
      ),
    ).thenReturn(
      Promise.resolve({
        id: '1111',
        password: null,
        created_at: jsDate,
        updated_at: jsDate,
        deleted_at: null,
      }),
    );

    await expect(async () =>
      accountService.verifyPassword('1111', 'vincent1234'),
    ).rejects.toThrowError(new CustomError(OBError.IAM_ACC_005));
  });

  it('should update password success', async () => {
    when(
      accountRepository.find(
        deepEqual({
          id: '1111',
        }),
      ),
    ).thenReturn(
      Promise.resolve({
        id: '1111',
        password: 'vincent1234',
        created_at: jsDate,
        updated_at: jsDate,
        deleted_at: null,
      }),
    );

    const result = await accountService.updatePassword('1111', 'vincent1234');

    expect(result).toEqual(true);
  });

  it('should update password unsuccess', async () => {
    when(
      accountRepository.find(
        deepEqual({
          id: '1111',
        }),
      ),
    ).thenReturn();

    await expect(async () =>
      accountService.updatePassword('1111', 'vincent1234'),
    ).rejects.toThrowError(new CustomError(OBError.IAM_ACC_005));
  });

  it('should reset password unsuccess', async () => {
    const mockRequest = {
      body: {
        identity: {
          identifier: 'rungwat.nak@mtel.co.th',
          provider: 'email',
          id: '1234',
          reference: '1123',
        },
      },
    } as Request;
    jest.spyOn(loginStrategies, 'otpStrategy').mockResolvedValue({
      id: '1111',
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: null,
      ...ssoAccount,
    });

    when(authService.generateToken(deepEqual('1111'))).thenReturn(
      Promise.resolve({
        id: '1',
        account_id: '1111',
        value: '111122',
        expired_date: jsDate,
        active: true,
        created_at: jsDate,
        updated_at: jsDate,
        type: 'long live',
      }),
    );

    const token = await accountService.resetPassword(mockRequest);

    expect(token).toEqual({ token: { value: '111122' } });
  });

  it('should return account detail', async () => {
    jest.spyOn(loginStrategies, 'otpStrategy').mockResolvedValue({
      id: '1111',
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: null,
      ...ssoAccount,
    });

    when(deviceService.find(deepEqual('111'))).thenReturn(
      Promise.resolve({
        account_id: '111',
        device_id: '112',
        active: true,
        created_at: jsDate,
        updated_at: jsDate,
        id: '113',
        os: 'ios',
      }),
    );

    const device = await accountService.getAccountDetail('111');

    expect(device).toEqual({ account: { device: { id: '112' } } });
  });
});
