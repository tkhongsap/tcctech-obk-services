import BaseRepository from '../../repositories/base_repository';
import DeviceRepository from '../../repositories/device_repository';
import { EventProducer } from '../../utils/kafka';
import logging from '../../utils/logging';
import { DeviceCreateData } from './index.interface';

export default class DeviceService {
  private readonly baseRepository: BaseRepository;

  constructor(baseRepository?: BaseRepository) {
    this.baseRepository = baseRepository || new BaseRepository();
  }
  public async create(data: DeviceCreateData): Promise<boolean> {
    logging.info(`start create new device for ${data.accountId}`);

    const oldDeviceRecord = await DeviceRepository.findFirst({
      where: {
        account_id: data.accountId,
        active: true,
      },
    });

    if (oldDeviceRecord && oldDeviceRecord.device_id !== data.deviceId) {
      const isExistDevice = await DeviceRepository.findFirst({
        where: {
          account_id: data.accountId,
          device_id: data.deviceId,
        },
        orderBy: { created_at: 'desc' },
      });
      await this.baseRepository.transaction(async () => {
        await DeviceRepository.updateMany({
          where: {
            account_id: data.accountId,
            active: true,
          },
          data: { active: false },
        });

        if (isExistDevice) {
          await DeviceRepository.update({
            where: {
              id: isExistDevice.id,
              active: false,
            },
            data: { active: true },
          });
        } else {
          await DeviceRepository.create({
            data: {
              device_id: data.deviceId,
              os: data.os,
              account: {
                connect: { id: data.accountId },
              },
            },
          });
        }
      }, []);

      this.sendDeviceAndFCMTokenAddedEvent(data);
    } else if (!oldDeviceRecord) {
      await DeviceRepository.create({
        data: {
          device_id: data.deviceId,
          os: data.os,
          account: {
            connect: { id: data.accountId },
          },
        },
      });

      this.sendDeviceAndFCMTokenAddedEvent(data);
    } else if (oldDeviceRecord && oldDeviceRecord.device_id === data.deviceId) {
      this.sendDeviceAndFCMTokenAddedEvent(data);
    }

    logging.info(`finish create new device for ${data.accountId}`);

    return true;
  }

  public async find(accountId: string): Promise<typeof device> {
    const device = await DeviceRepository.findFirst({
      where: {
        account_id: accountId,
        active: true,
      },
    });
    return device;
  }

  private sendDeviceAndFCMTokenAddedEvent(data: DeviceCreateData): void {

    EventProducer.send({
      name: 'ob-iam.device_and_fcm_token.added',
      payload: {
        account_id: data.accountId,
        push_token: data.pushToken,
        device: {
          device_id: data.deviceId,
          device_os: data.os,
          device_unique_id: data.deviceId,
        },
      },
    });
  }
}
