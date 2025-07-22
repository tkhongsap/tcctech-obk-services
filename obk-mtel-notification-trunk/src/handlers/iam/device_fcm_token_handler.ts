import logging from '../../libs/logging';
import { EventName } from '../../utils/kafka';
import BaseHandler from '../base_handler';
import { RecipientService } from '../../services/recipient_service';
import { MessageService } from '../../services/message_service';

export default class deviceAndFCMTokenHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async update(event: { name: EventName; payload: any }): Promise<void> {
    logging.info('DeviceId and FCM Token update');
    const recipientService = new RecipientService();
    await recipientService.updateRecipientDeviceAndFCMToken(event.payload);
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: 'ob-iam.device.added',
      payload: {
        account_id: event.payload.account_id,
      },
    });
  }
}
