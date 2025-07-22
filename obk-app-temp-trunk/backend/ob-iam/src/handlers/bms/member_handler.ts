import { logging } from 'ob-common-lib/dist';
import BaseHandler from '../base_handler';
import ExternalIdentityService from '../../services/external_identity_service';

export default class memberHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async created(event: { name: string; payload: any }) {
    logging.info('Start consume member created');
    const externalIdentityService = new ExternalIdentityService();
    await externalIdentityService.sync(event.payload.member);
  }
}
