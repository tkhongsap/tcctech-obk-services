import { EventName, logging } from 'ob-common-lib/dist';
import BaseHandler from '../base_handler';
import { MessageService } from '../../services/message_service';
import { AutoMessagePayload } from '../../services/interfaces/message_interface';

export default class visitorHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async visitorVisited(event: { name: EventName; payload: any }) {
    logging.info(`${event.name} : send message start`);
    logging.info(`visitor passed`);
    const messageService = new MessageService();
    const autoMessagePayload: AutoMessagePayload = {
      account_id: event.payload.pass[0].issuer.account_id,
      valueMessage: {
        name: event.payload.pass[0].visitor_schedule.visitor.name,
      },
    };
    await messageService.autoMessageCreate({
      name: event.name,
      payload: autoMessagePayload,
    });
  }
}
