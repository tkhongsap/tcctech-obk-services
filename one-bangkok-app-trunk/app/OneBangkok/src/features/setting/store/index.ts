import {hookstate, useHookstate} from '@hookstate/core';
import {get} from 'lodash';
import * as OB_IAM_SDK from 'ob-iam-sdk';
import {headerAccessToken} from '~/helpers/api';
import {SettingBody} from 'ob-iam-sdk/dist/api';

interface SettingStateDTO {
  twoFactorAuthenticationEnabled: boolean | undefined;
  passwordEnabled: boolean | undefined;
}

const DEFAULT_STATE = {
  twoFactorAuthenticationEnabled: false,
  passwordEnabled: false,
};

const settingState = hookstate<SettingStateDTO>(DEFAULT_STATE);

const useSettingState = () => useHookstate(settingState);

const transformResponse = (response: any) => {
  const setting = get(response, 'data.data.setting');
  return {
    twoFactorAuthenticationEnabled: setting?.two_factor_authentication_enabled,
    passwordEnabled: setting?.password_enabled,
  };
};

const settingStateAction = {
  load: async () => {
    try {
      const response = await OB_IAM_SDK.client.settingIndex(
        '',
        headerAccessToken(),
      );
      settingState.set(transformResponse(response));
    } catch (error) {
      return null;
    }
  },
  updateSetting: async (body: SettingBody) => {
    const response = await OB_IAM_SDK.client.settingUpdate(
      '',
      '',
      body,
      headerAccessToken(),
    );

    settingState.set(transformResponse(response));
  },
  toggle2FA: async (value: boolean) => {
    settingStateAction.updateSetting({
      two_factor_authentication_enabled: value,
    });
  },
  updatePasswordEnabled: async (value: boolean) => {
    settingState.passwordEnabled.set(value);
  },
};

export {settingState, settingStateAction, useSettingState};
