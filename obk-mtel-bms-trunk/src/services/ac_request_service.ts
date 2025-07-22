import * as OB_IAM_SDK from 'ob-iam-sdk';
import logging from '../utils/logging';
import { ACRequestRepository } from '../repositories';

export default class AcRequestService {
  public async updateRequestName(acRequestId: string, accountId: string): Promise<null> {
    const result = await OB_IAM_SDK.client.accountShow(accountId);
    if (!result) {
      logging.info('Cannot request ob-iam to get account info');
      return null;
    }
    const profile = result.data.data?.account?.profile;
    await ACRequestRepository.update({
      data: { created_by: `${profile?.first_name} ${profile?.last_name}` },
      where: { id: acRequestId },
    });
    return null;
  }
}
