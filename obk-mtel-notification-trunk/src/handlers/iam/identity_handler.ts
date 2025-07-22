/* eslint-disable @typescript-eslint/no-explicit-any */
import logging from '../../libs/logging';
import { EventName } from '../../utils/kafka';
import BaseHandler from '../base_handler';
import { RecipientService } from '../../services/recipient_service';
import { MessageService } from '../../services/message_service';

export default class identityHandler extends BaseHandler {
  public async addIdentity(event: { name: EventName; payload: any }): Promise<void> {
    logging.info('add new identity');
    const recipientService = new RecipientService();
    await recipientService.addRecipientIdentity(event.payload);
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }

  public async updateIdentity(event: { name: EventName; payload: any }): Promise<void> {
    try {
      logging.info('Update default identity');
      const recipientService = new RecipientService();
      await recipientService.updateDefaultIdentity(event.payload);
      const messageService = new MessageService();
      await messageService.autoMessageCreate({
        name: event.name,
        payload: event.payload,
      });
    } catch (error) {
      console.error('Error in created function:', error);
    }
  }

  public async deleteIdentity(event: { name: EventName; payload: any }): Promise<void> {
    try {
      logging.info('delete identity');
      const recipientService = new RecipientService();
      await recipientService.deleteIdentity(event.payload);
    } catch (error) {
      console.error('Error in handler function delete identity:', error);
    }
  }
}
