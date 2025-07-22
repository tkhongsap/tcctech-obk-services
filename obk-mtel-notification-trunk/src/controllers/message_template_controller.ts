import { Controller, Post, OperationId, Route, Header, Body, Delete, Get, Path, Put, Queries } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import {
  CreateMessageTemplatResult,
  TemplatDataBody,
  MessageTemplateQuery,
  MessageTemplateResult,
  MessageTemplateUpdateDataBody,
} from './message_template_controller.interfaces';
import { MessageTemplateData } from '../services/interfaces/message_template_interface';
import { MessageService } from '../services/message_service';
import MessageTemplateRepository from '../repositories/message_template_repository';
import { messageTemplatesSerializer, messageTemplateSerializer } from './message_template_controller.serializer';
@Route('message_template')
export class MessageTemplateController extends Controller {
  @Post('')
  @OperationId('message_template.create')
  public async create(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Body() body: TemplatDataBody,
  ): Promise<WrappedResponse<CreateMessageTemplatResult>> {
    try {
      const { template } = body;

      const payloadMessageTemplate: MessageTemplateData = {
        name: template.name,
        title: template.title,
        subTitle: template.sub_title,
        messageTypeId: template.message_category_id,
        thumbnail: template?.thumbnail,
        deeplink: template?.deeplink,
        data: template.data,
      };

      const messageService = new MessageService();
      await messageService.createTemplate(payloadMessageTemplate);
      this.setStatus(200);
      return { data: { result: true } };
    } catch (error) {
      this.setStatus(400);
      return { data: null };
    }
  }

  @Get('')
  @OperationId('message_template.show')
  public async show(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Queries() query: MessageTemplateQuery,
  ): Promise<WrappedResponse<MessageTemplateResult>> {
    try {
      const MessageTemplateData = await MessageTemplateRepository.findMany({ where: query });

      this.setStatus(200);
      return { data: messageTemplatesSerializer(MessageTemplateData) };
    } catch (error) {
      this.setStatus(400);
      return { data: null };
    }
  }

  @Delete('{id}')
  @OperationId('message_template.destroy')
  public async destroy(@Path() id: string): Promise<WrappedResponse<boolean>> {
    try {
      await MessageTemplateRepository.delete({
        where: {
          id,
        },
      });

      this.setStatus(200);
      return { data: true };
    } catch (error) {
      this.setStatus(400);
      return { data: null };
    }
  }

  @Put('{id}')
  @OperationId('message_template.update')
  public async update(
    @Path() id: string,
    @Body() body: MessageTemplateUpdateDataBody,
  ): Promise<WrappedResponse<MessageTemplateResult>> {
    try {
      const MessageTemplateData = await MessageTemplateRepository.update({
        where: {
          id,
        },
        data: body,
      });

      this.setStatus(200);
      return { data: messageTemplateSerializer(MessageTemplateData) };
    } catch (error) {
      this.setStatus(400);
      return { data: null };
    }
  }
}
