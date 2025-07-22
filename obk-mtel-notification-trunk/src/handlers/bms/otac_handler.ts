import logging from '../../libs/logging';
import { EventName } from '../../utils/kafka';
import BaseHandler from '../base_handler';
import { MessageService } from '../../services/message_service';
import { AutoMessagePayload, EmailTemplatePayload } from '../../services/interfaces/message_interface';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { map } from 'lodash';

dayjs.extend(utc);
dayjs.extend(timezone);

export default class otacRequestUpdated extends BaseHandler {
  public async otacRequestUpdated(event: { name: EventName; payload: any }): Promise<void> {
    logging.info(`${event.name} : handling otac event`);
    const messageService = new MessageService();

    const { tower, floor, ac_zone, from, to, created_at } = event.payload.data;
    const towerName = tower?.name;
    const floorName = floor?.name;
    const acZoneName = map(ac_zone, (ac_zone) => ac_zone.ac_zone.name).join(', ');

    const formattedFromTime = dayjs(from).tz('Asia/Bangkok').format('HH:mm');
    const formattedToTime = dayjs(to).tz('Asia/Bangkok').format('HH:mm');

    const timeRange = `${formattedFromTime} - ${formattedToTime}`;

    const formattedDate = dayjs(created_at).tz('Asia/Bangkok').format('DD/MM/YYYY');

    const autoMessagePayload: AutoMessagePayload = {
      account_id: event.payload.data.requester.account_id,
      valueMessage: {
        reference_id: event.payload.data.references,
        location: `${towerName}, ${floorName}, ${acZoneName}`,
        request_date: formattedDate,
        time: timeRange,
        status: event.payload.data.status,
      },
    };
    await messageService.autoMessageCreate({
      name: event.name,
      payload: autoMessagePayload,
    });
  }

  public async otacRequestCreated(event: { name: EventName; payload: any }): Promise<void> {
    logging.info(`${event.name} : otac has been created`);
    const messageService = new MessageService();

    const { tower, floor, ac_zone, from, to, created_at } = event.payload.data;
    const towerName = tower?.name;
    const floorName = floor?.name;
    const acZoneNames = ac_zone.map((zone: any) => zone.name).join(', ');

    const formattedFromTime = dayjs(from).tz('Asia/Bangkok').format('HH:mm');
    const formattedToTime = dayjs(to).tz('Asia/Bangkok').format('HH:mm');

    const timeRange = `${formattedFromTime} - ${formattedToTime}`;

    const formattedDate = dayjs(created_at).tz('Asia/Bangkok').format('DD/MM/YYYY');

    const emailTemplatePayload: EmailTemplatePayload = {
      account_id: event.payload.data.requester.account_id,
      valueMessage: {
        reference_id: event.payload.data.references,
        location: `${towerName}, ${floorName}, ${acZoneNames}`,
        request_date: formattedDate,
        time: timeRange,
        status: event.payload.data.status,
      },
    };
    await messageService.sendEmailTemplateToAdmin({
      name: event.name,
      payload: emailTemplatePayload,
    });
  }
}
