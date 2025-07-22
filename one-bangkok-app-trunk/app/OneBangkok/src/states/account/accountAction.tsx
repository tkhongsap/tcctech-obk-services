import authenState, {authenStateAction} from '~/states/authen/authenState';
import {showLoading, hideLoading} from '~/states/loadingState';
import {headerAccessToken, mapKeysWithSnakeCase} from '~/helpers/api';
import {
  Gender,
  ProviderType,
} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {accountStateAction} from './accountState';
import {assign, isEmpty} from 'lodash';
import * as OB_IAM_SDK from 'ob-iam-sdk';

interface UpdateProfileBody {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  dob?: Date;
  gender?: Gender;
}

const accountAction = {
  getProfile: async () => {
    try {
      showLoading();
      const response = await OB_IAM_SDK.client.profileIndex(
        '',
        '',
        headerAccessToken(),
      );

      const profile = response?.data?.data?.profile;
      accountStateAction.updateProfile(profile);
      hideLoading();

      return profile;
    } catch (error: any) {
      hideLoading();
    }
  },
  updateProfile: async (updateProfileBody: UpdateProfileBody) => {
    try {
      showLoading();

      const body = mapKeysWithSnakeCase(updateProfileBody);

      const response = await OB_IAM_SDK.client.profileUpdate(
        '',
        '',
        body,
        headerAccessToken(),
      );

      const profile = response.data?.data?.profile!;
      accountStateAction.updateProfile(profile);

      hideLoading();
      return true;
    } catch (error: any) {
      hideLoading();
      return false;
    }
  },
  deleteAccount: async () => {
    try {
      showLoading();
      if (authenState.token.value) {
        await OB_IAM_SDK.client.accountDelete(headerAccessToken());
      }
      hideLoading();
    } catch (error: any) {
      console.log(error);
      hideLoading();
    }
  },
  logout: async () => {
    try {
      showLoading();
      await OB_IAM_SDK.client.authLogout('', headerAccessToken());

      const {logout} = authenStateAction;
      logout();

      hideLoading();
    } catch (error: any) {
      hideLoading();
    }
  },
  addNewIdentity: async (
    identifier: string,
    provider: ProviderType,
    otpId: string,
    countryCode?: string,
  ) => {
    try {
      if (!authenState.token.value) {
        // return someting to show an error
        return;
      }

      showLoading();
      const identity = {
        identifier: identifier,
        provider: provider as any,
      };
      if (!isEmpty(countryCode)) {
        assign(identity, {country_code: countryCode});
      }
      const body = {
        identity,
        otp: {
          id: otpId,
        },
      };
      const result = await OB_IAM_SDK.client.identityCreate(
        body,
        headerAccessToken(),
      );
      if (result.data?.data?.result === true) {
        await accountAction.getIdentities();
      }

      hideLoading();

      return result;
    } catch (error) {
      console.log(error);
      // pop up error??
      hideLoading();
    }
  },
  setDefaultIdentity: async (provier: ProviderType, id: string) => {
    try {
      if (!authenState.token.value) {
        // return someting to show an error
        return;
      }

      showLoading();

      const result = await OB_IAM_SDK.client.identityDefault(
        id,
        headerAccessToken(),
      );

      if (result.data?.data?.result === true) {
        accountStateAction.setProviderToDefault(provier, id);
      }
      hideLoading();
      return result;
    } catch (error) {
      console.log(error);
      hideLoading();
    }
  },
  getIdentities: async (provider?: ProviderType) => {
    try {
      if (!authenState.token.value) {
        // return someting to show an error
        return;
      }

      showLoading();
      const params = {
        header: {
          'X-Access-Token': `Bearer ${authenState.token.value}`,
          'X-Account-Id': '',
        },
        query: {
          provider,
        },
      };
      let response = await OB_IAM_SDK.client.identityShow(
        '',
        provider,
        headerAccessToken(),
      );

      const identifiers = response?.data?.data;

      accountStateAction.updateIdentifier(identifiers);

      hideLoading();
    } catch (error) {
      console.log(error);
      hideLoading();
    }
  },
  deleteIdentity: async (id: string) => {
    try {
      if (!authenState.token.value) {
        // return someting to show an error
        return;
      }

      showLoading();

      const result = await OB_IAM_SDK.client.identityDelete(
        '',
        id,
        headerAccessToken(),
      );

      if (result.data?.data?.result === true) {
        await accountAction.getIdentities();
      }

      hideLoading();

      return result;
    } catch (error) {
      console.log(error);
      hideLoading();
    }
  },
};

export default accountAction;
