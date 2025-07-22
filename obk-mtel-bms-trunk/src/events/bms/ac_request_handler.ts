import { get, isEmpty } from 'lodash';
import logging from '../../utils/logging';
import BaseHandler from '../base_handler';
import AcRequestService from '../../services/ac_request_service';

export default class acRequestHandler extends BaseHandler {
  public async create(event: { name: string; payload: any }) {
    logging.info('Start consume event ac reqeust created');
    const acRequestService = new AcRequestService();
    const accountId = get(event.payload, ['data', 'requester', 'account_id'], '');
    const acRequestId = get(event.payload, ['data', 'id'], '');
    if (!isEmpty(accountId)) {
      await acRequestService.updateRequestName(acRequestId, accountId);
    } else {
      logging.info('cannot find account id');
    }
  }
}
