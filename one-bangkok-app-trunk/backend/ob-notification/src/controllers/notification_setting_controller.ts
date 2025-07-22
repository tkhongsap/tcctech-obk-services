import { get } from 'lodash';
import { NotificationSettingService } from '../services/notification_setting_service';
import BaseController from './base_controller';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas } from '../openapi/interfaces/schemas';
import { logging } from 'ob-common-lib/dist';

export default class NotificationSettingController extends BaseController {
  public async findAll(
    req: TypedRequest<['']>,
    res: TypedResponse<schemas['FindAllNotificationSettingResponse']>,
  ) {
    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();

    const query = get(req, 'query');
    const notification_group_id = get(query, 'notification_group_id') as string;

    const notificationSettingService = new NotificationSettingService();

    const settings = await notificationSettingService.findAll(
      notification_group_id,
      accountId,
    );
    res.json(settings);
  }

  // function update
  public async update(
    req: TypedRequest<schemas['UpdateNotificationSettingRequest']>,
    res: TypedResponse<schemas['UpdateNotificationSettingResponse']>,
  ) {
    // -- call notif setting service to update notif setting by:
    //notif setting id, ac id, update value(true/false), setting type(sms, email, inapp

    const notificationSettingService = new NotificationSettingService();

    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();
    const body = get(req, 'body');

    const updatedSetting = await notificationSettingService.update(
      {
        id: body.id,
        sms_enable: body.sms_enabled,
        email_enabled: body.email_enabled,
        in_app_enabled: body.in_app_enabled,
        push_enabled: body.push_enabled,
      },
      accountId,
    );
    res.json({
      data: {
        result: updatedSetting as boolean,
      },
    });
  }
  public async deactivateAll(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['DeactivateAllNotificationSettingResponse']>,
  ) {
    logging.info('start deactivating all notification settings');
    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();

    const notificationSettingService = new NotificationSettingService();
    const deactivated = await notificationSettingService.deactivate(accountId);

    res.json({
      data: {
        result: deactivated as boolean,
      },
    });
  }
}
