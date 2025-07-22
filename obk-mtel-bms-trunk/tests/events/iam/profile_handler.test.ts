import { profileHandler } from '../../../src/events/iam';
import {
  ACRequestRepository,
  ACRequestZoneRepository,
  ACZoneRepository,
  IssueTypeRepository,
  ServiceRequestRepository,
} from '../../../src/repositories';
import { createTestData } from '../../fixtures';
import { resetDB } from '../../helpers/db';

let dataTest: any;
let dataACZone: any;
let dataACRequest: any;
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

  dataServiceRequest = await ServiceRequestRepository.findMany();

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
});

describe('profileHandler', () => {
  describe('no matched events', () => {
    it('do nothing', async () => {
      const profileInstance = new profileHandler();
      await profileInstance.update({ name: '', payload: {} });
    });
  });

  describe('ob-iam.profile.updated', () => {
    it('should update member account_id', async () => {
      const profileInstance = new profileHandler();

      await profileInstance.update({
        name: 'ob-iam.profile.updated',
        payload: {
          account_id: dataTest.member.id,
          first_name: 'ss',
          middle_name: '',
          last_name: 'ss',
          gender: '',
          dob: '',
        },
      });

      const acRequest = await ACRequestRepository.findFirst({ where: { id: dataACRequest[0].id } });
      const serviceRequest = await ServiceRequestRepository.findFirst({ where: { id: dataServiceRequest[0].id } });

      expect(acRequest?.created_by).toEqual('ss ss');
      expect(serviceRequest?.created_by).toEqual('ss ss');
    });
  });
});
