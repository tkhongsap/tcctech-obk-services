import { OperationId, Route, Get, Post, Body, Put, Delete, Queries } from 'tsoa';
import { BaseIndexQuery, WrappedResponse } from '../base_controller.interfaces';
import { map } from 'lodash';
import { Pagination } from '../base_controller';
import MessageCategoryRepository from '../../repositories/message_category_repository';
import { messageCategorySerializer } from './message_categories_controller.serializer';
import {
  MessageCategoriesCreateRequestBody,
  MessageCategoriesIndexResponseData,
  MessageCategoryData,
} from './index.interface';
import { CustomError } from '../../middlewares/error';
import { OBError } from '../../libs/error_spec';
import { MessageCategoryService } from '../../services/message_category_service';
import { Prisma } from '../../../db/client/';
import { QueriesController } from './index.interface';

@Route('message_categories')
export class MessageCategoriesController extends QueriesController {
  @Get('')
  @OperationId('message_categories.index')
  public async index(@Queries() query?: BaseIndexQuery): Promise<WrappedResponse<MessageCategoriesIndexResponseData>> {
    const _query = this.buildQuery<Prisma.message_categoryFindManyArgs>({ ...query });
    const messageCategories = await MessageCategoryRepository.findMany({
      ..._query,
      include: { _count: { select: { message_template: true } } },
    });
    const totalData = await MessageCategoryRepository.count({ where: _query.where });
    const pagination = this.paginationBuilder(
      totalData,
      query?.page_size || this.DEFAULT_PAGE_SIZE,
      query?.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;

    const serailizedMessageCategories = map(messageCategories, (campaign) => {
      return messageCategorySerializer(campaign);
    });

    this.setStatus(200);
    return { data: serailizedMessageCategories, pagination };
  }

  @Get('{id}')
  @OperationId('message_categories.show')
  public async show(id: string): Promise<WrappedResponse<MessageCategoryData>> {
    const messageCategory = await MessageCategoryRepository.findFirst({ where: { id } });

    if (!messageCategory) {
      this.setStatus(404);
      throw new CustomError(OBError.NOTI_CATETORY_001);
    }

    this.setStatus(200);
    return { data: messageCategorySerializer(messageCategory) };
  }

  @Post('')
  @OperationId('message_categories.create')
  public async create(@Body() body: MessageCategoriesCreateRequestBody): Promise<WrappedResponse<MessageCategoryData>> {
    const messageCategoryService = new MessageCategoryService();
    const messageCategory = await messageCategoryService.create(body);
    this.setStatus(200);
    return { data: messageCategorySerializer(messageCategory) };
  }

  @Put('{id}')
  @OperationId('message_categories.update')
  public async update(
    id: string,
    @Body() body: MessageCategoriesCreateRequestBody,
  ): Promise<WrappedResponse<MessageCategoryData>> {
    const messageCategoryService = new MessageCategoryService();
    const messageCategory = await messageCategoryService.update(body, id);
    this.setStatus(200);
    return { data: messageCategorySerializer(messageCategory) };
  }

  @Delete('{id}')
  @OperationId('message_categories.delete')
  public async delete(id: string): Promise<WrappedResponse<boolean>> {
    const messageCategoryService = new MessageCategoryService();
    const result = await messageCategoryService.delete(id);
    this.setStatus(200);
    return { data: result };
  }
}
