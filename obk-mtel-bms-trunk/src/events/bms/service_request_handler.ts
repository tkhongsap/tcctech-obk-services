import { get, isEmpty } from 'lodash';
import ServiceRequestService from '../../services/service_request_service';
import logging from '../../utils/logging';
import BaseHandler from '../base_handler';

export default class serviceRequestHandler extends BaseHandler {
  public async create(event: { name: string; payload: any }) {
    logging.info('Start consume event service reqeust created');

    const serviceRequestService = new ServiceRequestService();
    const accountId = get(event.payload, ['data', 'requester', 'account_id'], '');
    const setviceRequestId = get(event.payload, ['data', 'id'], '');
    if (!isEmpty(accountId)) {
      console.log('start update request name');
      await serviceRequestService.updateRequestName(setviceRequestId, accountId);
    } else {
      logging.info('cannot find account id');
    }
  }
}
