import { OperationId, Route, Get, Post, Body, Put, Delete, Queries } from 'tsoa';
import { BaseIndexQuery, WrappedResponse } from '../base_controller.interfaces';
import { map, set } from 'lodash';
import { Pagination } from '../base_controller';
import MessageTemplateRepository from '../../repositories/message_template_repository';
import {
  MessageTemplatesIndexResponseData,
  MessageTemplateData,
  MessageTemplateCreateRequestBody,
} from './index.interface';
import { messageTemplateSerializer } from './message_templates_controller.serializer';
import { CustomError } from '../../middlewares/error';
import { OBError } from '../../libs/error_spec';
import { MessageTemplateService } from '../../services/message_template_service';
import { Prisma } from '../../../db/client/';
import { QueriesTemplateController } from './message_templates_controller.interface';

@Route('message_templates')
export class MessageTemplatesController extends QueriesTemplateController {
  @Get('')
  @OperationId('message_templates.index')
  public async index(@Queries() query?: BaseIndexQuery): Promise<WrappedResponse<MessageTemplatesIndexResponseData>> {
    const _query = this.buildQuery<Prisma.message_templateFindManyArgs>({ ...query });
    set(_query, 'where', { personalized: true });

    const messageTemplates = await MessageTemplateRepository.findMany({
      ..._query,
      include: { message_category: true, campaign_target_groups: true },
    });

    const totalData = await MessageTemplateRepository.count({ where: _query.where });
    const pagination = this.paginationBuilder(
      totalData,
      query?.page_size || this.DEFAULT_PAGE_SIZE,
      query?.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;

    const serailizedMessageCategories = map(messageTemplates, (messageTemplate) => {
      return messageTemplateSerializer(messageTemplate);
    });

    this.setStatus(200);
    return { data: serailizedMessageCategories, pagination };
  }

  @Get('{id}')
  @OperationId('message_templates.show')
  public async show(id: string): Promise<WrappedResponse<MessageTemplateData>> {
    const messageTemplate = await MessageTemplateRepository.findFirst({
      where: { id },
      include: { message_category: true, campaign_target_groups: true },
    });

    if (!messageTemplate) {
      this.setStatus(404);
      throw new CustomError(OBError.NOTI_MESG_TEMPLATE_001);
    }

    this.setStatus(200);
    return { data: messageTemplateSerializer(messageTemplate) };
  }

  @Post('')
  @OperationId('message_templates.create')
  public async create(@Body() body: MessageTemplateCreateRequestBody): Promise<WrappedResponse<MessageTemplateData>> {
    const messageTemplateService = new MessageTemplateService();
    const messageTemplate = await messageTemplateService.create(body);
    this.setStatus(200);
    return { data: messageTemplateSerializer(messageTemplate) };
  }

  @Put('{id}')
  @OperationId('message_templates.update')
  public async update(
    id: string,
    @Body() body: MessageTemplateCreateRequestBody,
  ): Promise<WrappedResponse<MessageTemplateData>> {
    const messageTemplateService = new MessageTemplateService();
    const messageTemplate = await messageTemplateService.update(body, id);
    this.setStatus(200);
    return { data: messageTemplateSerializer(messageTemplate) };
  }

  @Delete('{id}')
  @OperationId('message_templates.delete')
  public async delete(id: string): Promise<WrappedResponse<boolean>> {
    const messageTemplateService = new MessageTemplateService();
    const result = await messageTemplateService.delete(id);
    this.setStatus(200);
    return { data: result };
  }
}
