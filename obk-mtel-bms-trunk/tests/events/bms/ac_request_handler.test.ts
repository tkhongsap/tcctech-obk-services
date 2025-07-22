import { acRequestHandler } from '../../../src/events/bms';
import {
  ACRequestRepository,
  ACRequestZoneRepository,
  ACZoneRepository,
  MemberRepository,
} from '../../../src/repositories';
import { createTestData } from '../../fixtures';
import { resetDB } from '../../helpers/db';
import OBSDK from '../../../src/libs/ob_sdk';
import { acRequestShowSerializer } from '../../../src/controllers/ac_requests_controller.serializer';

jest.mock('ob-iam-sdk');

let dataTest: any;
let dataACZone: any;
let dataACRequest: any;
beforeEach(async () => {
  await resetDB();

  dataTest = await createTestData();

  dataACZone = await ACZoneRepository.create({
    data: {
      floor_id: dataTest.floor.id,
      name: 'zone1',
      area_size: 400,
      rate: 1.5,
    },
  });

  await ACRequestRepository.createMany({
    data: [
      {
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        estimated_cost: 100,
        from: '2024-02-14T08:00:00Z',
        to: '2024-02-14T18:00:00Z',
        duration_hour: 10,
        status: 'submitted',
        total_area_size: 50,
        created_at: new Date('2024-01-13T20:15:41.425Z').toISOString(),
        requester_id: dataTest.member.id,
      },
      {
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        estimated_cost: 100,
        from: '2024-02-22T10:00:00.000Z',
        to: '2024-02-22T10:00:00.000Z',
        duration_hour: 10,
        status: 'submitted',
        total_area_size: 50,
        requester_id: dataTest.member.id,
        reason: 'reason',
        internal_remark: 'internal_remark',
      },
      {
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        estimated_cost: 100,
        from: '2024-02-22T10:00:00.000Z',
        to: '2024-02-22T10:00:00.000Z',
        duration_hour: 10,
        status: 'submitted',
        total_area_size: 50,
        requester_id: dataTest.member.id,
        reason: 'reason',
        internal_remark: 'internal_remark',
      },
    ],
  });
  dataACRequest = await ACRequestRepository.findMany();
  await ACRequestZoneRepository.createMany({
    data: [
      {
        ac_zone_id: dataACZone.id,
        ac_request_id: dataACRequest[0].id,
        rate: dataACZone.rate,
        area_size: dataACZone.area_size,
      },
      {
        ac_zone_id: dataACZone.id,
        ac_request_id: dataACRequest[0].id,
        rate: dataACZone.rate,
        area_size: dataACZone.area_size,
      },
      {
        ac_zone_id: dataACZone.id,
        ac_request_id: dataACRequest[1].id,
        rate: dataACZone.rate,
        area_size: dataACZone.area_size,
      },
      {
        ac_zone_id: dataACZone.id,
        ac_request_id: dataACRequest[1].id,
        rate: dataACZone.rate,
        area_size: dataACZone.area_size,
      },
    ],
  });
  await MemberRepository.update({ data: { account_id: 'test-account-id' }, where: { id: dataTest.member.id } });

  dataACRequest = await ACRequestRepository.findMany({ include: ACRequestRepository.defaultInclude });
});

describe('acRequestHandler', () => {
  describe('no matched events', () => {
    it('do nothing', async () => {
      const acRequestInstance = new acRequestHandler();
      await acRequestInstance.create({ name: '', payload: {} });
    });
  });

  describe('ob-bms.air_condition_request.created', () => {
    it('should update member account_id', async () => {
      const acRequestInstance = new acRequestHandler();

      const serializedAcRequest = acRequestShowSerializer(dataACRequest[0]);

      jest.spyOn(OBSDK.IAM.client, 'accountShow').mockImplementationOnce(
        jest.fn((): any => {
          return {
            data: {
              data: {
                account: {
                  isDeleted: null,
                  device: {
                    id: 'device2',
                  },
                  profile: {
                    id: 'account2.profile[0].id',
                    account_id: 'account2.id',
                    gender: 'nonbinary',
                    title: undefined,
                    first_name: 'ss',
                    middle_name: undefined,
                    last_name: 'ss',
                    dob: '1995-01-01T00:00:00.000Z',
                    created_at: new Date('2024-01-13T20:15:41.425Z').toISOString(),
                    updated_at: new Date('2024-01-13T20:15:41.425Z').toISOString(),
                  },
                  identity: [
                    {
                      id: 'account2.identities[0].id',
                      identifier: 'test2@example.com',
                      meta: { identifier: 'test2@example.com' },
                      provider: 'email',
                      verified_at: undefined,
                      linked_at: undefined,
                      unlinked_at: undefined,
                      created_at: new Date('2024-01-13T20:15:41.425Z').toISOString(),
                      updated_at: new Date('2024-01-13T20:15:41.425Z').toISOString(),
                      default: true,
                    },
                  ],
                },
              },
            },
          };
        }),
      );

      await acRequestInstance.create({
        name: 'ob-bms.air_condition_request.created',
        payload: {
          data: serializedAcRequest,
        },
      });

      const acRequest = await ACRequestRepository.findFirst({ where: { id: dataACRequest[0].id } });

      expect(acRequest?.created_by).toEqual('ss ss');
    });
  });
});
