import {hookstate, useHookstate} from '@hookstate/core';
import {accountState} from '../account/accountState';
import {isEmpty} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {headerAccessToken, setHeaderSDK} from '~/helpers/api';
import {hideLoading, showLoading} from '../loadingState';
import * as OB_IAM_SDK from 'ob-iam-sdk';
import residentialTenantAction from '../residentialTenant/residentialTenantAction';
import {resetPermissions} from '~/hooks/useAuthorization';
import { parkingAction } from '~/features/buildingAccess/store/parking';

interface AuthStateInterface {
  token: string | null;
  refreshToken: string | null;
  fcmToken: string | null;
  deviceId: string | null;
  deviceOS: string | null;
}

const authenState = hookstate<AuthStateInterface>({
  token: null,
  refreshToken: null,
  fcmToken: '',
  deviceId: '',
  deviceOS: '',
});

export const useAuthenState = () => useHookstate(authenState);

export const isLoggedIn = (): boolean => {
  const {token} = authenState.get();
  return !isEmpty(token);
};

export const authenStateAction = {
  logout: async (deleteAccount = false) => {
    showLoading();
    if (!deleteAccount) {
      await OB_IAM_SDK.client.authLogout('', headerAccessToken());
    }
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('refreshToken');
    await parkingAction.clear();
    accountState.profile.set(null);
    authenState.token.set(null);
    authenState.refreshToken.set(null);
    residentialTenantAction.clear();
    resetPermissions();
    setHeaderSDK();
    hideLoading();
  },
};

export default authenState;
