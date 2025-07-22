import authenState from './authenState';
import {showLoading, hideLoading} from '../loadingState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {schemas} from '../../utils/ob_sdk/services/ob_notification/index.interface';
import {isEmpty} from 'lodash';
import getFCMToken from '~/utils/fcmToken';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';

const authenAction = {
  storeToken: async (token: string) => {
    authenState.token.set(token);
    AsyncStorage.setItem('token', token);
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
