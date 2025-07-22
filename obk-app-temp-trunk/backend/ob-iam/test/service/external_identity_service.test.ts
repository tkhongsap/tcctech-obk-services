import { deepEqual, instance, mock, when } from 'ts-mockito';
import { DateTime } from 'luxon';
import ExternalIdentityService from '../../src/services/external_identity_service';
import { ExternalIdentityRepository } from '../../src/repositories';
import { IdentityService } from '../../src/services';

import * as OB_BMS_SDK from 'ob-bms-sdk';
import * as event from 'ob-common-lib/dist/utils/kafka';

jest.mock('ob-bms-sdk');
jest.mock('ob-common-lib/dist/utils/kafka');

describe('External identity service', () => {
  let externalIdentityService: ExternalIdentityService;
  let externalIdenityRepo: ExternalIdentityRepository;
  let identityService: IdentityService;

  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();
  beforeEach(() => {
    externalIdenityRepo = mock(ExternalIdentityRepository);
    identityService = mock(IdentityService);
    externalIdentityService = new ExternalIdentityService(
      instance(externalIdenityRepo),
      instance(identityService),
    );
  });

  it('should sync member successful no match default identity', async () => {
    when(
      identityService.find(
        deepEqual({ identifier: '+66967505222', default: true }),
      ),
    ).thenReturn(
      Promise.resolve([
        {
          id: '1',
          identifier: '+66967505222',
          provider: 'phone',
          verified_at: null,
          linked_at: null,
          unlinked_at: null,
          account_id: '1',
          default: true,
          created_at: jsDate,
          updated_at: jsDate,
          meta: {},
        },
      ]),
    );

    jest.spyOn(event.EventProducer, 'send').mockReturnValue();

    await externalIdentityService.sync({
      personID: 'a50c364f-52ef-4d8c-96f4-67c854ef8ca7',
      tenantIDs: [1],
      phones: ['+66967505222'],
      emails: ['t.shin@pjoe.com'],
      locations: [
        {
          locationID: 1,
          locationName: 'T4-L1 Zone1',
          isDefault: false,
        },
      ],
      updateTime: '2023-08-25T10:56:18.283',
      active: false,
      status: 'I',
    });
  });

  it('should sync member unsuccessful no match default identity', async () => {
    when(
      identityService.find(
        deepEqual({ identifier: '+66967505222', default: true }),
      ),
    ).thenReturn(Promise.resolve([]));

    when(
      identityService.find(
        deepEqual({ identifier: 't.shin@pjoe.com', default: true }),
      ),
    ).thenReturn(Promise.resolve([]));

    await externalIdentityService.sync({
      personID: 'a50c364f-52ef-4d8c-96f4-67c854ef8ca7',
      tenantIDs: [1],
      phones: ['+66967505222'],
      emails: ['t.shin@pjoe.com'],
      locations: [
        {
          locationID: 1,
          locationName: 'T4-L1 Zone1',
          isDefault: false,
        },
      ],
      updateTime: '2023-08-25T10:56:18.283',
      active: false,
      status: 'I',
    });
  });

  it('should sync member unsuccessful already have fs external identity', async () => {
    when(
      externalIdenityRepo.find(
        deepEqual({ identifier: '+66967505222', type: 'fs' }),
      ),
    ).thenReturn(
      Promise.resolve({
        id: '1',
        account_id: '1',
        uid: '',
        type: 'fs',
        identifier: '+66967505222',
        meta: '',
        created_at: jsDate,
        updated_at: jsDate,
        account: {
          id: '1',
          password: null,
          created_at: jsDate,
          updated_at: jsDate,
          deleted_at: null,
        },
      }),
    );

    await externalIdentityService.sync({
      personID: 'a50c364f-52ef-4d8c-96f4-67c854ef8ca7',
      tenantIDs: [1],
      phones: ['+66967505222'],
      emails: ['t.shin@pjoe.com'],
      locations: [
        {
          locationID: 1,
          locationName: 'T4-L1 Zone1',
          isDefault: false,
        },
      ],
      updateTime: '2023-08-25T10:56:18.283',
      active: false,
      status: 'I',
    });
  });

  it('should insert external identity type fs ', async () => {
    OB_BMS_SDK.client.membersIndex = jest.fn().mockResolvedValue({
      data: {
        data: { result: true, member: { personalId: '1', meta: {} } },
      },
    });

    await externalIdentityService.checkMember(
      deepEqual('+66992223'),
      deepEqual('1'),
    );
  });

  it('should not insert external identity type fs ', async () => {
    OB_BMS_SDK.client.membersIndex = jest.fn().mockResolvedValue({
      data: {
        data: { result: false },
      },
    });

    await externalIdentityService.checkMember(
      deepEqual('+66992223'),
      deepEqual('1'),
    );
  });
});
