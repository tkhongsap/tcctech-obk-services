import { Controller, Get, OperationId, Route, Header } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { NotificationGroupGetResult } from './notification_group_controller.interfaces';
import { NotificationGroupService } from '../services/notification_group_service';
import { notification_groupsSerializer } from './notification_group_controller.serializer';
@Route('notification_group')
export class NotificationGroupController extends Controller {
  @Get('')
  @OperationId('notification_group.show')
  public async show(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
  ): Promise<WrappedResponse<NotificationGroupGetResult>> {
    try {
      const notificationGroupService = new NotificationGroupService();

      const notificationGroup = await notificationGroupService.findAll(accountId);
      this.setStatus(200);

      return { data: notification_groupsSerializer(notificationGroup) };
    } catch (error) {
      this.setStatus(400);
      return { data: null };
    }
  }
}
