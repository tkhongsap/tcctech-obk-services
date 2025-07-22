import * as OB_IAM_SDK from 'ob-iam-sdk';

import { AccountDataResponse } from './index.interface';
import { ProfileData } from 'ob-iam-sdk/dist/api';

export default class AccountDataService {
  constructor(token?: string) {
    if (token) OB_IAM_SDK.setAcessToken(token);
    OB_IAM_SDK.setBaseUrl(process.env.OB_IAM_SDK_BASE_URL || 'http://localhost:3000');
  }

  public async getAccountData(accountId: string): Promise<AccountDataResponse> {
    const result = await OB_IAM_SDK.client.accountShow(accountId);
    return result.data?.data as AccountDataResponse;
  }

  public async getProfile(accountId: string): Promise<ProfileData | null> {
    try {
      const result = (await OB_IAM_SDK.client.profileIndex('', accountId)) as any; //iam type interface reponse wrong
      return result.data?.data?.profile as ProfileData;
    } catch (err) {
      return null;
    }
  }

  public async GetAccountDataName(accountId: string): Promise<string | null> {
    try {
      const result = await OB_IAM_SDK.client.accountShow(accountId);
      const firstName = result.data?.data?.account?.profile?.first_name;
      const middleName = result.data?.data?.account?.profile?.middle_name
        ? ` ${result.data?.data?.account?.profile?.middle_name}`
        : '';
      const lastName = result.data?.data?.account?.profile?.last_name
        ? ` ${result.data?.data?.account?.profile?.last_name}`
        : '';
      return `${firstName}${middleName}${lastName}` || '';
    } catch (err) {
      return null;
    }
  }
}
