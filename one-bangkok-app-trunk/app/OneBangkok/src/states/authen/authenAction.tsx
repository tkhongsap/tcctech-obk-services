import authenState from './authenState';
import {showLoading, hideLoading} from '../loadingState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {schemas} from '../../utils/ob_sdk/services/ob_notification/index.interface';
import {isEmpty} from 'lodash';
import getFCMToken from '~/utils/fcmToken';
import * as OB_IAM_SDK from 'ob-iam-sdk';
import {apiEventEmitter, setHeaderSDK} from '~/helpers/api';

const authenAction = {
  refreshToken: async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    let token: string | null = null;

    if (refreshToken != null) {
      token = await authenAction.renewToken(refreshToken);
    }

    if (token != null) {
      authenState.token.set(token);
      setHeaderSDK(token);
    }
  },
  renewToken: async (refreshToken: string): Promise<string | null> => {
    try {
      showLoading();
      const response = await OB_IAM_SDK.client.authRenew({
        data: {refresh_token: refreshToken},
        headers: {
          'X-Refresh-Token': `Bearer ${refreshToken}`,
        },
      });

      const token = response.data?.data?.token?.value;
      if (token) {
        authenAction.storeToken(token);
        await AsyncStorage.setItem('token', token);
        return token;
      }
      hideLoading();
      authenState.token.set('');
      authenAction.storeToken('');
      authenAction.storeRefreshToken('');
      apiEventEmitter.emit('unauthorized', '');

      return null;
    } catch (error: any) {
      hideLoading();
      return null;
    }
  },
  storeToken: async (token: string) => {
    authenState.token.set(token);
    await AsyncStorage.setItem('token', token);
  },
  storeRefreshToken: async (refreshToken: string) => {
    AsyncStorage.setItem('refreshToken', refreshToken);
  },
  storeFcmToken: async () => {
    try {
      showLoading();
      let tokenType: schemas['CreateRecipientRequest']['token_type'];
      tokenType = 'fcm';

      let token = authenState.fcmToken.value!;
      if (isEmpty(token)) {
        token = (await getFCMToken()) || '';
      }

      hideLoading();
    } catch (error: any) {
      hideLoading();
    }
  },
  setDeviceId: async (deviceId: string) => {
    authenState.deviceId.set(deviceId);
  },
  setDeviceOS: async (deviceOS: string) => {
    authenState.deviceOS.set(deviceOS);
  },
};

export default authenAction;
