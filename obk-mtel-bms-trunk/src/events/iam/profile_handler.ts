import { get, isEmpty, isNull } from 'lodash';
import { ACRequestRepository, MemberRepository, ServiceRequestRepository } from '../../repositories';
import logging from '../../utils/logging';
import BaseHandler from '../base_handler';
// import ExternalIdentityService from '../../services/external_identity_service';

export default class profileHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async update(event: { name: string; payload: any }) {
    logging.info('Start consume profile update');

    const accountId = get(event, ['payload', 'account_id'], '');

    if (isEmpty(accountId)) {
      logging.info('Cannot find account id');
      return;
    }

    const member = await MemberRepository.findFirst({ where: { account_id: accountId } });

    if (isNull(member)) {
      logging.info('Cannot find member');
    }
    await ACRequestRepository.updateMany({
      data: { created_by: `${event.payload.first_name} ${event.payload.last_name}` },
      where: { requester_id: member?.id },
    });
    await ServiceRequestRepository.updateMany({
      data: { created_by: `${event.payload.first_name} ${event.payload.last_name}` },
      where: { requester_id: member?.id },
    });

    logging.info('Update created by success');
  }
}
