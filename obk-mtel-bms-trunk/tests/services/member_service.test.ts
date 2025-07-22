import { LocationRepository, MemberRepository, ProjectRepository } from '../../src/repositories';
import { MemberService, JobService } from '../../src/services';
import * as s3 from '../../src/utils/aws/s3';
import * as file_utils from '../../src/utils/file/file_utils';
import * as EventProducer from '../../src/utils/kafka/event_producer';
import FSClient from '../../src/libs/fs_client';
import { CustomError } from '../../src/middlewares/error';
import { OBError } from '../../src/utils/error_spec';
import FSParkingClient from '../../src/libs/fs_parking_client';
import SyncDataFromS3Repository from '../../src/repositories/sync_data_from_s3_repository';

FSClient.token = 'mock';
FSParkingClient.fsParkingApiKey = 'mock';

jest.mock('../../src/utils/aws/s3'); // Mock the module
jest.mock('../../src/utils/file/file_utils');
jest.mock('../../src/utils/kafka/event_producer');

describe('Member service', () => {
  let memberService: MemberService;
  let jobService: JobService;

  const memberData = {
    personID: 'a50c364f-52ef-4d8c-96f4-67c854ef8ca7',
    tenantIDs: [1],
    phones: ['0999999999'],
    emails: ['t.shin@pjoe.com'],
    locations: [
      {
        locationID: 1,
        locationName: 'T4-L1 Zone1',
        isDefault: false,
      },
      {
        locationID: 2,
        locationName: 'T4-L1 Zone2',
        isDefault: false,
      },
      {
        locationID: 3,
        locationName: 'T4-L1 Zone3',
        isDefault: false,
      },
      {
        locationID: 4,
        locationName: 'T4-L1 Zone4',
        isDefault: false,
      },
    ],
    updateTime: '2023-08-25T10:56:18.283',
    active: false,
    status: 'I',
    canPreRegister: true,
  };
  const locationMapping = {
    beaconID: 1,
    beaconName: 'Beacons01',
    beaconMajorCode: '0101',
    beaconMinorCode: '010101',
    locationID: 1,
    locationName: 'T4-L1 Zone1',
    locationNameThai: 'โลเคชั่น01',
    projectID: 1,
    projectName: 'One Bangkok',
    towerID: 1,
    towerName: 'Tower4(T4)',
    zoneID: 1,
    zoneName: 'Zone 1',
    zoneNameThai: 'โซน 1',
    floorID: 1,
    floorName: 'L1',
    createTime: '2023-06-01 13:45:31.390',
    updateTime: '2023-07-06 00:25:39.227',
    active: 'True',
  };

  const tenantData = {
    tenantID: 1,
    tenantName: 'Defualt Tenant',
    nameEng: 'Defualt Tenant',
    nameThai: 'ดีฟอลท์ เทแนนท์',
    phone: '0999999999',
    email: 'Tenant@Email.com',
    address: null,
    showKiosk: true,
    showReception: true,
    remark: null,
    createTime: '2023-06-27T00:00:00',
    createBy: 1,
    updateTime: '2023-06-27T00:00:00',
    updateBy: 1,
    active: true,
    tenantAuthFloors: [
      {
        locationID: 1,
        isDefaultFloor: true,
      },
    ],
  };
  let spy: any;

  afterEach(() => {
    spy && spy.mockRestore();
  });

  beforeAll(async () => {
    memberService = new MemberService();
    jobService = new JobService();
    await SyncDataFromS3Repository.deleteMany({
      where: {
        name: {
          in: ['locations.json', 'tenants.json', 'towers.json'],
        },
      },
    });

    await SyncDataFromS3Repository.create({
      data: {
        name: 'locations.json',
        last_modified: new Date('2023-05-24T04:59:08.427Z'),
        sync_type: 'manual',
      },
    });

    await SyncDataFromS3Repository.create({
      data: {
        name: 'tenants.json',
        last_modified: new Date('2023-05-24T04:59:08.427Z'),
        sync_type: 'manual',
      },
    });
    await SyncDataFromS3Repository.create({
      data: {
        name: 'towers.json',
        last_modified: new Date('2023-05-24T04:59:08.427Z'),
        sync_type: 'manual',
      },
    });
    await SyncDataFromS3Repository.create({
      data: {
        name: 'location.json',
        last_modified: new Date('2023-05-24T04:59:08.427Z'),
        sync_type: 'manual',
      },
    });
    await SyncDataFromS3Repository.create({
      data: {
        name: 'tenant.json',
        last_modified: new Date('2023-05-24T04:59:08.427Z'),
        sync_type: 'manual',
      },
    });
    await SyncDataFromS3Repository.create({
      data: {
        name: 'tower.json',
        last_modified: new Date('2023-05-24T04:59:08.427Z'),
        sync_type: 'manual',
      },
    });
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 86,
      locationMapping: [locationMapping],
    });

    await jobService.sync('location');

    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [{ ...tenantData, tenantAuthFloors: [tenantData.tenantAuthFloors[0]] }],
    });

    await jobService.sync('tenant');
  });
  it('should sync cannot find tenant', async () => {
    jest.spyOn(EventProducer, 'send').mockReturnValue();
    const result = await memberService.sync([{ ...memberData, tenantIDs: [3] }]);

    expect(result.result).toEqual(false);
  });
  it('should sync member success', async () => {
    jest.spyOn(EventProducer, 'send').mockReturnValue();
    const result = await memberService.sync([{ ...memberData, locations: [memberData.locations[0]] }]);
    expect(result).toEqual({ result: true, error: [] });
  });
  it('should sync member success with error cannot find location', async () => {
    jest.spyOn(EventProducer, 'send').mockReturnValue();

    const result = await memberService.sync([{ ...memberData, locations: [memberData.locations[1]] }]);
    expect(result).toEqual({
      result: false,
      error: [
        {
          type: 'cannot find location',
          uid_name: 'a50c364f-52ef-4d8c-96f4-67c854ef8ca7:1:a50c364f-52ef-4d8c-96f4-67c854ef8ca7:2',
        },
      ],
    });
  });

  describe('member service find', () => {
    it('should member found', async () => {
      const member = await MemberRepository.create({
        data: {
          uid: 'test_member_found',
          metadata: {
            personID: '2ad60a87-16e3-49b1-8ef6-d272432a3555',
            tenantIDs: [],
            phones: ['+669912345'],
            emails: ['test'],
          },
          account_id: 'test',
        },
      });

      jest.spyOn(FSParkingClient.httpClient, 'post').mockResolvedValueOnce({
        data: {
          data: [
            {
              departmentId: 'string',
              tenantId: 'string',
            },
          ],
          message: 'success',
          status: 0,
        },
      });

      const response = await memberService.find('test');
      expect(response).toEqual({ ...member, redemption_authorized: false, tenant_members: undefined });
    });
  });

  describe('member service update default floor', () => {
    it('should update success', async () => {
      const project = await ProjectRepository.create({
        data: {
          name: 'one bangkok',
          display_name: {},
          uid: '112123',
          towers: {
            create: {
              uid: 'test11233',
              name: 'test',
              display_name: {},
              floors: {
                create: {
                  uid: 'test',
                  name: 'test',
                  display_name: {},
                },
              },
              zones: {
                create: {
                  uid: 'test',
                  name: 'test',
                  display_name: {},
                },
              },
            },
          },
        },
        include: {
          towers: {
            include: {
              floors: true,
              zones: true,
            },
          },
        },
      });

      const location = await LocationRepository.create({
        data: {
          uid: 'test',
          name: 'test',
          tower_id: project.towers[0].id,
          floor_id: project.towers[0].floors[0].id,
          zone_id: project.towers[0].zones[0].id,
        },
      });

      const member = await MemberRepository.create({
        data: {
          uid: 'test2',
          metadata: {
            personID: '2ad60a87-16e3-49b1-8ef6-d272432a3555',
            tenantIDs: [],
            phones: ['+669912345'],
            emails: ['test'],
          },
          account_id: 'test',
          authorized_locations: {
            create: {
              location_id: location.id,
              accessor_type: 'member',
              default: false,
            },
          },
        },
      });

      jest.spyOn(FSClient.httpClient, 'post').mockResolvedValueOnce({
        data: {
          data: {
            personID: 'test',
            liftName: 'AAA',
            floorID: 1,
            floorName: 'test',
          },
          message: 'success',
          status: 0,
        },
      });

      const result = await memberService.update(member.id, project.towers[0].floors[0].id);
      expect(result).toEqual(true);
    });

    it('should update not success member not found', async () => {
      await expect(memberService.update('member.id', 'location.id')).rejects.toThrow(
        new CustomError(OBError.BMS_MEMB_003),
      );
    });

    it('should update not success autorized location not found', async () => {
      const member = await MemberRepository.create({
        data: {
          uid: 'test10',
          metadata: {
            personID: '2ad60a87-16e3-49b1-8ef6-d272432a3555',
            tenantIDs: [],
            phones: ['+669912345'],
            emails: ['test'],
          },
          account_id: 'test',
        },
      });
      await expect(memberService.update(member.id, 'location.id')).rejects.toThrow(
        new CustomError(OBError.BMS_LCT_003),
      );
    });

    it('should update not success cannot find selected autorized location', async () => {
      const project = await ProjectRepository.create({
        data: {
          name: 'one bangkok 1',
          display_name: {},
          uid: '101',
          towers: {
            create: {
              uid: '101',
              name: 'test',
              display_name: {},
              floors: {
                create: {
                  uid: '101',
                  name: 'test',
                  display_name: {},
                },
              },
              zones: {
                create: {
                  uid: '101',
                  name: 'test',
                  display_name: {},
                },
              },
            },
          },
        },
        include: {
          towers: {
            include: {
              floors: true,
              zones: true,
            },
          },
        },
      });

      const location = await LocationRepository.create({
        data: {
          uid: 'test',
          name: '101',
          tower_id: project.towers[0].id,
          floor_id: project.towers[0].floors[0].id,
          zone_id: project.towers[0].zones[0].id,
        },
      });

      const member = await MemberRepository.create({
        data: {
          uid: 'test4',
          metadata: {
            personID: '2ad60a87-16e3-49b1-8ef6-d272432a3555',
            tenantIDs: [],
            phones: ['+669912345'],
            emails: ['test'],
          },
          account_id: 'test',
          authorized_locations: {
            create: {
              location_id: location.id,
              accessor_type: 'member',
              default: false,
            },
          },
        },
      });

      await expect(memberService.update(member.id, 'location.id')).rejects.toThrow(
        new CustomError(OBError.BMS_LCT_003),
      );
    });

    it('should update not success location not found', async () => {
      const member = await MemberRepository.create({
        data: {
          uid: 'test3',
          metadata: {
            personID: '2ad60a87-16e3-49b1-8ef6-d272432a3555',
            tenantIDs: [],
            phones: ['+669912345'],
            emails: ['test'],
          },
          account_id: 'test',
        },
      });
      await expect(memberService.update(member.id, 'location.id')).rejects.toThrow(
        new CustomError(OBError.BMS_LCT_003),
      );
    });

    it('should update not success fs return error', async () => {
      const project = await ProjectRepository.create({
        data: {
          name: 'one bangkok 33',
          display_name: {},
          uid: '123',
          towers: {
            create: {
              uid: 'test123',
              name: 'test',
              display_name: {},
              floors: {
                create: {
                  uid: 'test123',
                  name: 'test',
                  display_name: {},
                },
              },
              zones: {
                create: {
                  uid: 'test123',
                  name: 'test',
                  display_name: {},
                },
              },
            },
          },
        },
        include: {
          towers: {
            include: {
              floors: true,
              zones: true,
            },
          },
        },
      });

      const location = await LocationRepository.create({
        data: {
          uid: 'test123',
          name: 'test',
          tower_id: project.towers[0].id,
          floor_id: project.towers[0].floors[0].id,
          zone_id: project.towers[0].zones[0].id,
        },
      });

      const member = await MemberRepository.create({
        data: {
          uid: 'test123',
          metadata: {
            personID: '2ad60a87-16e3-49b1-8ef6-d272432a3555',
            tenantIDs: [],
            phones: ['+669912345'],
            emails: ['test'],
          },
          account_id: 'test',
          authorized_locations: {
            create: {
              location_id: location.id,
              accessor_type: 'member',
              default: false,
            },
          },
        },
      });

      jest.spyOn(FSClient.httpClient, 'post').mockResolvedValueOnce(null);

      await expect(memberService.update(member.id, project.towers[0].floors[0].id)).rejects.toThrow(
        new CustomError(OBError.BMS_FS_004),
      );
    });
  });
});
