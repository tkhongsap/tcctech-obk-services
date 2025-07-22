import { EventName, logging } from 'ob-common-lib/dist';
import BaseHandler from '../base_handler';
import { MessageService } from '../../services/message_service';
import { RecipientService } from '../../services/recipient_service';

export default class deviceHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async added(event: { name: EventName; payload: any }) {
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
