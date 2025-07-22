import { EventProducer, logging } from 'ob-common-lib/dist';
import BaseRepository from '../../repositories/base_repository';
import DeviceRepository from '../../repositories/device_repository';
import { DeviceCreateData } from './index.interface';
import { get } from 'lodash';

export default class DeviceService {
  private readonly deviceRepository: DeviceRepository;
  private readonly baseRepository: BaseRepository;

  constructor(
    deviceRepository?: DeviceRepository,
    baseRepository?: BaseRepository,
  ) {
    this.deviceRepository = deviceRepository || new DeviceRepository();
    this.baseRepository = baseRepository || new BaseRepository();
  }

  public async create(data: DeviceCreateData): Promise<boolean> {
    logging.info(`start create new device for ${data.accountId}`);

    const oldDeviceRecord = await this.deviceRepository.find({
      account_id: data.accountId,
      active: true,
    });

    let newDevice;

    if (oldDeviceRecord && oldDeviceRecord.device_id !== data.deviceId) {
      await this.baseRepository.transaction(async () => {
        await this.deviceRepository.updateMany(
          {
            account_id: data.accountId,
            active: true,
          },
          { active: false },
        );

        newDevice = await this.deviceRepository.create({
          device_id: data.deviceId,
          os: data.os,
          account: {
            connect: { id: data.accountId },
          },
        });
      }, [this.deviceRepository]);

      EventProducer.send({
        name: 'ob-iam.device.added',
        payload: {
          device: {
            account_id: data.accountId,
            device_id: data.deviceId,
            device_os: data.os,
            device_unique_id: data.deviceId,
          },
        },
      });
    } else if (!oldDeviceRecord) {
      await this.deviceRepository.create({
        device_id: data.deviceId,
        os: data.os,
        account: {
          connect: { id: data.accountId },
        },
      });
    }
    logging.info(`finish create new device for ${data.accountId}`);

    return true;
  }

  public async find(accountId: string) {
    const device = await this.deviceRepository.find({
      account_id: accountId,
      active: true,
    });
    return device;
  }
}
