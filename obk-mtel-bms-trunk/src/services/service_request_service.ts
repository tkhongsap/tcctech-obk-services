import * as OB_IAM_SDK from 'ob-iam-sdk';
import logging from '../utils/logging';
import { ServiceRequestRepository } from '../repositories';

export default class ServiceRequestService {
  public async updateRequestName(serviceRequestId: string, accountId: string): Promise<null> {
    console.log('start call to ob-iam');
    const result = await OB_IAM_SDK.client.accountShow(accountId);
    if (!result) {
      logging.info('Cannot request ob-iam to get account info');
      return null;
    }
    const profile = result.data.data?.account?.profile;
    await ServiceRequestRepository.update({
      data: { created_by: `${profile?.first_name} ${profile?.last_name}` },
      where: { id: serviceRequestId },
    });
    return null;
  }
}
