import { logging, JsonConvert, languageSelector } from 'ob-common-lib/dist';
import { MessageTemplateData } from './interfaces/message_template_interface';
import { MessageTemplateRepository } from '../repositories/message_template_repository';
import { find, get, isEmpty } from 'lodash';
import { MessageDataTemplateRepository } from '../repositories/message_data_template';
import { CustomError } from '../middlewares/error_middleware';
import { MessageRepository } from '../repositories/message_repository';
import { RecipientService } from './recipient_service';
import {
  DeviceData,
  IdentityData,
  RecipientWhereData,
  SendMessageData,
} from './interfaces/recipient_interface';
import {
  AutoMessageCreatedData,
  MessageObject,
  MessageUpdateData,
  MessageWhereData,
  MessageWhereUpdateUniqueData,
  MesssageWhereUpdateData,
  PaginationQuery,
} from './interfaces/message_interface';
import { sendNotificationToFCM } from '../adapters/fcm_adapter';
import { MessageTransactionRepository } from '../repositories/message_transaction_repository';
import { AutoMessageRepository } from '../repositories/auto_message_repository';
import { messageBuilder } from '../utils/message_builder';
import { SettingRepository } from '../repositories/setting_repository';
import { smsSender } from './aws_service';
import WebSocketAdapter from '../adapters/websocket_adapter';

export class MessageService {
  private readonly messageTemplateRepository: MessageTemplateRepository;
  private readonly messageDataTemplateRepository: MessageDataTemplateRepository;
  private readonly messageRepository: MessageRepository;
  private readonly recipientService: RecipientService;
  private readonly messageTransactionRepository: MessageTransactionRepository;
  private readonly autoMessageRepository: AutoMessageRepository;
  private readonly settingRepository: SettingRepository;

  constructor(
    messageTemplateRepository?: MessageTemplateRepository,
    messageDataTemplateRepository?: MessageDataTemplateRepository,
    messageRepository?: MessageRepository,
    messageTransactionRepository?: MessageTransactionRepository,
    autoMessageRepository?: AutoMessageRepository,
    settingRepository?: SettingRepository,
  ) {
    this.messageTemplateRepository =
      messageTemplateRepository || new MessageTemplateRepository();
    this.messageDataTemplateRepository =
      messageDataTemplateRepository || new MessageDataTemplateRepository();
    this.messageRepository = messageRepository || new MessageRepository();
    this.recipientService = new RecipientService();
    this.messageTransactionRepository =
      messageTransactionRepository || new MessageTransactionRepository();
    this.autoMessageRepository =
      autoMessageRepository || new AutoMessageRepository();
    this.settingRepository = settingRepository || new SettingRepository();
  }

  public async createTemplate(
    messageTemplatePayload: MessageTemplateData,
  ): Promise<boolean> {
    logging.info(`start create message template`);

    const validateDataTemplate = await this.validateMessageDataTemplate(
      messageTemplatePayload,
    );

    if (!validateDataTemplate) {
      throw new CustomError(400, 'data template is invalid');
    }

    const result = await this.messageTemplateRepository.create({
      name: messageTemplatePayload.name,
      message_category: {
        connect: { id: messageTemplatePayload.messageTypeId },
      },
      title: messageTemplatePayload.title,
      sub_title: messageTemplatePayload.subTitle,
      data: JsonConvert.objectToJson(messageTemplatePayload.data),
    });

    return result !== null;
  }

  public async validateMessageDataTemplate(
    messageTemplatePayload: MessageTemplateData,
  ): Promise<boolean> {
    let validate = true;
    for (const row of messageTemplatePayload.data) {
      const templateId = get(row, 'message_data_template_id', '');
      const data = get(row, 'data', {});
      const template = await this.messageDataTemplateRepository.find({
        id: templateId,
      });
      if (template == null) {
        validate = false;
        break;
      }

      const isValid = Object.keys(
        JsonConvert.objectToJson(template.template),
      ).every((key) => Object.prototype.hasOwnProperty.call(data, key));

      if (!isValid) {
        validate = false;
        break;
      }
    }

    return validate;
  }

  public async findAll(
    pagination: PaginationQuery,
    whereRecipient?: RecipientWhereData,
    whereMessage?: MessageWhereData,
  ): Promise<typeof messages> {
    const recipientPayload: RecipientWhereData = {
      ...whereRecipient,
    };
    const recipient = await this.recipientService.find(recipientPayload);
    if (recipient == null) {
      throw new CustomError(400, 'Cannot find recipient');
    }
    const recipientId = get(recipient, 'id');

    const messageWherePayload: MessageWhereData = {
      ...whereMessage,
      recipient_id: recipientId,
    };
    const whereOrderBy = {
      [pagination.sort]: pagination.order,
    };
    const skip = pagination.page * pagination.limit;
    const messages = await this.messageRepository.findAll(
      {
        ...messageWherePayload,
      },
      {
        message_template: {
          include: {
            message_category: {
              include: {
                icon: true,
              },
            },
          },
        },
      },
      {
        ...whereOrderBy,
      },
      pagination.limit,
      skip,
    );
    return messages;
  }

  public async count(
    whereRecipient?: RecipientWhereData,
    whereMessage?: MessageWhereData,
  ): Promise<typeof count> {
    const recipientPayload: RecipientWhereData = {
      ...whereRecipient,
    };
    const recipient = await this.recipientService.find(recipientPayload);
    if (recipient == null) {
      throw new CustomError(400, 'Cannot find recipient');
    }
    const recipientId = get(recipient, 'id');

    const messageWherePayload: MessageWhereData = {
      ...whereMessage,
      recipient_id: recipientId,
    };

    const count = this.messageRepository.count({
      ...messageWherePayload,
    });

    return count;
  }

  public async update(
    messageUpdateData: MessageUpdateData,
    messageWhereUpdateUniqueData: MessageWhereUpdateUniqueData,
  ) {
    logging.info('start update mesage - service');

    const result = await this.messageRepository.update(
      messageUpdateData,
      messageWhereUpdateUniqueData,
    );
    if (!result) {
      throw new CustomError(500, 'Cannot udpate message');
    }
  }

  public async updateAll(
    messageUpdateData: MessageUpdateData,
    messageWhereUpdateData: MesssageWhereUpdateData,
  ) {
    logging.info('start update all mesage - service');

    const result = await this.messageRepository.updateAll(
      messageUpdateData,
      messageWhereUpdateData,
    );
    if (!result) {
      throw new CustomError(500, 'Cannot update all message');
    }
  }

  public async sendingMessage(campaignId: string) {
    logging.info('start sending message to 3rd party');
    const messages = await this.messageRepository.findAll(
      {
        sender_id: campaignId,
        message_transaction: {
          none: {
            id: undefined,
          },
        },
      },
      {
        message_transaction: true,
        recipient: true,
        message_template: true,
      },
    );

    for (const message of messages) {
      const recipientToken = get(message, ['recipient', 'token']);
      const title = get(message, ['message_template', 'title']);
      if (message.data) {
        const messageBody = this.findMessageBody(message.data as object[]);
        const messageId = get(message, 'id');
        try {
          const result = await sendNotificationToFCM(recipientToken, {
            title: title,
            body: messageBody,
          });

          if (result) {
            this.messageTransactionRepository.create({
              message: {
                connect: {
                  id: messageId,
                },
              },
            });
          }
        } catch (error) {
          console.log(error);
          continue; // Continue to the next iteration when an error occurs
        }
      }
    }

    logging.info('finish sending message to 3rd party');
  }

  public findMessageBody(data: Array<object>) {
    let messageBody = '';
    for (const row of data) {
      const en = get(row, ['data', 'en']);
      if (en) {
        messageBody = en;
        break;
      }
    }
    return messageBody;
  }

  public async find(where: MessageWhereData) {
    const result = await this.messageRepository.find(where, {
      message_template: {
        include: {
          message_category: true,
        },
      },
    });
    if (result !== null) {
      return result;
    }
    throw new CustomError(500, 'Cannot find message');
  }

  public async autoMessageCreate(event: AutoMessageCreatedData) {
    const autoMessage = await this.autoMessageRepository.find({
      event_name: event.name,
    });

    if (!autoMessage) return;

    const messageTemplate = get(autoMessage, ['message_template']);
    const data = get(messageTemplate, ['data'], []) as Array<[]>;

    const recipient = await this.recipientService.find({
      account_id: event.payload.account_id,
    });

    let replaceValue = get(recipient, ['data', 'profile']);
    let replaceKey: object = { variable: 'profile' };

    if (event.name === 'ob-bms.visitor.visited') {
      replaceKey = {};
      replaceValue = event.payload.valueMessage;
    }
    const finalMessageData = messageTemplate.personalized
      ? await this.processMessages(data, replaceKey, replaceValue)
      : data;

    if (recipient) {
      const messageCreated = await this.messageRepository.create({
        recipient: { connect: { id: recipient.id } },
        data: finalMessageData,
        message_template: { connect: { id: messageTemplate.id } },
        sender_type: 'Auto message',
        sender_id: '',
      });
      let titleMessage = '';
      if (!isEmpty(messageTemplate.title)) {
        titleMessage = languageSelector(
          messageTemplate.title as Record<string, never>,
          'en',
        ).toString();
      }
      const firstMessage = get(finalMessageData[0], 'data');
      if (firstMessage) {
        const message = languageSelector(
          firstMessage as Record<string, never>,
          'en',
        );
        this.sendMessage({
          recipient: recipient,
          notification_group_id:
            messageTemplate.notification_group_id as string,
          message: message.toString(),
          message_title: titleMessage,
          message_id: messageCreated.id,
          created_at: messageCreated.created_at,
        });
      }
    }
  }

  private async processMessages(
    data: Array<[]>,
    replaceKey: object,
    replaceValue: object,
  ) {
    return Promise.all(
      data.map(async (message) => {
        const messageObject: MessageObject = get(message, 'data', {});
        if (!messageObject) return { data: {} };

        const newMessageObject: MessageObject = {};
        for (const lang of Object.keys(messageObject)) {
          const template = messageObject[lang];
          if (template && replaceValue) {
            newMessageObject[lang] = await messageBuilder(
              template,
              replaceKey,
              replaceValue,
            );
          }
        }
        return { data: newMessageObject };
      }),
    );
  }

  private async sendMessage(sendMessageData: SendMessageData) {
    const setting = await this.settingRepository.find({
      recipient_id: sendMessageData.recipient.id,
      notification_group_id: sendMessageData.notification_group_id,
    });

    if (setting?.sms_enabled) {
      const recipientData = get(sendMessageData.recipient, 'data', {});
      const identities = get(
        recipientData,
        'identities',
        [],
      ) as Array<IdentityData>;
      const defaultPhone = find(identities, {
        provider: 'phone',
        default: true,
      });

      if (defaultPhone) {
        const data = {
          Message: sendMessageData.message,
          PhoneNumber: defaultPhone.identifier,
        };
        await smsSender.send(data);
      }
    }
    if (setting?.in_app_enabled) {
      const recipientData = get(sendMessageData.recipient, 'data', {});
      const device = get(recipientData, 'device', {}) as DeviceData;
      const webSocketAdapter = new WebSocketAdapter();
      if (!isEmpty(device)) {
        const data = {
          id: sendMessageData.message_id,
          type: 'notification',
          device_id: device.device_id,
          title: sendMessageData.message_title,
          description: sendMessageData.message,
          created_at: sendMessageData.created_at,
        };
        await webSocketAdapter.broadcast(data);
      }
    }
  }
}
