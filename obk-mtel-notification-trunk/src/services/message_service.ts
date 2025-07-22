import logging from '../libs/logging';
import { JsonConvert } from '../libs/json_convert';
import { MessageTemplateData } from './interfaces/message_template_interface';
import MessageTemplateRepository from '../repositories/message_template_repository';
import { find, get, isEmpty, isUndefined, set } from 'lodash';
import MessageDataTemplateRepository from '../repositories/message_data_template_repository';

import { CustomError } from '../middlewares/error';
import MessageRepository from '../repositories/message_repository';
import { RecipientService } from './recipient_service';
import {
  DeviceData,
  IdentityData,
  PushTokenData,
  RecipientWhereData,
  SendMessageData,
} from './interfaces/recipient_interface';
import {
  AutoMessageCreatedData,
  EmailTemplateAdminPayload,
  MessageObject,
  MessageUpdateData,
  MessageWhereData,
  MessageWhereUpdateUniqueData,
  MesssageWhereUpdateData,
  OtpReferenceCreatedData,
  PaginationQuery,
  ResidentVisitorPassEmailPayload,
  VisitorPassEmailPayload,
} from './interfaces/message_interface';
import { sendNotificationToFCM } from '../adapters/fcm_adapter';
import MessageTransactionRepository from '../repositories/message_transaction_repository';
import AutoMessageRepository from '../repositories/auto_message_repository';
import { messageBuilder } from '../utils/message_builder';
import SettingRepository from '../repositories/setting_repository';
import { smsSender, emailSender } from './aws_service';
import WebSocketAdapter from '../adapters/websocket_adapter';
import { languageSelector } from '../libs/language';
import FcmMessagesService from './fcm_messages_service';

import fs from 'fs';
import path from 'path';
import { EMAIL_TEMPLATE } from '../consts/email_templates';
import { OBError } from '../libs/error_spec';
import { EventName } from '../utils/kafka';
import { CampaignStatus, Prisma } from '../../db/client/';
import { appendQueryParam } from '../utils/qurey_string';
import { NotificationSendBody } from '../controllers/notifications_controller.inteface';
import RecipientRepository from '../repositories/recipient_repository';
interface ReplaceValue {
  [key: string]: any;
}

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
    this.messageTemplateRepository = messageTemplateRepository || new MessageTemplateRepository();
    this.messageDataTemplateRepository = messageDataTemplateRepository || new MessageDataTemplateRepository();
    this.messageRepository = messageRepository || new MessageRepository();
    this.recipientService = new RecipientService();
    this.messageTransactionRepository = messageTransactionRepository || new MessageTransactionRepository();
    this.autoMessageRepository = autoMessageRepository || new AutoMessageRepository();
    this.settingRepository = settingRepository || new SettingRepository();
  }

  public async createTemplate(messageTemplatePayload: MessageTemplateData): Promise<boolean> {
    logging.info(`start create message template`);

    const validateDataTemplate = await this.validateMessageDataTemplate(messageTemplatePayload);

    if (!validateDataTemplate) {
      throw new CustomError(OBError.NOTI_MESG_006);
    }
    const data = messageTemplatePayload.data.map((item) => ({ data: item.data }));

    const result = await MessageTemplateRepository.create({
      data: {
        name: messageTemplatePayload.name,
        message_category: {
          connect: { id: messageTemplatePayload.messageTypeId },
        },
        title: messageTemplatePayload.title,
        sub_title: messageTemplatePayload.subTitle,
        data: data,
      },
    });

    return result !== null;
  }

  public async validateMessageDataTemplate(messageTemplatePayload: MessageTemplateData): Promise<boolean> {
    let validate = true;
    for (const row of messageTemplatePayload.data) {
      const templateId = get(row, 'message_data_template_id', '');
      const data = get(row, 'data', {});
      const template = await MessageDataTemplateRepository.findFirst({
        where: {
          id: templateId,
        },
      });

      if (template == null) {
        validate = false;
        break;
      }
      const isValid = Object.keys(JsonConvert.objectToJson(template.template)).every((key) =>
        Object.prototype.hasOwnProperty.call(data, key),
      );

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
  ): Promise<typeof result> {
    const recipientPayload: RecipientWhereData = {
      ...whereRecipient,
    };
    const recipient = await this.recipientService.find(recipientPayload);
    if (recipient == null) {
      throw new CustomError(OBError.NOTI_MESG_002);
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
    const messages = await MessageRepository.findMany({
      where: { ...messageWherePayload },
      include: {
        message_template: {
          include: {
            campaign: true,
            message_category: {
              include: {
                icon: true,
              },
            },
          },
        },
      },
      orderBy: {
        ...whereOrderBy,
      },
      take: pagination.limit,
      skip: skip,
    });

    const result =
      messageWherePayload.message_template?.message_category?.name === 'Announcement' ||
      isUndefined(messageWherePayload.message_template?.message_category?.name)
        ? this.filterAndUpdateAnnouncements(messages)
        : messages;
    return result;
  }

  public async count(whereRecipient?: RecipientWhereData, whereMessage?: MessageWhereData): Promise<typeof count> {
    const recipientPayload: RecipientWhereData = {
      ...whereRecipient,
    };

    const recipient = await this.recipientService.find(recipientPayload);
    if (recipient == null) {
      throw new CustomError(OBError.NOTI_MESG_002);
    }
    const recipientId = get(recipient, 'id');

    const messageWherePayload: MessageWhereData = {
      ...whereMessage,
      recipient_id: recipientId,
    };

    const count = MessageRepository.count({
      where: { ...messageWherePayload },
    });

    return count;
  }

  public async update(
    messageUpdateData: MessageUpdateData,
    messageWhereUpdateUniqueData: MessageWhereUpdateUniqueData,
    accountId: string,
  ): Promise<typeof result> {
    logging.info('start update mesage - service');
    const result = await MessageRepository.update({ data: messageUpdateData, where: messageWhereUpdateUniqueData });
    const recipient = await RecipientRepository.findFirst({
      where: {
        account_id: accountId,
      },
    });
    if (!recipient) {
      throw new CustomError(OBError.NOTI_RECPT_003);
    }
    this.broadcastUnreadMessageCount(recipient.id);

    if (!result) {
      throw new CustomError(OBError.NOTI_MESG_003);
    }
    return result;
  }

  public async updateAll(
    messageUpdateData: MessageUpdateData,
    messageWhereUpdateData: MesssageWhereUpdateData,
    accountId: string,
  ): Promise<typeof result> {
    logging.info('start update all mesage - service');
    const result = await MessageRepository.updateMany({ where: messageWhereUpdateData, data: messageUpdateData });
    const recipient = await RecipientRepository.findFirst({
      where: {
        account_id: accountId,
      },
    });
    if (!recipient) {
      throw new CustomError(OBError.NOTI_RECPT_003);
    }
    this.broadcastUnreadMessageCount(recipient.id);
    if (!result) {
      throw new CustomError(OBError.NOTI_MESG_004);
    }
    return result;
  }

  public async sendingMessage(campaignId: string, language: string): Promise<void> {
    logging.info('start sending message to 3rd party');
    const messages = await MessageRepository.findMany({
      where: {
        sender_id: campaignId,
        message_transaction: {
          none: {
            id: undefined,
          },
        },
      },
      include: {
        message_transaction: true,
        recipient: true,
        message_template: true,
      },
    });

    for (const message of messages) {
      const recipientToken = get(message, ['recipient', 'token']);
      const title = languageSelector(
        get(message, ['message_template', 'title']) as Record<string, never>,
        language,
      ).toString();

      if (message.data) {
        const messageBody = this.findMessageBody(message.data as object[]);
        const messageId = get(message, 'id');

        const unreadMessageCount = await this.unreadMessageCount(message.recipient.account_id);
        try {
          // send notification to FCM
          const result = await sendNotificationToFCM(
            recipientToken,
            {
              title: title,
              body: messageBody,
            },
            unreadMessageCount,
          );
          // send websocket notification to update unread count
          this.broadcastUnreadMessageCount(message.recipient_id);
          if (result) {
            MessageTransactionRepository.create({
              data: {
                message: {
                  connect: {
                    id: messageId,
                  },
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

  public findMessageBody(data: Array<object>): typeof messageBody {
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

  public async find(where: MessageWhereData): Promise<typeof result> {
    const id = get(where, 'id', '').toString();
    const accountId = get(where, 'recipient.account_id', '').toString();

    const buildQuery = this.buildWhereClause(accountId, id);

    const result = await MessageRepository.findFirst({
      where: { ...buildQuery },
      include: {
        message_template: {
          include: {
            message_category: true,
            campaign: { include: { tag_on_campaigns: { include: { tag: true } } } },
          },
        },
      },
    });
    if (result === null) throw new CustomError(OBError.NOTI_MESG_005);

    return result;
  }

  public async autoMessageCreate(event: AutoMessageCreatedData): Promise<void> {
    const autoMessage = await AutoMessageRepository.findFirst({
      where: {
        event_name: event.name,
      },
      include: { message_template: true },
    });

    if (!autoMessage) return;

    const messageTemplate = get(autoMessage, ['message_template']);
    const data = get(messageTemplate, ['data'], []) as Array<[]>;

    const recipient = await this.recipientService.find({
      account_id: event.payload.account_id,
    });

    let replaceValue = get(recipient, ['data', 'profile']);
    let replaceKey: object = { variable: 'profile' };

    const eventNames = [
      'ob-bms.visitor.visited',
      'ob-bms.service_request_status.updated',
      'ob-bms.air_condition_status.updated',
    ];

    if (eventNames.includes(event.name)) {
      replaceKey = {};
      replaceValue = event.payload.valueMessage || {};
    }

    const finalMessageData = messageTemplate.personalized
      ? await this.processMessages(data, replaceKey, replaceValue)
      : data;

    if (recipient) {
      const currentLanguage = get(recipient, ['data', 'setting', 'current_language'], 'en');
      const messageCreated = await MessageRepository.create({
        data: {
          recipient: { connect: { id: recipient.id } },
          data: finalMessageData,
          message_template: { connect: { id: messageTemplate.id } },
          sender_type: 'Auto message',
          sender_id: '',
        },
      });

      let titleMessage = '';
      if (!isEmpty(messageTemplate.title)) {
        titleMessage = languageSelector(messageTemplate.title as Record<string, never>, currentLanguage).toString();
      }

      const firstMessage = get(finalMessageData[0], 'data', {});
      if (firstMessage) {
        const message = languageSelector(firstMessage as Record<string, never>, currentLanguage);
        logging.info('start sending message');
        this.sendMessage(
          {
            recipient: recipient,
            notification_group_id: messageTemplate.notification_group_id as string,
            message: message.toString(),
            message_title: titleMessage,
            message_id: messageCreated.id,
            created_at: messageCreated.created_at,
            name: event.name,
          },
          currentLanguage,
          replaceValue,
        );
      }
    }
  }

  public async sendNotification(body: NotificationSendBody): Promise<boolean> {
    const recipient = await this.recipientService.find({ account_id: body.account_id });
    const messageTemplate = await MessageTemplateRepository.findFirst({
      where: { id: body.message_template_id },
    });
    if (!recipient || !messageTemplate) return false;

    const templateData = get(messageTemplate, ['data'], []) as Array<[]>;
    const replaceKey = {};
    const replaceValue = body.value_message;
    const messageData = messageTemplate.personalized
      ? await this.processMessages(templateData, replaceKey, replaceValue)
      : templateData;

    const templateTitle = get({ title: [{ data: messageTemplate.title }] }, ['title'], []) as Array<[]>;
    const titleData = await this.processMessages(templateTitle, replaceKey, replaceValue);
    const messageDataWithTitle = messageData.map((message: { title?: object }) => {
      message.title = get(titleData[0], 'data', {}) as object;
      return message;
    }) as object[];

    const currentLanguage = get(recipient, ['data', 'setting', 'current_language'], 'en');
    const messageCreated = await MessageRepository.create({
      data: {
        recipient: { connect: { id: recipient.id } },
        data: messageDataWithTitle,
        message_template: { connect: { id: messageTemplate.id } },
        sender_type: 'Notification API',
        sender_id: '',
      },
    });

    let titleMessage = '';
    const firstTitle = get(titleData[0], 'data', {});
    if (!isEmpty(firstTitle)) {
      titleMessage = languageSelector(firstTitle as Record<string, never>, currentLanguage).toString();
    }
    const firstMessage = get(messageData[0], 'data', {});
    if (!firstMessage) return false;
    const message = languageSelector(firstMessage as Record<string, never>, currentLanguage);
    logging.info('start sending message');
    this.sendMessage(
      {
        recipient: recipient,
        notification_group_id: messageTemplate.notification_group_id as string,
        message: message.toString(),
        message_title: titleMessage,
        message_id: messageCreated.id,
        created_at: messageCreated.created_at,
        name: body.email_template_name,
      },
      currentLanguage,
      replaceValue,
    );
    return true;
  }

  private async processMessages(data: Array<[]>, replaceKey: object, replaceValue: object): Promise<object[]> {
    return Promise.all(
      data.map(async (message) => {
        const messageObject: MessageObject = get(message, 'data', {});
        if (!messageObject) return { data: {} };

        const newMessageObject: MessageObject = {};
        for (const lang of Object.keys(messageObject)) {
          const template = messageObject[lang];
          if (template && replaceValue) {
            newMessageObject[lang] = await messageBuilder(template, replaceKey, replaceValue);
          }
        }
        return { data: newMessageObject };
      }),
    );
  }

  private async sendMessage(
    sendMessageData: SendMessageData,
    language: string,
    replaceValue?: ReplaceValue,
  ): Promise<void> {
    const eventName = sendMessageData.name;
    const setting = await SettingRepository.findFirst({
      where: {
        recipient_id: sendMessageData.recipient.id,
        notification_group_id: sendMessageData.notification_group_id,
      },
    });
    // call websocket broadcast unread message count
    this.broadcastUnreadMessageCount(sendMessageData.recipient.id);

    if (setting?.sms_enabled) {
      const recipientData = get(sendMessageData.recipient, 'data', {});
      const identities = get(recipientData, 'identities', []) as Array<IdentityData>;
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

    if (setting?.email_enabled) {
      const recipientData = get(sendMessageData.recipient, 'data', {});
      const identities = get(recipientData, 'identities', []) as Array<IdentityData>;
      const defaultEmail = find(identities, {
        provider: 'email',
        default: true,
      });

      if (defaultEmail && eventName) {
        if (sendMessageData && replaceValue) {
          const subjectData = sendMessageData.message_title || 'One Bangkok';
          await this.sendEmail(eventName, replaceValue, [defaultEmail.identifier], subjectData, language);
        } else {
          logging.info('sendMessageData or replaceValue is undefined. Cannot send email.');
        }
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
          device_id: device.device_unique_id,
          title: sendMessageData.message_title,
          description: sendMessageData.message,
          created_at: sendMessageData.created_at,
        };

        await webSocketAdapter.broadcast(data);
      }
    }
    if (setting?.push_enabled) {
      const fcmService = new FcmMessagesService();
      const recipientData = get(sendMessageData.recipient, 'data', {});
      const pushToken = get(recipientData, 'push_token', {}) as PushTokenData;
      const title = sendMessageData.message_title || '';
      const subtitle = sendMessageData.message;
      const unreadMessageCount = await this.unreadMessageCount(sendMessageData.recipient.account_id);
      const data = {
        title: title,
        body: subtitle,
        token: pushToken.value,
        id: sendMessageData.message_id ?? '',
        badgeCount: unreadMessageCount,
      };

      fcmService.sendMessage(data);
    }
  }
  private preprocessReplaceValue(replaceValue: ReplaceValue, language?: string): ReplaceValue {
    const processedReplaceValue: ReplaceValue = {};
    for (const key of Object.keys(replaceValue)) {
      let replacement = replaceValue[key];
      if (typeof replacement === 'object') {
        replacement = languageSelector(replacement, language ?? 'en').toString();
      }
      processedReplaceValue[key] = replacement;
    }
    return processedReplaceValue;
  }

  public async sendOtpEmail(otpEmailTemplate: OtpReferenceCreatedData): Promise<void> {
    const eventName = otpEmailTemplate.name;
    if (eventName === 'ob-iam.otp_reference.created') {
      const replaceValue = otpEmailTemplate.payload.valueMessage || {};
      const recipient_email = otpEmailTemplate.payload.identifier;
      const subjectData = "Here's your access code to One Bangkok app";
      await this.sendEmail(eventName, replaceValue, [recipient_email], subjectData);
    }
  }

  public async sendEmailTemplateToAdmin(emailDataTemplate: EmailTemplateAdminPayload): Promise<void> {
    const eventName = emailDataTemplate.name;

    const recipient = await this.recipientService.find({
      account_id: emailDataTemplate.payload.account_id,
    });

    const requester_name = get(recipient, ['data', 'profile', 'first_name']);

    const replaceValue: ReplaceValue =
      eventName === 'ob-bms.air_condition_request.created' || eventName === 'ob-bms.service_request.created'
        ? emailDataTemplate.payload.valueMessage || {}
        : {};

    let subjectData = 'One Bangkok';
    subjectData = this.setSubject(subjectData, emailDataTemplate.payload.valueMessage, eventName);

    const recipientEmails = process.env.RECIPIENT_EMAILS?.split(',') || [];

    if (recipientEmails) {
      await this.sendEmail(eventName, replaceValue, recipientEmails, subjectData, 'en', requester_name);
      logging.info(`submitted to sendEmail function`);
    } else {
      logging.info('recipient email is undefined');
    }
    logging.info(`email has been sent to all recipients`);
  }

  public async sendEmailToVisitor(sendEmailVisitorData: VisitorPassEmailPayload): Promise<void> {
    const eventName = sendEmailVisitorData.name;
    if (eventName === 'ob-bms.visitor_pass.created') {
      const recipientEmails = sendEmailVisitorData.payload.visitor_email;

      const inviter = await this.recipientService.find({
        account_id: sendEmailVisitorData.payload.account_id,
      });

      const replaceValue = sendEmailVisitorData.payload.valueMessage || {};

      const inviter_first_name = get(inviter, ['data', 'profile', 'first_name']);
      const inviter_last_name = get(inviter, ['data', 'profile', 'last_name']);

      const language = get(inviter, ['data', 'setting', 'current_language'], 'en');

      const inviter_name =
        inviter_first_name && inviter_last_name ? `${inviter_first_name} ${inviter_last_name}` : 'Someone';

      const subjectData = 'You Have Received a Visitor Pass';
      await this.sendEmail(eventName, replaceValue, [recipientEmails], subjectData, language, undefined, inviter_name);
    }
  }

  public async sendEmail(
    eventName: EventName,
    replaceValue: ReplaceValue,
    recipientEmails: string[],
    subjectData: string,
    language?: string,
    requester_name?: string,
    inviter_name?: string,
    invite_house_number?: string,
    project_id?: number,
  ): Promise<void> {
    const TEMPLATES_DIR = path.join(__dirname, `../templates/OB_email`);
    const templatePath = EMAIL_TEMPLATE[eventName];
    const templateFilePath = path.join(TEMPLATES_DIR, templatePath);
    let htmlContent = fs.readFileSync(templateFilePath, 'utf8');

    logging.info('Original replaceValue:', replaceValue);
    const translations = await this.loadTranslation(language ?? 'en');
    const processedReplaceValue = this.preprocessReplaceValue(replaceValue, language);

    const allReplacements = {
      ...translations,
      ...processedReplaceValue,
      requester_name: requester_name,
      inviter_name: inviter_name,
      tower_name: processedReplaceValue.tower_name,
      invite_house_number: invite_house_number,
    };

    // Apply all replacements
    Object.entries(allReplacements).forEach(([key, value]) => {
      const valueString = typeof value === 'number' ? value.toString() : value;
      if (typeof valueString === 'string') {
        htmlContent = htmlContent.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), valueString);
      } else {
        console.error(`Replacement value for key '${key}' is not a string.`);
      }
    });

    // Additional replacements
    const baseUrl = process.env.FONT_LOGO_S3 || 'https://ob-email-bucket.s3.ap-southeast-1.amazonaws.com';
    let map_concierge_room = '';
    if (project_id !== undefined) {
      const projectId = project_id.toString();
      map_concierge_room = `${baseUrl}/images/map_concierge_room_${projectId}.png`;
    }
    const replacements = {
      '{{ FONT_CSS_URL }}': `${baseUrl}/font/font.css`,
      '{{ STYLE_CSS_URL }}': `${baseUrl}/style/styles.css`,
      '{{ LOGO_URL }}': `${baseUrl}/images/Brandmark.png`,
      '{{ BACKGROUND_IMAGE_URL }}': `${baseUrl}/images/rec.png`,
      '{{ ADMIN_EMAIL }}': process.env.ADMIN_EMAIL || 'contactcenter@onebangkok.com',
      '{{ MAP_CONCIERGE_ROOM }}': map_concierge_room,
    };

    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), replacement);
    });
    // Prepare email data
    const emailData = {
      Source: process.env.EMAIL_SOURCE || 'sittitep.tosuwan@mtel.co.th',
      Destination: {
        ToAddresses: recipientEmails,
      },
      Message: {
        Subject: {
          Data: subjectData,
        },
        Body: {
          Html: {
            Data: htmlContent,
          },
        },
      },
    };

    console.log('==htmlContent', htmlContent);
    await emailSender.send(emailData);
    logging.info(`Email has been sent.`);
  }

  public async loadTranslation(language: string) {
    const filePath = path.join(__dirname, '../templates/OB_email/translations', `${language}.json`);

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading translations for ${language}: ${error}`);
      return {};
    }
  }

  private setSubject(subjectData: string, replaceValue: any, eventName: string) {
    switch (eventName) {
      case 'ob-bms.service_request_status.updated':
        return `${subjectData}: ${replaceValue.title}`;
      case 'ob-bms.air_condition_request.created':
        return 'One Bangkok - New air conditioner request created';
      case 'ob-bms.service_request.created':
        return `One Bangkok - New service request created: ${replaceValue.title}`;
      default:
        return subjectData;
    }
  }

  public async findAnnouncement(whereRecipient?: RecipientWhereData): Promise<typeof announcement> {
    const recipientPayload: RecipientWhereData = {
      ...whereRecipient,
    };

    const recipient = await this.recipientService.find(recipientPayload);
    if (recipient == null) {
      throw new CustomError(OBError.NOTI_MESG_002);
    }
    const recipientId = get(recipient, 'id');

    const announcement = await MessageRepository.findFirst({
      where: {
        recipient_id: recipientId,
        message_template: {
          is: {
            message_category: {
              name: 'Announcement',
            },
            campaign: {
              some: {
                status: CampaignStatus.APPROVED_SENT,
              },
            },
          },
        },
      },
      include: {
        message_template: {
          include: {
            campaign: true,
            message_category: {
              include: {
                icon: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return announcement;
  }

  private async filterAndUpdateAnnouncements(
    messages: Prisma.messageGetPayload<{
      include: { message_template: { include: { message_category: { include: { icon: true } }; campaign: true } } };
    }>[],
  ) {
    const filteredMessages = [];
    for (const item of messages) {
      if (item.message_template.message_category.name === 'Announcement') {
        const hasPushNotification = item.message_template.campaign.some((campaign) => campaign.push_notification_data);
        if (!hasPushNotification) {
          await MessageRepository.update({
            where: { id: item.id },
            data: { read: true },
          });
        } else {
          filteredMessages.push(item);
        }
      } else {
        filteredMessages.push(item);
      }
    }
    return filteredMessages;
  }

  private buildWhereClause(accountId?: string, messageId?: string): MessageWhereData {
    if (process.env.MULTI_CAST_NOTI === 'true') {
      return {
        AND: [
          {
            OR: [{ id: messageId }, { sender_id: messageId }],
          },
          {
            recipient: { account_id: accountId },
          },
        ],
      };
    } else {
      return {
        id: messageId,
        recipient: { account_id: accountId },
      };
    }
  }

  public appendAccountIdToDeeplink(message: object, accountId: string): typeof message {
    const hasDeeplinkwithAccountId = get(message, 'message_template.deeplink_with_account_id', false);
    const deeplink = get(message, 'message_template.deeplink');

    if (deeplink && hasDeeplinkwithAccountId) {
      const modifiedDeeplink = appendQueryParam(deeplink, 'id', accountId);
      set(message, 'message_template.deeplink', modifiedDeeplink);
    }
    return message;
  }

  public async sendEmailToResidentVisitor(sendEmailVisitorData: ResidentVisitorPassEmailPayload): Promise<void> {
    const eventName = sendEmailVisitorData.name;
    if (eventName === 'ob-bms.visitor_resident_pass.created') {
      const recipientEmails = sendEmailVisitorData.payload.visitor_email;
      let language = 'en';

      if (sendEmailVisitorData.payload.account_id) {
        const inviter = await this.recipientService.find({
          account_id: sendEmailVisitorData.payload.account_id,
        });
        language = get(inviter, ['data', 'setting', 'current_language'], 'en');
      }

      const replaceValue = sendEmailVisitorData.payload.valueMessage || {};

      const inviter_name = sendEmailVisitorData.payload.invite_name;
      const inviter_house_number = sendEmailVisitorData.payload.invite_house_number;
      const project_id = sendEmailVisitorData.payload.project_id;
      const subjectData = language === 'th' ? 'คุณได้รับบัตรผ่านสำหรับผู้มาติดต่อ' : 'You Have Received a Visitor Pass';
      await this.sendEmail(
        eventName,
        replaceValue,
        [recipientEmails],
        subjectData,
        language,
        '',
        inviter_name,
        inviter_house_number,
        project_id,
      );
    } else if (eventName === 'ob-bms.visitor_resident_vehicle_checkout.created') {
      const recipientEmails = sendEmailVisitorData.payload.visitor_email;
      let language = 'en';
      if (sendEmailVisitorData.payload.account_id) {
        const inviter = await this.recipientService.find({
          account_id: sendEmailVisitorData.payload.account_id,
        });
        language = get(inviter, ['data', 'setting', 'current_language'], 'en');
      }

      const replaceValue = sendEmailVisitorData.payload.valueMessage || {};

      const subjectData =
        language === 'th' ? 'เวลานำรถออกของผู้เยี่ยมชมใกล้ถึงแล้ว' : 'Visitor Vehicle Checkout Time Approaching';
      await this.sendEmail(eventName, replaceValue, [recipientEmails], subjectData, language, '');
    }
  }

  public async unreadMessageCount(accountId: string): Promise<number> {
    const recipient = await RecipientRepository.findFirst({
      where: {
        account_id: accountId,
      },
    });

    if (!recipient?.id) {
      throw new Error('Recipient not found');
    }
    const unreadMessagesCount = await MessageRepository.count({
      where: {
        AND: [{ recipient_id: recipient.id }, { read: false }],
      },
    });
    return unreadMessagesCount;
  }

  public async broadcastUnreadMessageCount(recipientId: string): Promise<void> {
    const webSocketAdapter = new WebSocketAdapter();
    try {
      const recipient = await RecipientRepository.findFirst({
        where: {
          id: recipientId,
        },
      });
      if (!recipient) {
        throw new CustomError(OBError.NOTI_RECPT_003);
      }
      const badgeCount = await this.unreadMessageCount(recipient.account_id);
      const recipientData = get(recipient, 'data', {});
      const device = get(recipientData, 'device', {}) as DeviceData;
      const updatedUnreadCountData = {
        id: recipient.id,
        type: 'notification_counting.updated',
        device_id: device.device_unique_id,
        created_at: new Date(),
        unread_message_count: badgeCount,
      };
      webSocketAdapter.broadcast(updatedUnreadCountData).catch((error) => logging.error(error));
    } catch (error) {
      throw new CustomError(OBError.NOTI_WS_001);
    }
  }
}
