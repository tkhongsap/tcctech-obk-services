import { EventName } from '../../utils/kafka';
import logging from '../../libs/logging';
import BaseHandler from '../base_handler';
import { RecipientService } from '../../services/recipient_service';
import { MessageService } from '../../services/message_service';

export default class deviceHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async added(event: { name: EventName; payload: any }): Promise<void> {
    logging.info('Add new device');
    const recipientService = new RecipientService();
    await recipientService.updateRecipientDevice(event.payload.device);
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: {
        account_id: event.payload.device.account_id,
      },
    });
  }
}
