import { Controller, Get, OperationId, Route, Header, Queries, Post, Body, Put, Path, Delete } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import {
  MessageCategoryResult,
  MessageCountQuery,
  MessageCategoryBody,
  MessageCategoryUpdateBody,
  MessageCategoryCountResult,
} from './message_category_controller.interfaces';
import { MessageCategoryService } from '../services/message_category_service';
import { MessageCategorysSerializer, MessageCategorySerializer } from './message_category_controller.serializer';

@Route('message_category')
export class MessageCategoryController extends Controller {
  @Get('')
  @OperationId('message_category.show')
  public async show(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Header('accept-language') acceptLanguage: string,
  ): Promise<WrappedResponse<MessageCategoryResult>> {
    const messageCategoryService = new MessageCategoryService();
    const result = await messageCategoryService.findAll({
      sequence: 'asc',
    });
    this.setStatus(200);

    return result !== null ? { data: MessageCategorysSerializer(result, acceptLanguage) } : { data: null };
  }

  @Post('')
  @OperationId('message_category.create')
  public async create(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Body() body: MessageCategoryBody,
  ): Promise<WrappedResponse<MessageCategoryResult>> {
    try {
      const messageCategoryService = new MessageCategoryService();
      const result = await messageCategoryService.create(body);

      this.setStatus(200);
      return { data: MessageCategorySerializer(result) };
    } catch (error) {
      return { data: null };
    }
  }

  @Put('{id}')
  @OperationId('message_category.update')
  public async update(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Body() body: MessageCategoryUpdateBody,
    @Path() id: string,
  ): Promise<WrappedResponse<MessageCategoryResult>> {
    try {
      const messageCategoryService = new MessageCategoryService();
      const result = await messageCategoryService.update(body, id);

      this.setStatus(200);
      return { data: MessageCategorySerializer(result) };
    } catch (error) {
      return { data: null };
    }
  }

  @Delete('{id}')
  @OperationId('message_category.destroy')
  public async destroy(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Path() id: string,
  ): Promise<WrappedResponse<boolean>> {
    try {
      const messageCategoryService = new MessageCategoryService();
      const result = await messageCategoryService.delete(id);

      this.setStatus(200);
      return { data: result };
    } catch (error) {
      return { data: false };
    }
  }
}

@Route('me/category/message/count')
export class MessageCategoryCountController extends Controller {
  @Get('')
  @OperationId('message_category.count')
  public async count(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Queries() query: MessageCountQuery,
  ): Promise<WrappedResponse<MessageCategoryCountResult[]>> {
    try {
      const { category, read } = query;

      const messageCategoryService = new MessageCategoryService();
      const response = await messageCategoryService.countMessage(accountId, category, read);

      this.setStatus(200);

      return { data: response };
    } catch (error) {
      this.setStatus(400);
      return { data: null };
    }
  }
}
