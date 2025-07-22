import { Body, OperationId, Post, Route } from 'tsoa';
import { BaseController } from './base_controller';
import { WrappedResponse } from './base_controller.interfaces';
import { MessageService } from '../services/message_service';
import { NotificationBooleanResponse, NotificationSendBody } from './notifications_controller.inteface';

@Route('notifications')
export class NotificationsController extends BaseController {
  @Post('/send')
  @OperationId('notifications.send')
  public async send(@Body() body: NotificationSendBody): Promise<WrappedResponse<NotificationBooleanResponse>> {
    const messageService = new MessageService();
    const result = await messageService.sendNotification(body);
    return { data: { result } };
  }
}
