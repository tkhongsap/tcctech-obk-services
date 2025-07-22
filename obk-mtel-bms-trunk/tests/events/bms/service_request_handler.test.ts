import { serviceRequestHandler } from '../../../src/events/bms';
import { IssueTypeRepository, MemberRepository, ServiceRequestRepository } from '../../../src/repositories';
import { createTestData } from '../../fixtures';
import { resetDB } from '../../helpers/db';
import { serviceRequestSerializer } from '../../../src/controllers/service_requests_controller.serializer';
import OBSDK from '../../../src/libs/ob_sdk';

jest.mock('ob-iam-sdk');

let dataTest: any;
let issueTypeData: any;
let dataServiceRequest: any;

beforeEach(async () => {
  await resetDB();

  dataTest = await createTestData();

  issueTypeData = await IssueTypeRepository.create({
    data: {
      id: 'test_issue_type',
      name: 'test',
      display_name: {},
    },
  });

  await ServiceRequestRepository.createMany({
    data: [
      {
        image_url: [],
        issue_type_id: issueTypeData.id,
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        title: 'test',
        description: 'description',
        requester_id: dataTest.member.id,
        status: 'submitted',
        created_at: new Date('2024-01-13T20:15:41.425Z').toISOString(),
      },
      {
        image_url: [],
        issue_type_id: issueTypeData.id,
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        title: 'test',
        description: 'description',
        requester_id: dataTest.member.id,
        status: 'submitted',
        internal_remark: 'internal_remark',
      },
      {
        image_url: [],
        issue_type_id: issueTypeData.id,
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        title: 'test',
        description: 'description',
        requester_id: dataTest.member.id,
        status: 'submitted',
      },
    ],
  });
  await MemberRepository.update({ data: { account_id: 'test-account-id' }, where: { id: dataTest.member.id } });

  dataServiceRequest = await ServiceRequestRepository.findMany({ include: ServiceRequestRepository.defaultInclude });
});

describe('serviceRequestHandler', () => {
  describe('no matched events', () => {
    it('do nothing', async () => {
      const serviceRequestInstance = new serviceRequestHandler();
      await serviceRequestInstance.create({ name: '', payload: {} });
    });
  });

  describe('ob-bms.service_request.created', () => {
    it('should update member account_id', async () => {
      const serviceRequestInstance = new serviceRequestHandler();

      const serializedServiceRequest = serviceRequestSerializer(dataServiceRequest[0]);

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

      await serviceRequestInstance.create({
        name: 'ob-bms.service_request.created',
        payload: {
          data: serializedServiceRequest,
        },
      });

      const serviceRequest = await ServiceRequestRepository.findFirst({ where: { id: dataServiceRequest[0].id } });

      expect(serviceRequest?.created_by).toEqual('ss ss');
    });
  });
});
