import logging from '../../libs/logging';
import { EventName } from '../../utils/kafka';
import BaseHandler from '../base_handler';
import { MessageService } from '../../services/message_service';
import { OtpReferencePayload } from '../../services/interfaces/message_interface';

export default class otpHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async otpReferenceCreated(event: { name: EventName; payload: any }): Promise<void> {
    logging.info(`${event.name} : send otp`);
    const messageService = new MessageService();

    const otpReferencePayload: OtpReferencePayload = {
      identifier: event.payload.identifier,
      valueMessage: {
        reference: event.payload.reference,
        code: event.payload.code,
      },
    };

    await messageService.sendOtpEmail({
      name: event.name,
      payload: otpReferencePayload,
    });
  }
}
