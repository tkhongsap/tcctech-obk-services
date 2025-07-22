import * as OB_IAM_SDK from 'ob-iam-sdk';
import logging from '../utils/logging';

export default class IamService {
  constructor(token?: string) {
    if (token) OB_IAM_SDK.setAcessToken(token);
    OB_IAM_SDK.setBaseUrl(process.env.OB_IAM_SDK_BASE_URL || 'http://localhost:3000');
  }

  public async GetAccountDataName(accountId: string): Promise<string> {
    const result = await OB_IAM_SDK.client.accountShow(accountId);
    logging.info('GetAccountDataName', result.data?.data);
    const firstName = result.data?.data?.account?.profile?.first_name;
    const middleName = result.data?.data?.account?.profile?.middle_name
      ? ` ${result.data?.data?.account?.profile?.middle_name}`
      : '';
    const lastName = result.data?.data?.account?.profile?.last_name
      ? ` ${result.data?.data?.account?.profile?.last_name}`
      : '';
    return `${firstName}${middleName}${lastName}` || '';
  }
}
