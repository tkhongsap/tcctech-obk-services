import { omit } from 'lodash';
import { JobService } from '../../src/services';

import * as s3 from '../../src/utils/aws/s3';
import * as file_utils from '../../src/utils/file/file_utils';
import { LogSyncDataRepository } from '../../src/repositories';
import SyncDataFromS3Repository from '../../src/repositories/sync_data_from_s3_repository';
import { resetDB } from '../helpers/db';
import AWS from 'aws-sdk';
import s3Client from '../../src/utils/aws/s3/s3_client';
import { ErrorSync } from '../../src/services/interfaces/job_service.interface';
import logging from '../../src/utils/logging';
import { SyncType } from '../../db/client/';

jest.mock('../../src/utils/aws/s3'); // Mock the module
jest.mock('../../src/utils/file/file_utils');
jest.mock('../../src/utils/aws/s3/s3_client');

describe('Job service', () => {
  let jobService: JobService;

  // Create a mock implementation for AWS.Request
  const createMockRequest = (response: any) => {
    return {
      promise: jest.fn().mockResolvedValue(response),
      abort: jest.fn(),
      createReadStream: jest.fn(),
      eachPage: jest.fn(),
      isPageable: jest.fn(),
      send: jest.fn(),
      on: jest.fn(),
      onAsync: jest.fn(),
      startTime: new Date(),
      httpRequest: {
        headers: {},
      },
    } as unknown as AWS.Request<any, AWS.AWSError>;
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
  };
  const towerData = {
    towerID: 1,
    towerName: 'Tower4(T4)',
    nameEng: null,
    nameThai: null,
    createTime: '05/31/2023 14:52:40',
    createBy: 1,
    updateTime: '05/31/2023 14:52:40',
    updateBy: 1,
    active: 'True',
    locations: [
      {
        locationID: 1,
        locationName: 'T4-L1 Zone1',
        projectID: 1,
        projectName: 'One Bangkok',
        towerID: 1,
        towerName: 'Tower4(T4)',
        zoneID: 1,
        zoneName: 'Zone 1',
        floorName: 'L1',
      },
      {
        locationID: 2,
        locationName: 'T4-L1 Zone2',
        projectID: 1,
        projectName: 'One Bangkok',
        towerID: 1,
        towerName: 'Tower4(T4)',
        zoneID: 2,
        zoneName: 'Zone 2',
        floorName: 'L1',
      },
    ],
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
      {
        locationID: 2,
        isDefaultFloor: false,
      },
      {
        locationID: 15,
        isDefaultFloor: false,
      },
      {
        locationID: 16,
        isDefaultFloor: true,
      },
      {
        locationID: 30,
        isDefaultFloor: true,
      },
    ],
  };
  beforeEach(async () => {
    await resetDB();
    jest.resetAllMocks();
    jest.clearAllMocks(); // Reset all mocks before each test

    jobService = new JobService();
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
  });

  it('should sync tower success', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [towerData],
    });

    const result = await jobService.sync('tower');
    expect(LogSyncDataRepository.create).toBeCalled;
    expect(result).toEqual({ sync: { result: true, jobError: [] } });
  });

  it('should sync tower success with error zone', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [
        {
          ...towerData,
          locations: [{ ...towerData.locations[1] }, omit(towerData.locations[0], ['zoneID', 'zoneName'])],
        },
      ],
    });

    const result = await jobService.sync('tower');
    expect(result).toEqual({
      sync: {
        result: false,
        jobError: [
          {
            type: 'zone',
            uid_name: '1:Tower4(T4)_undefined:undefined',
          },
        ],
      },
    });
  });

  it('should sync tower success with error tower', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [omit(towerData, ['towerName'])],
    });

    const result = await jobService.sync('tower');

    expect(result).toEqual({
      sync: {
        result: false,
        jobError: [
          {
            type: 'tower',
            uid_name: '1:undefined',
          },
        ],
      },
    });
  });

  it('should sync tower success with error project', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [
        {
          ...towerData,
          locations: [{ ...towerData.locations[1] }, omit(towerData.locations[0], ['projectID', 'projectName'])],
        },
      ],
    });

    const result = await jobService.sync('tower');

    expect(result).toEqual({
      sync: {
        result: false,
        jobError: [
          {
            type: 'project',
            uid_name: undefined,
          },
        ],
      },
    });
  });

  it('should sync location success', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 86,
      locationMapping: [locationMapping],
    });

    const result = await jobService.sync('location');
    expect(result).toEqual({ sync: { result: true, jobError: [] } });
  });

  it('should sync location success with error project', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 86,
      locationMapping: [omit(locationMapping, 'projectName')],
    });

    const result = await jobService.sync('location');
    expect(result).toEqual({
      sync: {
        result: false,
        jobError: [
          {
            type: 'location',
            uid_name: 'T4-L1 Zone1:undefined:Tower4(T4):Zone 1:L1',
          },
        ],
      },
    });
  });

  it('should sync location success with error tower', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 86,
      locationMapping: [omit(locationMapping, 'towerName')],
    });

    const result = await jobService.sync('location');
    expect(result).toEqual({
      sync: {
        result: false,
        jobError: [
          {
            type: 'location',
            uid_name: 'T4-L1 Zone1:One Bangkok:undefined:Zone 1:L1',
          },
        ],
      },
    });
  });

  it('should sync location success with error zone', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 86,
      locationMapping: [omit(locationMapping, 'zoneName')],
    });

    const result = await jobService.sync('location');
    expect(result).toEqual({
      sync: {
        result: false,
        jobError: [
          {
            type: 'location',
            uid_name: 'T4-L1 Zone1:One Bangkok:Tower4(T4):undefined:L1',
          },
        ],
      },
    });
  });

  it('should sync location success with error floor', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 86,
      locationMapping: [omit(locationMapping, 'floorName')],
    });

    const result = await jobService.sync('location');
    expect(result).toEqual({
      sync: {
        result: false,
        jobError: [
          {
            type: 'location',
            uid_name: 'T4-L1 Zone1:One Bangkok:Tower4(T4):Zone 1:undefined',
          },
        ],
      },
    });
  });

  it('should sync tenant success', async () => {
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

    const result = await jobService.sync('tenant');
    expect(result).toEqual({ sync: { result: true, jobError: [] } });
  });

  it('should sync tenant success with error tenant', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 86,
      locationMapping: [locationMapping],
    });
    await jobService.sync('location');

    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [{ ...tenantData, tenantAuthFloors: tenantData.tenantAuthFloors[0] }],
    });

    const result = await jobService.sync('tenant');
    expect(result).toEqual({ sync: { result: false, jobError: [{ type: 'tenant', uid_name: '1:Defualt Tenant' }] } });
  });

  it('should sync tenant success with error location', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 86,
      locationMapping: [locationMapping],
    });
    await jobService.sync('location');

    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [{ ...tenantData, tenantAuthFloors: [tenantData.tenantAuthFloors[1]] }],
    });

    const result = await jobService.sync('tenant');
    expect(result).toEqual({
      sync: { result: false, jobError: [{ type: 'cannot find authorized location', uid_name: '1:Defualt Tenant_2' }] },
    });
  });

  it('should sync tenant success with error', async () => {
    jest.spyOn(s3, 'downloadFromS3').mockReturnValue(Promise.resolve());
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [omit(tenantData, 'tenantID')],
    });

    const result = await jobService.sync('tenant');
    expect(result).toEqual({
      sync: {
        result: false,
        jobError: [
          {
            type: 'tenant',
            uid_name: 'undefined:Defualt Tenant',
          },
        ],
      },
    });
  });

  it('should sync success with do nothing', async () => {
    const result = await jobService.sync('test');
    expect(result).toEqual({ sync: { result: true, jobError: [] } });
  });

  it('should autosync successfully and do nothing if no files are modified', async () => {
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 86,
      locationMapping: [locationMapping],
    });

    const error: ErrorSync[] = [];
    jest
      .spyOn(jobService, 'syncLocation')
      .mockImplementation((updateSource: SyncType, fileName: string, lastModifiedFromS3?: Date | undefined) => {
        return Promise.resolve(error);
      });
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [{ ...tenantData, tenantAuthFloors: [tenantData.tenantAuthFloors[0]] }],
    });
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [towerData],
    });
    const getObjectMock = jest.fn().mockResolvedValue({ lastModified: new Date('2024-05-24T04:59:08.427Z') });
    jest.spyOn(s3Client, 'statObject').mockImplementation(getObjectMock);

    const result = await jobService.autoSync();
    expect(result).toEqual({ sync: { result: true, jobError: [] } });
  });

  it('should return false if no lastmodified', async () => {
    // jest.spyOn(s3Client, 'statObject').mockImplementationOnce(() => createMockRequest({ lastModified: null }));
    jest
      .spyOn(s3Client, 'statObject')
      .mockImplementationOnce(jest.fn().mockResolvedValue(createMockRequest({ lastModified: null })));
    const result = await jobService.autoSync();
    expect(result).toBe(false);
  });

  it('should return false if the AWS S3 bucket name is not set', async () => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    delete process.env.AWS_S3_BUCKET_NAME; // Unset bucket name
    const result = await jobService.autoSync();
    expect(result).toBe(false);
    process.env.AWS_S3_BUCKET_NAME = bucketName;
  });

  it('should log no', async () => {
    const mockData = await SyncDataFromS3Repository.create({
      data: {
        name: 'test',
        last_modified: new Date('2023-05-24T04:59:08.427Z'),
        sync_type: 'manual',
      },
    });
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 86,
      locationMapping: [locationMapping],
    });

    const error: ErrorSync[] = [];
    jest
      .spyOn(jobService, 'syncLocation')
      .mockImplementation((updateSource: SyncType, fileName: string, lastModifiedFromS3?: Date | undefined) => {
        return Promise.resolve(error);
      });
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [{ ...tenantData, tenantAuthFloors: [tenantData.tenantAuthFloors[0]] }],
    });
    jest.spyOn(file_utils, 'readAndParseJsonFile').mockReturnValue({
      count: 2,
      data: [towerData],
    });
    const getObjectMock = jest.fn().mockResolvedValue({ lastModified: new Date('2024-05-24T04:59:08.427Z') });

    jest.spyOn(s3Client, 'statObject').mockImplementation(getObjectMock);
    const loggingInfoSpy = jest.spyOn(logging, 'info');

    await jobService.autoSync();
    expect(loggingInfoSpy).toHaveBeenCalledWith(`No sync action taken for file name: ${mockData.name}`);
  });
});
