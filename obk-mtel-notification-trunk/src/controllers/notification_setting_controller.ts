import { Controller, Get, OperationId, Route, Header, Query, Put, Body, Path } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { NotificationSettingService } from '../services/notification_setting_service';
import { notification_settingsSerealizer } from './notification_setting_controller.serializer';
import { NotificationSettingData } from '../services/interfaces/notification_setting_interface';
import {
  NotificationSettingResult,
  NotificationSettingUpdateActivateOrDeactivate,
  NotificationSettingUpdateDeactivatedResponse,
  NotificationSettingUpdateResult,
} from './notification_setting_controller.interfaces';
@Route('notification_setting')
export class NotificationSettingController extends Controller {
  @Get('{notification_group_id}')
  @OperationId('notification_setting.show')
  public async show(
    @Header('x-account-id') accountId: string,
    @Path() notification_group_id: string,
  ): Promise<WrappedResponse<NotificationSettingResult[]>> {
    const notificationSettingService = new NotificationSettingService();

    const settings = await notificationSettingService.findAll(accountId, notification_group_id);

    this.setStatus(200);
    return { data: notification_settingsSerealizer(settings) };
  }
  @Get('')
  @OperationId('notification_setting.index')
  public async index(@Header('x-account-id') accountId: string): Promise<WrappedResponse<NotificationSettingResult[]>> {
    const notificationSettingService = new NotificationSettingService();

    const settings = await notificationSettingService.findAll(accountId);

    this.setStatus(200);
    return { data: notification_settingsSerealizer(settings) };
  }
  @OperationId('notification_setting.update')
  @Put('')
  public async update(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Body() body: NotificationSettingData,
  ): Promise<WrappedResponse<NotificationSettingUpdateResult>> {
    const notificationSettingService = new NotificationSettingService();

    const updatedSetting = await notificationSettingService.update(
      {
        id: body.id,
        sms_enabled: body.sms_enabled,
        email_enabled: body.email_enabled,
        in_app_enabled: body.in_app_enabled,
        push_enabled: body.push_enabled,
      },
      accountId,
    );

    this.setStatus(200);
    return { data: { result: updatedSetting as boolean } };
  }

  @OperationId('notification_setting.activateOrDeactivateAll')
  @Put('activateordeactivate')
  public async activateOrDeactivateAll(
    @Header('x-account-id') accountId: string,
    @Body() body: NotificationSettingUpdateActivateOrDeactivate,
  ): Promise<WrappedResponse<NotificationSettingUpdateDeactivatedResponse>> {
    const notificationSettingService = new NotificationSettingService();

    const activateOrDeactivateAll = await notificationSettingService.activateOrDeactivate(accountId, body.isEnable);

    this.setStatus(200);
    return { data: { result: activateOrDeactivateAll } };
  }
}
