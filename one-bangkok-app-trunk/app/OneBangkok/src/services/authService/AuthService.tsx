import {hideLoading, showLoading} from '~/states/loadingState';
import {assign, isEmpty} from 'lodash';
import hash, {HashingType} from '~/utils/encrypt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authenState from '~/states/authen/authenState';
import {SSOProviderType} from '~/constants/AuthsConstant';
import {Identity} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import * as OB_IAM_SDK from 'ob-iam-sdk';
import {obIamClient} from '~/helpers/api';
import {assignPermissions} from '~/hooks/useAuthorization';
import {ExternalIdentity} from '~/states/residentialTenant/residentialTenantState';

export interface LoginAuthRequest extends Identity {
  password?: string;
  id?: string;
  reference?: string;
  type?: SSOProviderType | null;
}

class AuthService {
  public login = async (loginAuthRequest: LoginAuthRequest) => {
    showLoading();
    const body = this.prepareAuthPayload(loginAuthRequest);
    const res = await OB_IAM_SDK.client.authLogin({
      data: body,
    });

    hideLoading();
    if (res.status === 200) {
      AsyncStorage.setItem(
        'identity',
        JSON.stringify({
          identifier: body.identity.identifier,
          provider:
            body.identity.provider === 'phone'
              ? body.identity.provider
              : 'email',
          country_code: body.identity.country_code
            ? body.identity.country_code
            : '',
        }),
      );
      assignPermissions();
      return res.data!.data;
    } else {
      return res.data;
    }
  };
  public reactivate = async (loginAuthRequest: LoginAuthRequest) => {
    showLoading();
    const body = this.prepareAuthPayload(loginAuthRequest);
    const res = await OB_IAM_SDK.client.authReactivate({data: body});
    hideLoading();
    if (res.status !== 200) {
      return null;
    }
    return res.data!.data;
  };

  private prepareAuthPayload = (loginAuthRequest: LoginAuthRequest) => {
    let hashPassword = '';
    const body = {
      identity: loginAuthRequest,
      device: {
        device_id: authenState.deviceId.value as string,
        os: authenState.deviceOS.value as string,
      },
      push_token: {
        value: authenState.fcmToken.value,
        type: 'FCM',
      },
    };
    if (!isEmpty(loginAuthRequest.password)) {
      hashPassword = hash(HashingType.SHA512, loginAuthRequest.password!);
      assign(body, {password: hashPassword});
    }
    if (loginAuthRequest.id) {
      assign(body, {
        otp: {id: loginAuthRequest.id, reference: loginAuthRequest.reference},
      });
    }
    return body;
  };

  public residentExternalId = async (
    accountId: string,
    type: string = 'resident',
  ) => {
    try {
      const {data} = await obIamClient.get(
        `external_identity?type=${type}&account_id=${accountId}`,
      );
      return data.data as ExternalIdentity[];
    } catch (error) {
      console.log(`AuthService_residentExternalId_error : `, error);
      throw error;
    }
  };
}

const authService = new AuthService();
export default authService;
