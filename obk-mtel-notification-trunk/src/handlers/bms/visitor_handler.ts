import logging from '../../libs/logging';
import { EventName } from '../../utils/kafka';
import BaseHandler from '../base_handler';
import { MessageService } from '../../services/message_service';
import {
  AutoMessagePayload,
  ResidentVisitorPassEmailPayload,
  ResidentVisitorPassPayload,
  VisitorPassPayload,
} from '../../services/interfaces/message_interface';

export default class visitorHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async visitorVisited(event: { name: EventName; payload: any }): Promise<void> {
    logging.info(`${event.name} : send message`);
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

  public async visitorPassCreated(event: { name: EventName; payload: any }): Promise<void> {
    logging.info(`${event.name} : sending link for visitor pass`);
    const messageService = new MessageService();
    const visitorPassPayload: VisitorPassPayload = {
      account_id: event.payload.account_id,
      visitor_email: event.payload.visitor_email,
      valueMessage: {
        invitation_link: event.payload.invitation_link,
        tower_name: event.payload.tower_name,
      },
    };
    await messageService.sendEmailToVisitor({
      name: event.name,
      payload: visitorPassPayload,
    });
  }

  public async residentVisitorPassCreated(event: { name: EventName; payload: any }): Promise<void> {
    logging.info(`${event.name} : sending link for visitor resident pass`);
    const messageService = new MessageService();
    const visitorPassPayload: ResidentVisitorPassPayload = {
      account_id: event.payload.account_id,
      visitor_email: event.payload.visitor_email,
      valueMessage: {
        invitation_link: event.payload.invitation_link,
        tower_name: event.payload.tower_name,
      },
      invite_name: event.payload.invite_name,
      invite_house_number: event.payload.invite_house_number,
      project_id: event.payload.project_id,
    };
    await messageService.sendEmailToResidentVisitor({
      name: event.name,
      payload: visitorPassPayload,
    });
  }
}
