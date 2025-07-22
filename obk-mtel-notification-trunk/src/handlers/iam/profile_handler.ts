import logging from '../../libs/logging';
import { RecipientService } from '../../services/recipient_service';
import BaseHandler from '../base_handler';

export default class profileHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async updated(event: { name: string; payload: any }): Promise<void> {
    logging.info('Profile updated');
    const recipientService = new RecipientService();
    await recipientService.updateRecipientProfile(event.payload);
  }
}
