import * as OB_BMS_SDK from 'ob-bms-sdk';
import {
  MembersShowResponse,
  WrappedResponseParkingTicketData,
} from 'ob-bms-sdk/dist/api';
import { WrappedResponse } from '../controllers/base_controller.interfaces';

class BMSClientService {
  constructor() {
    OB_BMS_SDK.setBaseUrl(process.env['OB_BMS_URL'] ?? 'http://localhost:3001');
  }

  public async parkingTicketsRedeem(
    logId: string,
    rate_code: string,
    redeemer_id: string,
    remark: string
  ): Promise<WrappedResponseParkingTicketData> {
    const result = await OB_BMS_SDK.client.parkingTicketsRedeem(logId, {
      rate_code,
      redeemer_id,
      remark,
    });
    return result.data;
  }

  public async membersShow(
    id: string
  ): Promise<WrappedResponse<MembersShowResponse>> {
    const result = await OB_BMS_SDK.client.membersShow(id);
    return result.data;
  }

  public async health(): Promise<any> {
    return await OB_BMS_SDK.client.health()
  }
}

const BMSClient = new BMSClientService();

export default BMSClient;
