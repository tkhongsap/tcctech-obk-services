import DeviceService from '../../src/services/device_service';
import DeviceRepository from '../../src/repositories/device_repository';
import BaseRepository from '../../src/repositories/base_repository';
import { instance, mock, when } from 'ts-mockito';
import { DateTime } from 'luxon';

describe('Device service', () => {
  let deviceService: DeviceService;
  let deviceRepoMock: DeviceRepository;
  let baseRepoMock: BaseRepository;

  beforeEach(() => {
    deviceRepoMock = mock(DeviceRepository);
    baseRepoMock = mock(BaseRepository);
    deviceService = new DeviceService(
      instance(deviceRepoMock),
      instance(baseRepoMock),
    );
  });

  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();

  const generateDeviceMock = () =>
    Promise.resolve({
      id: '1',
      account_id: '1234',
      device_id: '1111',
      os: 'ios',
      active: true,
      created_at: jsDate,
      updated_at: jsDate,
    });

  it('should create device successful', async () => {
    when(
      deviceRepoMock.find({ account_id: '1234', device_id: '1111', os: 'ios' }),
    ).thenReturn(generateDeviceMock());

    const result = await deviceService.create({
      accountId: '1234',
      deviceId: '1111',
      os: 'ios',
    });

    expect(result).toEqual(true);
  });

  // Add more test cases for different routes, request methods, and expected responses
});
