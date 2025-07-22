import logging from '../libs/logging';
import CampaignRepository from '../repositories/campaign_repository';
import {
  flatMap,
  get,
  isArray,
  isEmpty,
  isNil,
  isNull,
  isPlainObject,
  map,
  mapValues,
  omitBy,
  set,
  uniq,
} from 'lodash';
import RecipientRepository from '../repositories/recipient_repository';
import MessageRepository from '../repositories/message_repository';
import { MessageService } from './message_service';
import { $Enums, CampaignStatus, Prisma } from '../../db/client/';
import { CampaignsCreateRequestBody } from '../controllers/v2/index.interface';
import { ImageService } from './image_service';
import { ContentTypeImage } from '../controllers/v2/index.interface';
import { DateTimeUtils } from '../libs/datetime';
import MessageTransactionRepository from '../repositories/message_transaction_repository';
import IamService from './iam_service';
import TransactionStatusCampaignRepository from '../repositories/transaction_status_campaign_repository';
import BaseRepository from '../repositories/base_repository';
import FcmMessagesService from './fcm_messages_service';
import { Language } from './interfaces/campaign_interface';
import { SentMessageMultiCastData } from '../utils/notification_adapter';

type Campaign = Prisma.campaignGetPayload<{
  include: {
    message_template: { include: { message_category: true } };
    tag_on_campaigns: { include: { tag: true } };
    campaign_target_groups: { include: { target_group: true } };
    transaction_status_campaign: true;
  };
}>;
type Campaigns = Prisma.campaignGetPayload<{
  include: {
    message_template: { include: { message_category: true } };
    campaign_target_groups: { include: { target_group: true } };
  };
}>;

type CampaignServiceCreateInput = CampaignsCreateRequestBody;
interface CampaignServiceUpdateInput extends CampaignsCreateRequestBody {
  submitted_at?: Campaign['submitted_at'];
  status?: Campaign['status'];
  note?: Campaign['note'];
}

function omitDeepBy<T>(object: T, predicate: (value: any) => boolean): T {
  function omitDeep(value: any): any {
    if (isArray(value)) {
      return value.map(omitDeep);
    } else if (isPlainObject(value)) {
      return mapValues(omitBy(value, predicate), omitDeep) as T;
    }
    return value;
  }
  return omitDeep(object) as T;
}

export class CampaignService {
  private readonly messageService: MessageService;
  private readonly baseRepository: BaseRepository;

  private imageService: ImageService = new ImageService();

  constructor(messageService?: MessageService, baseRepository?: BaseRepository) {
    this.messageService = messageService || new MessageService();
    this.baseRepository = baseRepository || new BaseRepository();
  }

  public async createAndSendingMessage(campaignId: string, language: string): Promise<boolean> {
    logging.info(`start create message `);

    const campaign = await CampaignRepository.findFirst({
      where: { id: campaignId },
      include: { message_template: true },
    });

    const messageTemplateId = get(campaign, 'message_template_id', '');

    if (isEmpty(messageTemplateId)) {
      return false;
    }

    const recipients = await RecipientRepository.findMany();

    const message: Prisma.messageCreateManyInput[] = [];

    Promise.all(
      recipients.map((item) => {
        const jsonData = campaign?.message_template?.data ?? {};
        message.push({
          message_template_id: messageTemplateId!,
          recipient_id: item.id,
          sender_id: campaignId,
          sender_type: '',
          data: jsonData,
        });
      }),
    );

    const result = await MessageRepository.createMany({ data: message });

    if (campaign) {
      this.messageService.sendingMessage(campaign.id, language);
    }

    return result !== null;
  }

  public async create(input: CampaignServiceCreateInput): Promise<Campaign> {
    let messageTemplateData;
    let messageTemplateThumbnail;

    if (input.message_template?.data) {
      messageTemplateData = await Promise.all(
        input.message_template?.data?.map(async (data) => {
          if ((data as any).type === 'image') {
            return {
              ...data,
              data: await Promise.all(
                (data as ContentTypeImage)?.data?.map(async (image: string) => {
                  if (image.startsWith('https')) {
                    // check if the image is already uploaded
                    return image;
                  }
                  return (await this.imageService.uploadImage(image))?.imageUrl;
                }),
              ),
            };
          }
          return data;
        }) as any[],
      );
    }

    if (input.message_template?.thumbnail) {
      if (input.message_template.thumbnail.startsWith('https')) {
        messageTemplateThumbnail = input.message_template.thumbnail;
      } else {
        messageTemplateThumbnail = (await this.imageService.uploadImage(input.message_template.thumbnail))?.imageUrl;
      }
    }

    const campaignData: Prisma.campaignCreateInput = {
      name: input.name,
      scheduled_at: input.scheduled_at,
      push_notification_data: input.push_notification_data as object,
      status: 'DRAFT',
      message_template: {
        create: {
          name: `[ADHOC] ${input.name}`,
          title: input.message_template?.title as object,
          sub_title: input.message_template?.sub_title as object,
          data: (messageTemplateData || []) as object[],
          adhoc: true,
          deeplink: input.message_template?.deeplink,
          deeplink_display_name: input.message_template?.deeplink_display_name as object,
          thumbnail: messageTemplateThumbnail,
          deeplink_with_account_id: input?.message_template?.deeplink_with_account_id,
          message_category: {
            connect: {
              id: input.message_category_id,
            },
          },
        },
      },
      updated_by: input.updated_by || '',
      updated_by_name: input.updated_by_name || '',
      created_by: input.created_by,
      created_by_name: input.updated_by_name || '',
    };

    if (input.target_group_id) {
      set(campaignData, 'campaign_target_groups.create.target_group_id', input.target_group_id);
    }

    if (input.tags) {
      set(
        campaignData,
        'tag_on_campaigns.create',
        map(input.tags, (tag) => {
          return {
            tag: {
              connectOrCreate: {
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                },
              },
            },
          };
        }),
      );
    }

    return await CampaignRepository.create({
      data: campaignData,
      include: CampaignRepository.defaultInclude,
    });
  }

  public async update(id: string, input: CampaignServiceUpdateInput): Promise<Campaign> {
    let messageTemplateData;
    let messageTemplateThumbnail;

    if (input.message_template?.data) {
      messageTemplateData = await Promise.all(
        input.message_template?.data?.map(async (data) => {
          if ((data as any).type === 'image') {
            return {
              ...data,
              data: await Promise.all(
                (data as ContentTypeImage)?.data?.map(async (image: string) => {
                  if (image.startsWith('https')) {
                    // check if the image is already uploaded
                    return image;
                  }
                  return (await this.imageService.uploadImage(image))?.imageUrl;
                }),
              ),
            };
          }
          return data;
        }) as any[],
      );
    }

    if (input.message_template?.thumbnail) {
      if (input.message_template.thumbnail.startsWith('https')) {
        messageTemplateThumbnail = input.message_template.thumbnail;
      } else {
        messageTemplateThumbnail = (await this.imageService.uploadImage(input.message_template.thumbnail))?.imageUrl;
      }
    }

    const campaignData: Prisma.campaignUpdateInput = {
      name: input.name,
      scheduled_at: input.scheduled_at,
      push_notification_data: input.push_notification_data as object,
      status: input.status,
      submitted_at: input.submitted_at,
      note: input.note,
      updated_by: input.updated_by || '',
      updated_by_name: input.updated_by_name || '',
      submitted_by: input.submitted_by || '',
      submitted_by_name: input.updated_by_name || '',
    };

    if (input.message_template) {
      set(campaignData, 'message_template.update', {
        ...input.message_template,
        data: messageTemplateData as object[],
        thumbnail: messageTemplateThumbnail,
        deeplink_display_name: (input.message_template?.deeplink_display_name ?? Prisma.DbNull) as object,
      });
    }

    if (input.message_category_id) {
      set(campaignData, 'message_template.update.message_category.connect.id', input.message_category_id);
    }

    if (input.target_group_id) {
      await CampaignRepository.update({ where: { id }, data: { campaign_target_groups: { deleteMany: {} } } });
      set(campaignData, 'campaign_target_groups.create.target_group_id', input.target_group_id);
    }

    if (input.tags) {
      await CampaignRepository.update({ where: { id }, data: { tag_on_campaigns: { deleteMany: {} } } });
      set(
        campaignData,
        'tag_on_campaigns.create',
        map(input.tags, (tag) => {
          return {
            tag: {
              connectOrCreate: {
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                },
              },
            },
          };
        }),
      );
    }
    console.log(omitDeepBy(campaignData, isNil));
    const data = omitDeepBy(campaignData, isNil);
    data.push_notification_data = (input.push_notification_data ?? Prisma.DbNull) as object;
    if (data.message_template?.update) {
      data.message_template.update.deeplink = input.message_template?.deeplink ?? null;
    }

    console.log(data);
    return await CampaignRepository.update({
      where: { id },
      data,
      include: CampaignRepository.defaultInclude,
    });
  }

  public async getPendingCampaigns(): Promise<typeof campaigns> {
    const currentTime = DateTimeUtils.getCurrentDateTime().toISOString();

    const campaigns = await CampaignRepository.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                status: {
                  equals: CampaignStatus.WATING_FOR_APPROVAL,
                },
              },
              {
                status: {
                  equals: CampaignStatus.APPROVED_SCHEDULED,
                },
              },
            ],
          },
          {
            scheduled_at: {
              lte: currentTime,
            },
          },
        ],
      },
      include: {
        message_template: { include: { message_category: true } },
        campaign_target_groups: {
          include: {
            target_group: {
              include: {
                target_group_members: {
                  include: { recipient: true },
                },
              },
            },
          },
        },
      },
    });
    return campaigns;
  }

  public async sent(): Promise<null> {
    let campaigns;
    try {
      campaigns = await this.getPendingCampaigns();
    } catch (error) {
      logging.error(`Error retrieving pending campaigns: ${error}`);
      return null; // Return or handle the error appropriately
    }

    for (const campaign of campaigns) {
      try {
        switch (campaign.status) {
          case 'WATING_FOR_APPROVAL':
            await this.updateCampaignStatus(campaign, 'REJECTED');
            break;
          case 'APPROVED_SCHEDULED':
            await this.updateCampaignStatus(campaign, 'APPROVED_SENT');
            break;
          default:
            logging.info(`Unknown or unhandled campaign status: ${campaign.status} (${campaign.id})`);
        }
      } catch (error) {
        logging.error(`Error processing campaign (${campaign.id}): ${error}`);
      }
    }

    return null;
  }

  private async updateCampaignStatus(campaign: Campaigns, newStatus: $Enums.CampaignStatus): Promise<void> {
    if (newStatus === 'APPROVED_SENT') {
      logging.info(`Sending campaign (${campaign.id})`);
      process.env.MULTI_CAST_NOTI === 'true'
        ? this.processCampaignMultiCast(campaign)
        : this.processCampaignRecipients(campaign);
    }

    await CampaignRepository.update({
      where: { id: campaign.id },
      data: { status: newStatus },
    });

    logging.info(`Campaign status updated to ${newStatus} (${campaign.id})`);
  }

  public async createMessageEntry(
    recipient: Prisma.recipientGetPayload<null>,
    campaign: Campaigns,
  ): Promise<Prisma.messageGetPayload<null> | null> {
    if (campaign.message_template) {
      const createdMessageResult = await MessageRepository.create({
        data: {
          recipient_id: recipient.id,
          data: campaign.message_template.data!,
          message_template_id: campaign.message_template?.id,
          sender_id: campaign.id,
          sender_type: 'Campaign',
        },
      });

      return createdMessageResult;
    } else {
      logging.info('cannot find message template');
    }
    return null;
  }

  public async sendPushNotification(
    recipient: Prisma.recipientGetPayload<null>,
    campaign: Campaigns,
    messageResult: Prisma.messageGetPayload<null>,
  ): Promise<void> {
    const token = get(recipient, ['data', 'push_token']);
    if (isEmpty(token)) {
      logging.info(`Cannot find user push notification token (${recipient.id})`);
      return; // Exit the function if no token is found
    }
    try {
      const messageService = new MessageService();
      const unreadMessageCount = await messageService.unreadMessageCount(recipient.account_id);
      const language = get(recipient, ['data', 'language'], 'en');
      const title = get(campaign.push_notification_data, ['title', language]);
      const message = get(campaign.push_notification_data, ['message', language]);
      const data = {
        title: title,
        body: message,
        token: token.value,
        id: messageResult.id,
        badgeCount: unreadMessageCount,
      };
      const fcmService = new FcmMessagesService();
      fcmService.sendMessage(data);
      messageService.broadcastUnreadMessageCount(recipient.id);

      await MessageTransactionRepository.create({ data: { message_id: messageResult.id } });
    } catch (error) {
      logging.info(`Sent push notification error (${recipient.id})`);
    }
  }

  public async processCampaignRecipients(campaign: Campaigns): Promise<void> {
    try {
      const campaignMembers = uniq(
        flatMap(
          campaign.campaign_target_groups,
          (
            group: Prisma.campaign_target_groupGetPayload<{
              include: { target_group: { include: { target_group_members: { include: { recipient: true } } } } };
            }>,
          ) =>
            map(
              group.target_group.target_group_members,
              (member: Prisma.target_group_memberGetPayload<{ include: { recipient: true } }>) => member.recipient,
            ),
        ),
      );

      if (!isNull(campaign.message_template) && campaign.message_template) {
        for (const recipient of campaignMembers) {
          try {
            if (typeof recipient === 'object' && recipient !== null && 'id' in recipient) {
              const messageResult = await this.createMessageEntry(recipient, campaign);

              if (!isEmpty(campaign.push_notification_data) && messageResult) {
                await this.sendPushNotification(recipient, campaign, messageResult);
              }
            } else {
              logging.info('Invalid recipient structure:', recipient);
            }
          } catch (error) {
            logging.info('Error processing individual recipient:', error);
          }
        }
      }
    } catch (error) {
      logging.info(`Error processing campaign recipients for campaign (${campaign.id}): ${error}`);
    }
  }

  public async processCampaignMultiCast(campaign: Campaigns): Promise<void> {
    try {
      const campaignMembers = uniq(
        flatMap(
          campaign.campaign_target_groups,
          (
            group: Prisma.campaign_target_groupGetPayload<{
              include: { target_group: { include: { target_group_members: { include: { recipient: true } } } } };
            }>,
          ) =>
            map(
              group.target_group.target_group_members,
              (member: Prisma.target_group_memberGetPayload<{ include: { recipient: true } }>) => member.recipient,
            ),
        ),
      );
      type RecipientData = {
        fcmToken: string;
        recipientId: string;
        unreadMessageCount: number;
      };

      const recipientDataEN: RecipientData[] = [];
      const recipientDataTH: RecipientData[] = [];

      const dataEN = {
        title: '',
        body: '',
        id: '',
        recipientData: recipientDataEN,
      };

      const dataTH = {
        title: '',
        body: '',
        id: '',
        recipientData: recipientDataTH,
      };

      if (!isNull(campaign.message_template) && campaign.message_template) {
        for (const recipient of campaignMembers) {
          try {
            if (typeof recipient === 'object' && recipient !== null && 'id' in recipient) {
              const messageResult = await this.createMessageEntry(recipient, campaign);
              const token = get(recipient, ['data', 'push_token', 'value']);

              if (!isEmpty(token) && !isEmpty(campaign.push_notification_data) && messageResult) {
                const language = get(recipient, ['data', 'setting', 'current_language'], 'en') as Language;
                const title = get(campaign.push_notification_data, ['title', language]);
                const body = get(campaign.push_notification_data, ['message', language]);
                const recipientId = get(recipient, ['id']);
                const accountId = get(recipient, ['account_id']);

                const messageService = new MessageService();
                const unreadMessageCount = await messageService.unreadMessageCount(accountId);
                if (language === 'th') {
                  dataTH.title = title;
                  dataTH.body = body;
                  dataTH.id = campaign.id;
                  recipientDataTH.push({ fcmToken: token, recipientId, unreadMessageCount });
                } else {
                  dataEN.title = title;
                  dataEN.body = body;
                  dataEN.id = campaign.id;
                  recipientDataEN.push({ fcmToken: token, recipientId, unreadMessageCount });
                }
                await MessageTransactionRepository.create({ data: { message_id: messageResult.id } });
              }
            } else {
              logging.info('Invalid recipient structure:', recipient);
            }
          } catch (error) {
            logging.error('Error processing individual recipient:', error);
          }
        }
      }

      if (!isEmpty(dataEN.recipientData) && !isEmpty(dataEN.id)) {
        await this.sendPushNotificationMultiCast(dataEN);
      } else {
        logging.info('No English FCM tokens or message ID, skipping English push notifications');
      }

      if (!isEmpty(dataTH.recipientData) && !isEmpty(dataTH.id)) {
        await this.sendPushNotificationMultiCast(dataTH);
      } else {
        logging.info('No Thai FCM tokens or message ID, skipping Thai push notifications');
      }
    } catch (error) {
      logging.error(`Error processing campaign recipients for campaign (${campaign.id}): ${error}`);
    }
  }

  public async updateStatus(id: string, accountId: string, data: Prisma.campaignUpdateInput): Promise<Campaign> {
    const campaignData = await CampaignRepository.findFirst({ where: { id } });
    const iamService = new IamService();

    const campaign = (await this.baseRepository.transaction(async () => {
      const updatedByName = await iamService
        .GetAccountDataName(accountId)
        .catch((error) => console.log('Get account data error', error));

      const campaignDataUpdate = await CampaignRepository.update({ data: data, where: { id } });

      await TransactionStatusCampaignRepository.create({
        data: {
          from_status: campaignData?.status,
          to_status: campaignDataUpdate.status,
          campaign_id: campaignDataUpdate.id,
          created_by: accountId,
          created_by_name: updatedByName ?? '',
        },
      });

      return campaignDataUpdate;
    }, [])) as Campaign;

    logging.info('updateStatus', campaign);
    return campaign;
  }

  public async sendPushNotificationMultiCast(data: SentMessageMultiCastData): Promise<void> {
    const fcmService = new FcmMessagesService();
    await fcmService.sentMessageMultiCast(data);
  }

  public async createCampaignResidential(input: CampaignServiceCreateInput): Promise<Campaign> {
    let messageTemplateData;
    let messageTemplateThumbnail;

    if (input.message_template?.data) {
      messageTemplateData = await Promise.all(
        input.message_template?.data?.map(async (data) => {
          if ((data as any).type === 'image') {
            return {
              ...data,
              data: await Promise.all(
                (data as ContentTypeImage)?.data?.map(async (image: string) => {
                  if (image.startsWith('https')) {
                    // check if the image is already uploaded
                    return image;
                  }
                  return (await this.imageService.uploadImage(image))?.imageUrl;
                }),
              ),
            };
          }
          return data;
        }) as any[],
      );
    }

    if (input.message_template?.thumbnail) {
      if (input.message_template.thumbnail.startsWith('https')) {
        messageTemplateThumbnail = input.message_template.thumbnail;
      } else {
        messageTemplateThumbnail = (await this.imageService.uploadImage(input.message_template.thumbnail))?.imageUrl;
      }
    }

    const iamService = new IamService();
    const updatedByName =
      input.updated_by &&
      (await iamService
        .GetAccountDataName(input.updated_by)
        .catch((error) => console.log('Get account data error', error)));

    const campaignData: Prisma.campaignCreateInput = {
      name: input.name,
      scheduled_at: input.scheduled_at,
      push_notification_data: input.push_notification_data as object,
      status: 'RESIDENTIAL',
      message_template: {
        create: {
          name: `[ADHOC] ${input.name}`,
          title: input.message_template?.title as object,
          sub_title: input.message_template?.sub_title as object,
          data: (messageTemplateData || []) as object[],
          adhoc: true,
          deeplink: input.message_template?.deeplink,
          deeplink_display_name: input.message_template?.deeplink_display_name as object,
          thumbnail: messageTemplateThumbnail,
          deeplink_with_account_id: input?.message_template?.deeplink_with_account_id,
          message_category: {
            connect: {
              id: input.message_category_id,
            },
          },
        },
      },
      updated_by: input.updated_by || '',
      updated_by_name: updatedByName || '',
      created_by: input.created_by,
      created_by_name: updatedByName || '',
    };

    if (input.target_group_id) {
      set(campaignData, 'campaign_target_groups.create.target_group_id', input.target_group_id);
    }

    if (input.tags) {
      set(
        campaignData,
        'tag_on_campaigns.create',
        map(input.tags, (tag) => {
          return {
            tag: {
              connectOrCreate: {
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                },
              },
            },
          };
        }),
      );
    }

    return await CampaignRepository.create({
      data: campaignData,
      include: CampaignRepository.defaultInclude,
    });
  }

  public async residentialSent(campaignIds: string[]): Promise<null> {
    let campaigns;
    try {
      if (campaignIds?.length > 0) {
        campaigns = await this.getResidentialCampaignsById(campaignIds);
      } else {
        campaigns = await this.getPendingResidentialCampaigns();
      }
    } catch (error) {
      logging.error(`Error retrieving pending campaigns: ${error}`);
      return null; // Return or handle the error appropriately
    }

    for (const campaign of campaigns) {
      try {
        await this.updateResidentialCampaignStatus(campaign, 'RESIDENTIAL_SENT');
      } catch (error) {
        logging.error(`Error processing campaign (${campaign.id}): ${error}`);
      }
    }

    return null;
  }

  public async getPendingResidentialCampaigns(): Promise<typeof campaigns> {
    const currentTime = DateTimeUtils.getCurrentDateTime().toISOString();

    const campaigns = await CampaignRepository.findMany({
      where: {
        status: {
          equals: CampaignStatus.RESIDENTIAL,
        },

        scheduled_at: {
          lte: currentTime,
        },
      },
      include: {
        message_template: { include: { message_category: true } },
        campaign_target_groups: {
          include: {
            target_group: {
              include: {
                target_group_members: {
                  include: { recipient: true },
                },
              },
            },
          },
        },
      },
    });
    return campaigns;
  }

  public async getResidentialCampaignsById(campaignIds: string[]): Promise<typeof campaigns> {
    const currentTime = DateTimeUtils.getCurrentDateTime().toISOString();

    const campaigns = await CampaignRepository.findMany({
      where: {
        id: {
          in: campaignIds,
        },

        status: {
          equals: CampaignStatus.RESIDENTIAL,
        },

        scheduled_at: {
          lte: currentTime,
        },
      },
      include: {
        message_template: { include: { message_category: true } },
        campaign_target_groups: {
          include: {
            target_group: {
              include: {
                target_group_members: {
                  include: { recipient: true },
                },
              },
            },
          },
        },
      },
    });
    return campaigns;
  }

  private async updateResidentialCampaignStatus(campaign: Campaigns, newStatus: $Enums.CampaignStatus): Promise<void> {
    if (newStatus === 'RESIDENTIAL_SENT') {
      logging.info(`Sending campaign (${campaign.id})`);
      process.env.MULTI_CAST_NOTI === 'true'
        ? this.processCampaignMultiCast(campaign)
        : this.processCampaignRecipients(campaign);
    }

    await CampaignRepository.update({
      where: { id: campaign.id },
      data: { status: newStatus },
    });

    logging.info(`Campaign status updated to ${newStatus} (${campaign.id})`);
  }
}
