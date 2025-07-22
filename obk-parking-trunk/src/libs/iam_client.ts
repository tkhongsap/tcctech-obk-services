import { AxiosResponse } from 'axios';
import * as OB_IAM_SDK from 'ob-iam-sdk';
import { WrappedResponseAccountDataResponse } from 'ob-iam-sdk/dist/api';

class IAMClientService {
  constructor() {
    OB_IAM_SDK.setBaseUrl(process.env['OB_IAM_URL'] ?? 'http://localhost:3001');
  }

  public async accountShow(
    accountId: string
  ): Promise<WrappedResponseAccountDataResponse> {
    const result = await OB_IAM_SDK.client.accountShow(accountId);
    return result.data;
  }

  public async health(): Promise<AxiosResponse<any>> {
    // TODO: change to return await OB_IAM_SDK.client.health();
    return await OB_IAM_SDK.axiosInstance.get('/');
  }
}

const IAMClient = new IAMClientService();

export default IAMClient;
