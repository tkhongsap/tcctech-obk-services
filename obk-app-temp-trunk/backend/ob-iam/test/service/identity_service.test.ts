import BaseRepository from '../../src/repositories/base_repository';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { DateTime } from 'luxon';
import { IdentityService } from '../../src/services';
import {
  ExternalIdentityRepository,
  IdentityRepository,
  OtpRepository,
} from '../../src/repositories';
import { ExternalIdentityType, IdentityProvider } from '../../db/client';
import * as event from 'ob-common-lib/dist/utils/kafka';
import * as OB_BMS_SDK from 'ob-bms-sdk';

jest.mock('ob-bms-sdk');
jest.mock('ob-common-lib/dist/utils/kafka');

describe('Identity service', () => {
  let identityService: IdentityService;
  let identityRepository: IdentityRepository;
  let otpRepository: OtpRepository;
  let externalIdentityRepository: ExternalIdentityRepository;
  let baseRepoMock: BaseRepository;

  beforeEach(() => {
    otpRepository = mock(OtpRepository);
    identityRepository = mock(IdentityRepository);
    externalIdentityRepository = mock(ExternalIdentityRepository);
    baseRepoMock = mock(BaseRepository);
    identityService = new IdentityService(
      instance(identityRepository),
      instance(otpRepository),
      instance(baseRepoMock),
      instance(externalIdentityRepository),
    );
  });

  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();

  const identityMock = {
    identifier: '+992261234',
    id: '1',
    meta: {},
    provider: IdentityProvider.phone,
    created_at: jsDate,
    updated_at: jsDate,
    verified_at: jsDate,
    linked_at: jsDate,
    unlinked_at: jsDate,
    account: {
      id: '1',
      password: null,
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: null,
    },
    account_id: '1',
    default: true,
  };

  const externalIdentityMock = {
    id: '1',
    identifier: '+992261234',
    type: ExternalIdentityType.google,
    uid: '1',
    account_id: '1',
    meta: {},
    created_at: jsDate,
    updated_at: jsDate,
    account: {
      id: '1',
      password: null,
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: null,
    },
  };

  it('should validate successful return true', async () => {
    when(
      identityRepository.findBy(
        deepEqual({ identifier: '+992261234', provider: 'phone' }),
      ),
    ).thenResolve(null);

    const result = await identityService.validate('+992261234', 'phone');

    expect(result).toEqual(true);
  });

  it('should validate successful return false', async () => {
    when(
      identityRepository.findBy(
        deepEqual({ identifier: '+992261234', provider: 'phone' }),
      ),
    ).thenResolve(identityMock);

    const result = await identityService.validate('+992261234', 'phone');

    expect(result).toEqual(false);
  });

  it('should validate successful return false invalid format', async () => {
    when(
      identityRepository.findBy(
        deepEqual({ identifier: 'rungwat', provider: 'phone' }),
      ),
    ).thenResolve(identityMock);

    const result = await identityService.validate('rungwat', 'phone');

    expect(result).toEqual(false);
  });

  it('should findall success without external identity', async () => {
    when(
      identityRepository.findAll(
        deepEqual({ account_id: '1' }),
        deepEqual({
          id: true,
          identifier: true,
          provider: true,
          default: true,
        }),
      ),
    ).thenResolve([{ ...identityMock }]);

    const result = await identityService.findAll('1');

    expect(result).toEqual([{ ...identityMock, type: [] }]);
  });

  it('should findall success with external identity', async () => {
    when(
      identityRepository.findAll(
        deepEqual({ account_id: '1' }),
        deepEqual({
          id: true,
          identifier: true,
          provider: true,
          default: true,
        }),
      ),
    ).thenResolve([{ ...identityMock }]);

    when(
      externalIdentityRepository.findAll(
        deepEqual({
          account_id: '1',
          identifier: '+992261234',
          type: {
            not: 'fs',
          },
        }),
      ),
    ).thenResolve([externalIdentityMock]);

    const result = await identityService.findAll('1');

    expect(result).toEqual([{ ...identityMock, type: ['google'] }]);
  });

  it('should find success', async () => {
    when(
      identityRepository.findAll(deepEqual({ account_id: '1' })),
    ).thenResolve([{ ...identityMock }]);

    const result = await identityService.find({ account_id: '1' });

    expect(result).toEqual([identityMock]);
  });

  it('should update default identity success with already sync fs', async () => {
    when(identityRepository.findBy(deepEqual({ id: '1' }))).thenResolve({
      ...identityMock,
      default: false,
    });

    jest
      .spyOn(baseRepoMock, 'transaction')
      .mockResolvedValue(Promise.resolve());

    when(
      externalIdentityRepository.find(
        deepEqual({ identifier: '+992261234', type: 'fs' }),
      ),
    ).thenResolve({ ...externalIdentityMock });

    jest.spyOn(event.EventProducer, 'send').mockReturnValue();

    const result = await identityService.updateDefault('1', '1');

    expect(result).toEqual(true);
  });

  it('should update default identity success without sync fs not found member', async () => {
    when(identityRepository.findBy(deepEqual({ id: '1' }))).thenResolve({
      ...identityMock,
      default: false,
    });

    jest
      .spyOn(baseRepoMock, 'transaction')
      .mockResolvedValue(Promise.resolve());

    when(
      externalIdentityRepository.find(
        deepEqual({ identifier: '+992261234', type: 'fs' }),
      ),
    ).thenResolve();

    jest.spyOn(event.EventProducer, 'send').mockReturnValue();

    OB_BMS_SDK.client.membersIndex = jest.fn().mockResolvedValue({
      data: {
        data: [],
      },
    });

    const result = await identityService.updateDefault('1', '1');

    expect(result).toEqual(true);
  });

  it('should update default identity success without sync fs found member', async () => {
    when(identityRepository.findBy(deepEqual({ id: '1' }))).thenResolve({
      ...identityMock,
      default: false,
    });

    jest
      .spyOn(baseRepoMock, 'transaction')
      .mockResolvedValue(Promise.resolve());

    when(
      externalIdentityRepository.find(
        deepEqual({ identifier: '+992261234', type: 'fs' }),
      ),
    ).thenResolve();

    jest.spyOn(event.EventProducer, 'send').mockReturnValue();

    OB_BMS_SDK.client.membersIndex = jest.fn().mockResolvedValue({
      data: {
        data: [{ personalId: '1', metadata: {}, uid: '1' }],
      },
    });

    when(
      externalIdentityRepository.create(
        deepEqual({
          account: { connect: { id: '1' } },
          identifier: '+992261234',
          type: 'fs',
          uid: '1',
          meta: '{}',
        }),
      ),
    );

    const result = await identityService.updateDefault('1', '1');

    expect(result).toEqual(true);
  });

  it('should update default identity success with already sync fs', async () => {
    jest
      .spyOn(baseRepoMock, 'transaction')
      .mockResolvedValue(Promise.resolve());

    const result = await identityService.delete('1', '1');

    expect(result).toEqual(true);
  });
});
