import logging from '../../libs/logging';
import { EventName } from '../../utils/kafka';
import BaseHandler from '../base_handler';
import { RecipientService } from '../../services/recipient_service';

export default class fcmTokenHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async update(event: { name: EventName; payload: any }): Promise<void> {
    logging.info('FCM Token update');
    const recipientService = new RecipientService();
    await recipientService.updateRecipientFCMToken(event.payload);
  }
}
