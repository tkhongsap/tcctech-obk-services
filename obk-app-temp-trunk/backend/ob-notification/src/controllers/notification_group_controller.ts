import { logging } from 'ob-common-lib/dist';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { NotificationGroupService } from '../services/notification_group_service';
import BaseController from './base_controller';
import { schemas } from '../openapi/interfaces/schemas';
import { get } from 'lodash';

export default class NotificationGroupController extends BaseController {
  public async findAll(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['FindAllNotificationGroupResponse']>,
  ) {
    logging.info('start call finding notification group');

    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();

    const notificationGroupService = new NotificationGroupService();

    const notificationGroup = await notificationGroupService.findAll(accountId);

    res.json(notificationGroup);
  }
}
