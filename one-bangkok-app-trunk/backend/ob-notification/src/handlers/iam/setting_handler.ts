import { EventName, logging } from 'ob-common-lib/dist';
import BaseHandler from '../base_handler';
import { MessageService } from '../../services/message_service';

export default class settingHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async set2fa(event: { name: EventName; payload: any }) {
    logging.info(`${event.name} : send message`);
    const messageService = new MessageService();
    await messageService.autoMessageCreate({
      name: event.name,
      payload: event.payload,
    });
  }
}
