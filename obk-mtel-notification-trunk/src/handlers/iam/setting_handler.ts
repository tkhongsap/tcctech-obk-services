import logging from '../../libs/logging';
import { EventName } from '../../utils/kafka';
import BaseHandler from '../base_handler';
import { MessageService } from '../../services/message_service';
import { RecipientService } from '../../services/recipient_service';
export default class settingHandler extends BaseHandler {
  public async set2fa(event: { name: EventName; payload: any }): Promise<void> {
    logging.info(`${event.name} : send message`);
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }

  public async updated(event: { name: string; payload: any }): Promise<void> {
    logging.info('Recipient data setting updated');
    const recipientService = new RecipientService();
    await recipientService.updateRecipientSetting(event.payload);
  }
}
