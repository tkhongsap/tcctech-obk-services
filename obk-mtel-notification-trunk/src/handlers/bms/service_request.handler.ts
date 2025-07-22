import logging from '../../libs/logging';
import { EventName } from '../../utils/kafka';
import BaseHandler from '../base_handler';
import { MessageService } from '../../services/message_service';
import { AutoMessagePayload, EmailTemplatePayload } from '../../services/interfaces/message_interface';

export default class serviceRequestHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  public async serviceRequestUpdated(event: { name: EventName; payload: any }): Promise<void> {
    logging.info(`${event.name} : service request update`);
    const messageService = new MessageService();
    const autoMessagePayload: AutoMessagePayload = {
      account_id: event.payload.data.requester.account_id,
      valueMessage: {
        issue_type: event.payload.data.issue_type.display_name,
        title: event.payload.data.title,
        reference_id: event.payload.data.references,
        status: event.payload.data.status,
      },
    };
    await messageService.autoMessageCreate({
      name: event.name,
      payload: autoMessagePayload,
    });
  }

  public async serviceRequestCreated(event: { name: EventName; payload: any }): Promise<void> {
    logging.info(`${event.name} : service has been created`);
    const messageService = new MessageService();
    const emailTemplatePayload: EmailTemplatePayload = {
      account_id: event.payload.data.requester.account_id,
      valueMessage: {
        issue_type: event.payload.data.issue_type?.display_name,
        title: event.payload.data.title,
        reference_id: event.payload.data.references,
        status: event.payload.data.status,
      },
    };
    await messageService.sendEmailTemplateToAdmin({
      name: event.name,
      payload: emailTemplatePayload,
    });
  }
}
