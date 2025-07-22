import { JsonConvert, logging } from 'ob-common-lib/dist';
import { RecipientRepository } from '../repositories/recipient_repository';
import {
  DeviceData,
  IdentityData,
  IdentityPayload,
  ProfileData,
  RecipientCratedData,
  RecipientIncludeData,
  RecipientWhereData,
} from './interfaces/recipient_interface';
import { NotificationGroupRepository } from '../repositories/notification_group_repository';
import { CustomError } from '../middlewares/error_middleware';
import { filter, forEach, get, omit, some } from 'lodash';

export class RecipientService {
  private readonly recipientRepository: RecipientRepository;
  private readonly notificationGroupRepository: NotificationGroupRepository;

  constructor(
    recipientRepository?: RecipientRepository,
    notificationGroupRepository?: NotificationGroupRepository,
  ) {
    this.recipientRepository = recipientRepository || new RecipientRepository();
    this.notificationGroupRepository =
      notificationGroupRepository || new NotificationGroupRepository();
  }
  // will change any to event later.
  public async create(eventData: RecipientCratedData): Promise<boolean> {
    const { account_id, profile, identities, push_token, device } = eventData;
    try {
      // call notif_group repo to get all notif_group
      const notificationGroup =
        await this.notificationGroupRepository.findAll();
      const settingData = notificationGroup.map((notificationGroup) => ({
        notification_group_id: notificationGroup.id,
      }));
      //call recipient repo to create recipient data
      const result = await this.recipientRepository.create({
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
      });
      return result !== null;
    } catch (error) {
      throw new CustomError(500, `Cannot create recipient : ${error}`);
    }
  }

  public async updateRecipientProfile(updateData: ProfileData): Promise<void> {
    const accountId = updateData.account_id;
    const dataToUpdate = omit(updateData, 'account_id');

    const recipient = await this.recipientRepository.find({
      account_id: accountId,
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
      await this.recipientRepository.update(
        { id: recipientId },
        { data: newData },
      );

      logging.info(
        `Update user ${fieldToUpdate} complete : recipientId = (${recipientId})`,
      );
    }
  }

  public async addRecipientIdentity(updateData: IdentityPayload) {
    const { account_id, identity } = updateData;
    const recipient = await this.recipientRepository.find({ account_id });

    if (recipient && identity) {
      const fieldToUpdate = 'identities';
      const existingIdentities = get(
        recipient.data,
        fieldToUpdate,
        [],
      ) as Array<IdentityData>;

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

        await this.recipientRepository.update(
          { id: recipient.id },
          { data: newData },
        );
      }
    }
  }

  public async updateDefaultIdentity(updateData: IdentityPayload) {
    const { account_id, identity } = updateData;
    const recipient = await this.recipientRepository.find({ account_id });

    if (recipient && identity) {
      const fieldToUpdate = 'identities';
      const existingIdentities = get(
        recipient.data,
        fieldToUpdate,
        [],
      ) as Array<IdentityData>;

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

      await this.recipientRepository.update(
        { id: recipient.id },
        { data: newData },
      );
    }
  }

  public async find(
    payload: RecipientWhereData,
    include?: RecipientIncludeData,
  ): Promise<typeof result> {
    logging.info('start find recipient');
    const result = await this.recipientRepository.find(payload, include);
    return result;
  }

  public async updateRecipientDevice(updateData: DeviceData): Promise<void> {
    const accountId = updateData.account_id;
    const dataToUpdate = omit(updateData, 'account_id');

    const recipient = await this.recipientRepository.find({
      account_id: accountId,
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
      await this.recipientRepository.update(
        { id: recipientId },
        { data: newData },
      );

      logging.info(
        `Update user ${fieldToUpdate} complete : recipientId = (${recipientId})`,
      );
    }
  }
}
