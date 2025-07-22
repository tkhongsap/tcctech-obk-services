import { OperationId, Route, Header, Queries, Get, Body, Put, Delete, Path } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { BaseController } from './base_controller';
import {
  MessageQuery,
  MessageGetResult,
  MessageBodyPut,
  MessageBodyDelete,
  MessageGetResponse,
  MessageBooleanResponse,
  MessageGetIndexResult,
} from './message_controller.interfaces';
import { DateTimeUtils } from '../libs/datetime';
import { get, isEmpty } from 'lodash';
import { MessageService } from '../services/message_service';
import { PaginationQuery } from '../services/interfaces/message_interface';
import {
  messageListSerializer,
  messageDetailLanguageSerealizer,
  MessageLanguageSerializer,
} from './message_controller.serializer';
import { Prisma } from '../../db/client';
import logging from '../libs/logging';
import { MessageUpdateData } from '../services/interfaces/message_interface';
import messageWhereInput = Prisma.messageWhereInput;
@Route('me/message')
export class MessageController extends BaseController {
  @Get('{id}')
  @OperationId('message.index')
  public async index(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Path() id: string,
    @Header('accept-language') languages?: string,
  ): Promise<WrappedResponse<MessageGetIndexResult>> {
    try {
      const language = languages ? languages : '*';
      const messageId = id;
      const messageService = new MessageService();
      const result = await messageService.find({
        id: messageId,
        recipient: { account_id: accountId },
      });

      const updatedMessage = messageService.appendAccountIdToDeeplink(result!, accountId);

      this.setStatus(200);
      const message = await messageDetailLanguageSerealizer(updatedMessage, language);

      return { data: { ...message, tag: message.tag, deeplink: message.deeplink, thumbnail: message.thumbnail } };
    } catch (error) {
      this.setStatus(400);
      return { data: null };
    }
  }

  @Get('')
  @OperationId('message.show')
  public async show(
    @Header('x-account-id') accountId: string,
    @Queries() query: MessageQuery,
    @Header('accept-language') languages?: string,
  ): Promise<WrappedResponse<MessageGetResponse>> {
    const language = languages ? languages : '*';

    const pagination: PaginationQuery = {
      limit: +get(query, 'limit', 25),
      page: +get(query, 'page', 0),
      order: (query.order as 'asc' | 'desc') || 'desc',
      sort: get(query, 'sort', 'created_at') as string,
      count: get(query, 'count', false) as boolean,
    };

    const name = query.category;
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
    let response: MessageGetResult[] = [];

    const totalPages = Math.ceil((totalNotification ?? 0) / pagination.limit) - 1;

    response = await messageListSerializer(result, language);

    const meta = {
      limit: pagination.limit,
      page: pagination.page,
      total: pagination.count ? totalNotification : undefined,
      total_pages: pagination.count ? totalPages : undefined,
    };

    return { data: { data: response, meta: meta } };
  }
  @Put('{id}')
  @OperationId('message.update')
  public async update(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Path() id: string,
    @Body() body: MessageBodyPut,
  ): Promise<WrappedResponse<MessageBooleanResponse>> {
    try {
      const messageService = new MessageService();
      await messageService.update(body, { id }, accountId);
      return { data: { result: true } };
    } catch (error) {
      return { data: { result: false } };
    }
  }
  @Put('read/messages')
  @OperationId('message.read')
  public async read(
    @Body() body: MessageBodyDelete,
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
  ): Promise<WrappedResponse<MessageBooleanResponse>> {
    try {
      const { exclude, include } = body;
      let where: messageWhereInput = {
        deleted_at: null,
        recipient: { account_id: accountId },
        read: false,
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
      await messageService.updateAll({ read: true }, where, accountId);

      return { data: { result: true } };
    } catch (error) {
      return { data: { result: false } };
    }
  }
  @Delete('')
  @OperationId('message.destroy')
  public async destroy(
    @Header('x-account-id') accountId: string,
    @Body() body: MessageBodyDelete,
  ): Promise<WrappedResponse<MessageBooleanResponse>> {
    try {
      const { exclude, include } = body;
      let where: messageWhereInput = {
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
      await messageService.updateAll(messageUpdateData, where, accountId);
      this.setStatus(200);
      return { data: { result: true } };
    } catch (error) {
      return { data: { result: false } };
    }
  }

  @Get('announcement/messages')
  @OperationId('message.anonouncement')
  public async anonouncement(
    @Header('x-account-id') accountId: string,
    @Header('accept-language') languages?: string,
  ): Promise<WrappedResponse<MessageGetResult>> {
    const language = languages ? languages : '*';

    const messageService = new MessageService();
    const announcement = await messageService.findAnnouncement({ account_id: accountId });

    return { data: announcement ? await MessageLanguageSerializer(announcement, language) : announcement };
  }
}
