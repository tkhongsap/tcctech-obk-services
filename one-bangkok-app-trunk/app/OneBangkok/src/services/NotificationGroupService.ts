import {logWrapper} from '~/utils/logWrapper';
import authenState from '~/states/authen/authenState';

import {headerAccessToken} from '~/helpers/api';
import * as OB_NOTI_SDK from 'ob-notification-sdk';

export type ServiceBaseData = {
  [key: string]: any;
};

export type ServiceBaseError = {
  statusCode: string;
};

export type ServiceBaseResult = {
  data: ServiceBaseData | undefined;
  error: ServiceBaseError | undefined;
};

export class NotificationGroupService {
  constructor() {}

  private _seriallizeResponse(result: any): ServiceBaseResult {
    let data, error;

    const resStatus = result.status;
    if (resStatus === 200) {
      data = result?.data.data;
    } else {
      error = {
        statusCode: resStatus.toString(),
        code: result?.error?.error?.code,
        message: result?.error?.error?.message,
      };
    }
    const serializedResponse = {data, error};

    return serializedResponse;
  }
  static create() {
    return logWrapper(new NotificationGroupService());
  }

  async findAll(): Promise<ServiceBaseResult> {
    const token = authenState.token.get();

    const response = await OB_NOTI_SDK.client.notificationGroupShow('','',headerAccessToken())
    return this._seriallizeResponse(response);
  }
}
