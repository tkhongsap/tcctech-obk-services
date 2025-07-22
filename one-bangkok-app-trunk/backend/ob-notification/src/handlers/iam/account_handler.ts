import { EventName, logging } from 'ob-common-lib/dist';
import { RecipientService } from '../../services/recipient_service';
import BaseHandler from '../base_handler';
import { MessageService } from '../../services/message_service';

export default class accountHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async created(event: { name: string; payload: any }) {
    logging.info('Start create recipient data');
    const recipientService = new RecipientService();
    await recipientService.create(event.payload);
  }
  //trigger deploy
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async deleted(event: { name: EventName; payload: any }) {
    logging.info('Start send delete message');
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async password_reset(event: { name: EventName; payload: any }) {
    logging.info('Start send password reset message');
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async password_set(event: { name: EventName; payload: any }) {
    logging.info('Start send password set message');
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async reactivated(event: { name: EventName; payload: any }) {
    logging.info('Start send reactivate message');
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }
}
