import { anything, deepEqual, instance, mock, when } from 'ts-mockito';
import { IdentityRepository, SettingRepository } from '../../src/repositories';
import { identity, setting } from '../../db/client';
import { EventProducer } from 'ob-common-lib/dist';
import { SettingService } from '../../src/services';
import { CustomError } from '../../src/middlewares/error_middleware';
const { DateTimeUtils } = jest.requireActual('ob-common-lib/dist');

jest.mock('ob-common-lib/dist');

describe('setting - find', () => {
  let settingService: SettingService;
  let settingRepository: SettingRepository;
  let identityRepository: IdentityRepository;

  beforeEach(() => {
    settingRepository = mock(SettingRepository);
    identityRepository = mock(IdentityRepository);
    settingService = new SettingService(
      instance(settingRepository),
      instance(identityRepository),
    );
  });

  it('should call find function with correct argument', async () => {
    const where = {
      id: '1233',
      account_id: '67641',
    };
    const expectedResult: setting = {
      id: where.id,
      account_id: where.account_id,
      two_factor_authentication_enabled: true,
      created_at: DateTimeUtils.getCurrentDateTime().toDate(),
      updated_at: DateTimeUtils.getCurrentDateTime().toDate(),
    };

    when(settingRepository.find(where)).thenResolve(expectedResult);

    const result = await settingService.find(where);

    expect(result).toEqual(expectedResult);
  });
});

describe('setting - update', () => {
  let settingService: SettingService;
  let settingRepository: SettingRepository;
  let identityRepository: IdentityRepository;
  const jsDate = DateTimeUtils.getCurrentDateTime().toDate();

  const accountId = '001';
  const where = {
    id: '1233',
    account_id: accountId,
  };
  const data = {
    two_factor_authentication_enabled: true,
  };
  const settingMock: setting = {
    id: where.id,
    account_id: accountId,
    two_factor_authentication_enabled: false,
    created_at: DateTimeUtils.getCurrentDateTime().toDate(),
    updated_at: DateTimeUtils.getCurrentDateTime().toDate(),
  };

  beforeEach(() => {
    settingRepository = mock(SettingRepository);
    identityRepository = mock(IdentityRepository);
    settingService = new SettingService(
      instance(settingRepository),
      instance(identityRepository),
    );
    jest.spyOn(EventProducer, 'send');
  });

  it('should update setting properly', async () => {
    const identities: identity[] = [
      {
        id: '1',
        identifier: '1@mail.com',
        meta: null,
        provider: 'sso',
        verified_at: jsDate,
        linked_at: jsDate,
        unlinked_at: jsDate,
        account_id: accountId,
        created_at: jsDate,
        updated_at: jsDate,
        default: true,
      },
      {
        id: '2',
        identifier: '081234567',
        meta: null,
        provider: 'phone',
        verified_at: jsDate,
        linked_at: jsDate,
        unlinked_at: jsDate,
        account_id: accountId,
        created_at: jsDate,
        updated_at: jsDate,
        default: true,
      },
    ];
    when(settingRepository.find(deepEqual(where))).thenResolve(settingMock);
    when(identityRepository.findAll(anything())).thenReturn(
      Promise.resolve(identities),
    );

    const expectedResult = {
      ...settingMock,
      ...data,
    };
    when(settingRepository.update(where, data)).thenResolve(expectedResult);
    const result = await settingService.update(where, data);
    expect(result).toBe(expectedResult);
  });
  it('should throw 402, Phone Identity doesnt exist when there is no phone', async () => {
    const identities: identity[] = [
      {
        id: '1',
        identifier: '1@mail.com',
        meta: null,
        provider: 'sso',
        verified_at: jsDate,
        linked_at: jsDate,
        unlinked_at: jsDate,
        account_id: accountId,
        created_at: jsDate,
        updated_at: jsDate,
        default: true,
      },
    ];
    when(settingRepository.find(deepEqual(where))).thenResolve(settingMock);
    when(identityRepository.findAll(anything())).thenReturn(
      Promise.resolve(identities),
    );
    try {
      expect(await settingService.update(where, data)).toThrowError();
    } catch (error) {
      expect(error).toStrictEqual(
        new CustomError(402, "Phone Identity doesn't exist"),
      );
    }
  });
  it('should throw 402, Email Identity doesnt exist when there is no email', async () => {
    const identities: identity[] = [
      {
        id: '2',
        identifier: '081234567',
        meta: null,
        provider: 'phone',
        verified_at: jsDate,
        linked_at: jsDate,
        unlinked_at: jsDate,
        account_id: accountId,
        created_at: jsDate,
        updated_at: jsDate,
        default: true,
      },
    ];
    when(settingRepository.find(deepEqual(where))).thenResolve(settingMock);
    when(identityRepository.findAll(anything())).thenReturn(
      Promise.resolve(identities),
    );
    try {
      expect(await settingService.update(where, data)).toThrowError();
    } catch (error) {
      expect(error).toStrictEqual(
        new CustomError(402, "Email Identity doesn't exist"),
      );
    }
  });
});
