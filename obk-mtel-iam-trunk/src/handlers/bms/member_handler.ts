import BlacklistService from '../../services/blacklist_service';
import ExternalIdentityService from '../../services/external_identity_service';
import logging from '../../utils/logging';
import BaseHandler from '../base_handler';
// import ExternalIdentityService from '../../services/external_identity_service';

export default class memberHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async created(event: { name: string; payload: any }) {
    logging.info('Start consume member created');
    const externalIdentityService = new ExternalIdentityService();
    await externalIdentityService.sync(event.payload.member);
  }
  public async createdResident(event: { name: string; payload: any }) {
    logging.info('Start consume member resident created');
    const externalIdentityService = new ExternalIdentityService();
    await externalIdentityService.syncResident(event.payload.member);
  }
  public async deleted(event: { name: string; payload: any }) {
    logging.info('Start consume member deleted');
    const blacklistService = new BlacklistService();
    await blacklistService.create(event.payload);
  }
}
