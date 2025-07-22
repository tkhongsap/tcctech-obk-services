import {logWrapper} from '~/utils/logWrapper';
import authenState from '~/states/authen/authenState';

import {headerAccessToken} from '~/helpers/api';
import * as OB_NOTI_SDK from 'ob-notification-sdk';
import {JsonValue, NotificationSettingData} from 'ob-notification-sdk/dist/api';

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

export interface NotificationGroupResult {
  name: string;
  display_name: JsonValue;
}

export interface NotificationSettingResult {
  id: string;
  recipient_id: string;
  notification_group_id: string;
  sms_enabled: boolean;
  email_enabled: boolean;
  in_app_enabled: boolean;
  push_enabled: boolean;
  notification_group: NotificationGroupResult;
}

export interface NotificationSetting {
  id: string;
  sms_enabled?: boolean;
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  push_enabled?: boolean;
}

class NotificationSettingService {
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
    return logWrapper(new NotificationSettingService());
  }

  async getSetting(groupId: string): Promise<ServiceBaseResult> {
    const result = await OB_NOTI_SDK.client.notificationSettingShow(
      '',
      groupId,
      headerAccessToken(),
    );

    return this._seriallizeResponse(result);
  }
  async getNotificationGroupSetting(): Promise<ServiceBaseResult> {
    const result = await OB_NOTI_SDK.client.notificationSettingIndex('');

    return this._seriallizeResponse(result);
  }

  async updateSetting(
    notificationSettingData: NotificationSettingData,
  ): Promise<ServiceBaseResult> {
    const result = await OB_NOTI_SDK.client.notificationSettingUpdate(
      '',
      '',
      notificationSettingData,
      headerAccessToken(),
    );

    return this._seriallizeResponse(result);
  }

  async activateOrDeactivateAll(isEnable: boolean): Promise<ServiceBaseResult> {
    const result =
      await OB_NOTI_SDK.client.notificationSettingActivateOrDeactivateAll(
        '',
        {isEnable: isEnable},
        headerAccessToken(),
      );

    return this._seriallizeResponse(result);
  }
}

const notificationSettingService = new NotificationSettingService();
export default notificationSettingService;
