import { DateTimeUtils, logging } from 'ob-common-lib/dist';
import { get, isEmpty } from 'lodash';
import BaseController from './base_controller';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas } from '../openapi/interfaces/schemas';
import { MessageService } from '../services/message_service';
import { message } from '../../db/client';
import { languageSelector } from '../utils/language';
import {
  MessageUpdateData,
  PaginationQuery,
  MessageWhereInput,
} from '../services/interfaces/message_interface';

export default class MessageController extends BaseController {
  public async findAll(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['FindAllMessageResponse']>,
  ) {
    logging.info('start call find all message');

    const header = get(req, 'headers');
    const query = get(req, 'query');
    const name = get(query, 'category') as string;
    const pagination: PaginationQuery = {
      limit: +get(query, 'limit', 25),
      page: +get(query, 'page', 0),
      order: get(query, 'order') as 'asc' | 'desc',
      sort: get(query, 'sort', 'created_at') as string,
      count: get(query, 'count', false) as boolean,
    };

    const accountId = get(header, 'x-account-id', '').toString();
    const language = get(header, 'accept-language', '*').toString();
    const messageService = new MessageService();
    const result = await messageService.findAll(
      pagination,
      { account_id: accountId },
      {
        deleted_at: null,
        message_template: {
          message_category: {
            name,
          },
        },
      },
    );

    let totalNotification;
    if (pagination.count) {
      logging.info('start call count all message');
      totalNotification = await messageService.count(
        { account_id: accountId },
        {
          deleted_at: null,
          message_template: {
            message_category: {
              name,
            },
          },
        },
      );
    }
    const totalPages =
      Math.ceil((totalNotification ?? 0) / pagination.limit) - 1;

    let response: schemas['FineAllMessageData'] = [];

    response = await this.messageListSerializer(result, language);
    const meta = {
      limit: pagination.limit,
      page: pagination.page,
      total: pagination.count ? totalNotification : undefined,
      total_pages: pagination.count ? totalPages : undefined,
    };
    logging.info('finish call find all message');
    res.json({
      data: response,
      meta: meta,
    });
  }
  public async update(
    req: TypedRequest<schemas['UpdateMessageRequest']>,
    res: TypedResponse<schemas['UpdateMessageResponse']>,
  ) {
    logging.info('start update message');

    const params = get(req, 'params');
    const messageId = get(params, 'id');
    const body = get(req, 'body');

    const messageUpdateData: MessageUpdateData = {
      ...body,
    };

    const messageService = new MessageService();

    await messageService.update(messageUpdateData, { id: messageId });

    res.json({
      data: {
        result: true,
      },
    });
  }

  public async read(
    req: TypedRequest<schemas['ReadMessageRequestBody']>,
    res: TypedResponse<schemas['ReadMessageResponse']>,
  ) {
    logging.info('start read all message');

    const header = get(req, 'headers');
    const body = get(req, 'body');
    const exclude = get(body, 'exclude');
    const include = get(body, 'include');
    const accountId = get(header, 'x-account-id', '').toString();

    let where: MessageWhereInput = {
      deleted_at: null,
      read: false,
      recipient: { account_id: accountId },
    };

    if (exclude && !isEmpty(exclude)) {
      where = {
        ...where,
        NOT: { id: { in: exclude } },
      };
    } else if (include && !isEmpty(include)) {
      where = {
        ...where,
        id: { in: include },
      };
    }

    const messageService = new MessageService();
    await messageService.updateAll({ read: true }, where);
    res.json({
      data: {
        result: true,
      },
    });
  }

  public async find(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['GetMessageResponse']>,
  ) {
    logging.info('start find message');
    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();
    const language = get(header, 'accept-language', '*').toString();
    const params = get(req, 'params');
    const messageId = get(params, 'id');

    const messageService = new MessageService();

    const result = await messageService.find({
      id: messageId,
      recipient: { account_id: accountId },
    });
    const message = await this.messageDetailSerializer(result, language);

    res.json({
      data: {
        ...message,
        tag: [],
        deeplink: message.deeplink,
        thumbnail: message.thumbnail,
      },
    });
  }

  public async delete(
    req: TypedRequest<schemas['DeleteMessageRequestBody']>,
    res: TypedResponse<schemas['DeleteMessageResponse']>,
  ) {
    logging.info('start delete message');

    const header = get(req, 'headers');
    const body = get(req, 'body');
    const exclude = get(body, 'exclude');
    const include = get(body, 'include');
    const accountId = get(header, 'x-account-id', '').toString();

    let where: MessageWhereInput = {
      deleted_at: null,
      recipient: { account_id: accountId },
    };

    if (exclude && !isEmpty(exclude)) {
      where = {
        ...where,
        NOT: { id: { in: exclude } },
      };
    } else if (include && !isEmpty(include)) {
      where = {
        ...where,
        id: { in: include },
      };
    }
    const deletedAt = DateTimeUtils.getCurrentDateTime().toISOString();

    const messageUpdateData: MessageUpdateData = {
      deleted_at: deletedAt,
    };

    const messageService = new MessageService();

    await messageService.updateAll(messageUpdateData, where);

    res.json({
      data: {
        result: true,
      },
    });
  }

  private async messageListSerializer(result: message[], language: string) {
    const response: schemas['FineAllMessageData'] = [];

    result.forEach(async (row) => {
      const res = await this.messageSerializer(row, language);
      response.push({
        ...res,
      });
    });
    return response;
  }

  private async messageSerializer(message: object, language: string) {
    const title = languageSelector(
      get(message, ['message_template', 'title'], ''),
      language,
    );
    const subTitle = languageSelector(
      get(message, ['message_template', 'sub_title'], ''),
      language,
    );
    return {
      id: get(message, 'id', ''),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      title: title as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sub_title: subTitle as any,
      read: get(message, 'read', false),
      deeplink: get(message, 'message_template.deeplink', ''),
      thumbnail: get(message, 'message_template.thumbnail', ''),
      created_at: get(message, 'created_at', '') as string,
      category: get(message, [
        'message_template',
        'message_category',
        'name',
      ]) as string,
      icon_url: get(message, [
        'message_template',
        'message_category',
        'icon',
        'url',
      ]) as string,
    };
  }

  private async messageDetailSerializer(message: object, language: string) {
    const messageData: schemas['MessageData'] = [];
    const datas = get(message, 'data', []) as Array<[]>;
    if (datas !== null) {
      datas.forEach(async (data) => {
        const message = await this.messageDataSerializer(data, language);
        messageData.push({
          ...message,
        });
      });
    }
    const title = languageSelector(
      get(message, ['message_template', 'title'], ''),
      language,
    );
    const subTitle = languageSelector(
      get(message, ['message_template', 'sub_title'], ''),
      language,
    );
    return {
      id: get(message, 'id', ''),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      title: title as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sub_title: subTitle as any,
      read: get(message, 'read', false),
      deeplink: get(message, 'message_template.deeplink', null),
      thumbnail: get(message, 'message_template.thumbnail', null),
      created_at: get(message, 'created_at', '') as string,
      category: get(message, [
        'message_template',
        'message_category',
        'name',
      ]) as string,
      data: messageData,
    };
  }

  private async messageDataSerializer(data: object, language: string) {
    const id = get(data, 'message_data_template_id', '') as string;
    const template = get(data, 'data', {}) as Record<string, never>;
    return { id: id, data: languageSelector(template, language) };
  }
}
