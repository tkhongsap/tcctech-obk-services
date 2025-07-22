import logging from '../../libs/logging';
import { EventName } from '../../utils/kafka';
import { RecipientService } from '../../services/recipient_service';
import BaseHandler from '../base_handler';
import { MessageService } from '../../services/message_service';
export default class accountHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async created(event: { name: string; payload: any }): Promise<void> {
    try {
      const recipientService = new RecipientService();
      await recipientService.create(event.payload);
    } catch (error) {
      console.error('Error in created function:', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async deleted(event: { name: EventName; payload: any }): Promise<void> {
    logging.info('Start send delete message');
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async password_reset(event: { name: EventName; payload: any }): Promise<void> {
    logging.info('Start send password reset message');
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async password_set(event: { name: EventName; payload: any }): Promise<void> {
    logging.info('Start send password set message');
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async reactivated(event: { name: EventName; payload: any }): Promise<void> {
    logging.info('Start send reactivate message');
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }
}
