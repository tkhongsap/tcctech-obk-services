import { JsonConvert } from '../libs/json_convert';
import logging from '../libs/logging';
import RecipientRepository from '../repositories/recipient_repository';
import {
  DeviceAndFCMTokenData,
  DeviceData,
  IdentityData,
  IdentityPayload,
  ProfileData,
  RecipientCratedData,
  RecipientFCMTokenData,
  RecipientIncludeData,
  RecipientWhereData,
  SettingData,
} from './interfaces/recipient_interface';
import NotificationGroupRepository from '../repositories/notification_group_repository';
import { filter, forEach, get, omit, some } from 'lodash';
import TargetGroupRepository from '../repositories/target_group_repository';
import { CustomError } from '../middlewares/error';
import { OBError } from '../libs/error_spec';
import BaseRepository from '../repositories/base_repository';

export class RecipientService {
  private readonly baseRepository: BaseRepository;

  constructor(baseRepository?: BaseRepository) {
    this.baseRepository = baseRepository || new BaseRepository();
  }
  // will change any to event later.
  public async create(eventData: RecipientCratedData): Promise<boolean> {
    const { account_id, profile, identities, push_token, device } = eventData;
    try {
      // call notif_group repo to get all notif_group
      const notificationGroup = await NotificationGroupRepository.findMany();
      const settingData = notificationGroup.map((notificationGroup) => ({
        notification_group_id: notificationGroup.id,
      }));
      //call recipient repo to create recipient data
      const target_group = await TargetGroupRepository.findFirst({ where: { name: 'all' } });
      const result = await RecipientRepository.create({
        data: {
          account_id: account_id,
          data: {
            account_id: account_id,
            profile: {
              first_name: profile.first_name,
              middle_name: profile.middle_name,
              last_name: profile.last_name,
              gender: profile.gender,
              dob: profile.dob,
            },
            identities: JsonConvert.objectToJson(identities),
            push_token: {
              value: push_token.value,
              type: push_token.type,
            },
            device: {
              device_id: device.device_id,
              device_os: device.device_os,
              device_unique_id: device.device_unique_id,
            },
          },
          // many setting
          setting: {
            createMany: {
              data: settingData,
            },
          },
          target_group_members: {
            create: {
              target_group: {
                connect: {
                  id: target_group!.id,
                },
              },
            },
          },
        },
      });
      return result !== null;
    } catch (error) {
      throw new CustomError(OBError.NOTI_RECPT_002);
    }
  }

  public async updateRecipientProfile(updateData: ProfileData): Promise<void> {
    const accountId = updateData.account_id;
    const dataToUpdate = omit(updateData, 'account_id');

    const recipient = await RecipientRepository.findFirst({
      where: {
        account_id: accountId,
      },
    });
    const data = recipient?.data;
    const recipientId = get(recipient, 'id');

    if (dataToUpdate && data) {
      const fieldToUpdate = 'profile';
      const objData = JsonConvert.objectToJson(data);
      const newData = {
        ...objData,
        [fieldToUpdate]: dataToUpdate,
      };
      await RecipientRepository.update({ where: { id: recipientId }, data: { data: newData } });

      logging.info(`Update user ${fieldToUpdate} complete : recipientId = (${recipientId})`);
    }
  }

  public async updateRecipientSetting(updateData: SettingData): Promise<void> {
    const accountId = updateData.account_id;
    const dataToUpdate = omit(updateData, 'account_id');

    const recipient = await RecipientRepository.findFirst({
      where: {
        account_id: accountId,
      },
    });
    const data = recipient?.data;
    const recipientId = get(recipient, 'id');

    if (dataToUpdate && data) {
      const fieldToUpdate = 'setting';
      const objData = JsonConvert.objectToJson(data);
      const newData = {
        ...objData,
        [fieldToUpdate]: dataToUpdate,
      };
      await RecipientRepository.update({ where: { id: recipientId }, data: { data: newData } });

      logging.info(`Update user ${fieldToUpdate} complete : recipientId = (${recipientId})`);
    }
  }

  public async addRecipientIdentity(updateData: IdentityPayload): Promise<void> {
    const { account_id, identity } = updateData;
    const recipient = await RecipientRepository.findFirst({ where: { account_id } });

    if (recipient && identity) {
      const fieldToUpdate = 'identities';
      const existingIdentities = get(recipient.data, fieldToUpdate, []) as Array<IdentityData>;

      if (!some(existingIdentities, { identifier: identity.identifier })) {
        const newIdentity = {
          identifier: identity.identifier,
          provider: identity.provider,
          default: identity.default,
        };

        const newData = {
          ...JsonConvert.objectToJson(recipient.data),
          [fieldToUpdate]: [...existingIdentities, newIdentity],
        };

        await RecipientRepository.update({ where: { id: recipient.id }, data: { data: newData } });
      }
    }
  }

  public async updateDefaultIdentity(updateData: IdentityPayload): Promise<void> {
    const { account_id, identity } = updateData;
    const recipient = await RecipientRepository.findFirst({ where: { account_id } });

    if (recipient && identity) {
      const fieldToUpdate = 'identities';
      const existingIdentities = get(recipient.data, fieldToUpdate, []) as Array<IdentityData>;

      const providerIdentities = filter(existingIdentities, {
        provider: identity.provider,
      });

      forEach(providerIdentities, (item) => {
        item.default = item.identifier === identity.identifier;
      });

      const updatedIdentities = existingIdentities.map((item) => {
        if (item.provider === identity.provider) {
          return { ...item, default: item.identifier === identity.identifier };
        }
        return item;
      });

      const newData = {
        ...JsonConvert.objectToJson(recipient.data),
        [fieldToUpdate]: updatedIdentities,
      };

      await RecipientRepository.update({ where: { id: recipient.id }, data: { data: newData } });
    }
  }

  public async find(payload: RecipientWhereData, include?: RecipientIncludeData): Promise<typeof result> {
    logging.info('start find recipient');

    const result = await RecipientRepository.findFirst({ where: payload, include });
    return result;
  }

  public async updateRecipientDevice(updateData: DeviceData): Promise<void> {
    const accountId = updateData.account_id;
    const dataToUpdate = omit(updateData, 'account_id');

    await this.baseRepository.transaction(async () => {
      const recipient = await RecipientRepository.findFirst({
        where: {
          account_id: accountId,
        },
      });
      const data = recipient?.data;
      const recipientId = get(recipient, 'id');

      if (dataToUpdate && data) {
        const fieldToUpdate = 'device';
        const objData = JsonConvert.objectToJson(data);
        const newData = {
          ...objData,
          [fieldToUpdate]: dataToUpdate,
        };
        await RecipientRepository.update({ where: { id: recipientId }, data: { data: newData } });

        logging.info(`Update user ${fieldToUpdate} complete : recipientId = (${recipientId})`);
      }
    }, []);
  }

  public async deleteIdentity(updateData: IdentityPayload): Promise<void> {
    try {
      const { account_id, identity } = updateData;
      const recipient = await RecipientRepository.findFirst({
        where: {
          account_id: account_id,
        },
      });

      if (recipient && identity) {
        const fieldToUpdate = 'identities';
        const existingIdentities = get(recipient.data, fieldToUpdate, []) as Array<IdentityData>;

        const indexToDelete = existingIdentities.findIndex(
          (item) => item.identifier === identity.identifier && item.provider === identity.provider,
        );

        if (indexToDelete !== -1) {
          existingIdentities.splice(indexToDelete, 1);

          const newData = {
            ...JsonConvert.objectToJson(recipient.data),
            [fieldToUpdate]: existingIdentities,
          };

          await RecipientRepository.update({ where: { id: recipient.id }, data: { data: newData } });

          logging.info(`Deleted identity (${identity.identifier}) for account (${account_id})`);
        } else {
          logging.info('Identity not found in recipient data');
        }
      } else {
        logging.info('Recipient not found or identity data missing');
      }
    } catch (error) {
      throw new CustomError(OBError.NOTI_RECPT_001);
    }
  }

  public async updateRecipientFCMToken(updateData: RecipientFCMTokenData): Promise<void> {
    const accountId = updateData.account_id;
    const dataToUpdate = get(updateData, 'push_token');
    await this.baseRepository.transaction(async () => {
      const recipient = await RecipientRepository.findFirst({
        where: {
          account_id: accountId,
        },
      });
      const data = recipient?.data;
      if (!recipient) throw new CustomError(OBError.NOTI_MESG_002);

      const recipientId = get(recipient, 'id');
      if (dataToUpdate && data) {
        const objData = JsonConvert.objectToJson(data);
        const newData = {
          ...objData,
          push_token: dataToUpdate,
        };
        await RecipientRepository.update({ where: { id: recipientId }, data: { data: newData } });

        logging.info(`Update push_token complete : recipientId = (${recipientId})`);
      }
    }, []);
  }

  public async updateRecipientDeviceAndFCMToken(updateData: DeviceAndFCMTokenData): Promise<void> {
    const accountId = updateData.account_id;
    const dataToUpdate = omit(updateData, 'account_id');

    await this.baseRepository.transaction(async () => {
      const recipient = await RecipientRepository.findFirst({
        where: {
          account_id: accountId,
        },
      });
      const data = recipient?.data;
      const recipientId = get(recipient, 'id');

      if (dataToUpdate && data) {
        const objData = JsonConvert.objectToJson(data);
        const newData = {
          ...objData,
          device: dataToUpdate.device,
          push_token: dataToUpdate.push_token,
        };
        await RecipientRepository.update({ where: { id: recipientId }, data: { data: newData } });

        logging.info(`Update user device and push token complete : recipientId = (${recipientId})`);
      }
    }, []);
  }
}
