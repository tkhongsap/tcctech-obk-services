import * as OB_BMS_SDK from 'ob-bms-sdk';
import { TenantData } from 'ob-bms-sdk/dist/api';

export default class BMSService {
  constructor(token?: string) {
    if (token) OB_BMS_SDK.setAcessToken(token);
    OB_BMS_SDK.setBaseUrl(process.env.OB_BMS_URL || 'http://localhost:3007');
  }

  public async getTenants(): Promise<TenantData[]> {
    const result = await OB_BMS_SDK.client.tenantsIndex();
    return result.data?.data as TenantData[];
  }
}
