import {hookstate, useHookstate} from '@hookstate/core';
import hash, {HashingType} from '~/utils/encrypt';
import {components as OBIAMComponents} from '../../../utils/ob_sdk/services/ob_iam/openapi_interfaces';
import {assign} from 'lodash';
import {hideLoading, showLoading} from '~/states/loadingState';
import DateTime from '~/utils/datetime';
import {SSOProviderType} from '~/constants/AuthsConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authenState from '~/states/authen/authenState';
import * as OB_IAM_SDK from 'ob-iam-sdk';

interface SignUpState {
  email: string;
  phone: string;
  countryCode: string;
  provider: string;
  validIdentifier: boolean;
  password: string;
  isPasswordConfirm: boolean;
  termsConditions: boolean;
  privacyPolicy: boolean;
  uid: string;
  meta: Record<string, never>;
  providerType: SSOProviderType | undefined;
}

interface ProfileInfo {
  firstName: string;
  middleName: string | null | undefined;
  lastName: string;
  gender: 'male' | 'female' | 'nonbinary' | 'prefernottosay';
  dob: Date;
}

const DEFAULT_STATE = {
  email: '',
  phone: '',
  countryCode: '+66',
  provider: 'email',
  validIdentifier: false,
  password: '',
  isPasswordConfirm: false,
  termsConditions: false,
  privacyPolicy: false,
  uid: '',
  meta: {},
  providerType: undefined,
};

const signUpState = hookstate<SignUpState>(DEFAULT_STATE);

const useSignUpState = () => useHookstate(signUpState);

const signUpStateAction = {
  setPrivacyPolicy: (value: boolean) => {
    return signUpState.privacyPolicy.set(value);
  },
  setTermsConditions: (value: boolean) => {
    return signUpState.termsConditions.set(value);
  },
  isProvider: (provider: string) => {
    return signUpState.provider.value === provider;
  },
  setEmail: (email: string) => {
    signUpState.email.set(email.toLocaleLowerCase());
  },
  setPhone: (phone: string) => {
    signUpState.phone.set(phone);
  },
  setCountryCode: (countryCode: string) => {
    signUpState.countryCode.set(countryCode);
  },
  setProvider: (provider: string) => {
    signUpState.provider.set(provider);
  },
  validateIdentifier: () => {
    signUpState.validIdentifier.set(true);
  },
  invalidateIdentifier: () => {
    signUpState.validIdentifier.set(false);
  },
  resetEmail: () => {
    signUpState.email.set('');
  },
  resetPhone: () => {
    signUpState.phone.set('');
  },
  setPassword: (password: string) => {
    signUpState.password.set(password);
  },
  setUid: (uid: string) => {
    signUpState.uid.set(uid);
  },
  resetUid: () => {
    signUpState.uid.set('');
  },
  setMeta: (meta: Record<string, never>) => {
    signUpState.meta.set(meta);
  },
  resetMeta: () => {
    signUpState.meta.set({});
  },
  resetRegisterData: () => {
    signUpState.set({...DEFAULT_STATE});
  },
  setProviderType: (type: SSOProviderType) => {
    signUpState.providerType.set(type);
  },

  createAccount: async (profileInfo: ProfileInfo) => {
    showLoading();
    let hashPassword = '';
    if (signUpState.provider.value !== 'sso') {
      hashPassword = hash(HashingType.SHA512, signUpState.password.value);
    }
    const date = DateTime.addTime(profileInfo.dob.toISOString(), 1, 'days');
    const dateLocal = DateTime.formatDate(
      date.toISOString(),
      'YYYY-MM-DDT00:00:00.000',
    );
    const profile = {
      first_name: profileInfo.firstName?.trim(),
      last_name: profileInfo.lastName?.trim(),
      dob: dateLocal + 'Z',
      gender: profileInfo.gender,
    };
    if (profileInfo.middleName) {
      assign(profile, {middle_name: profileInfo.middleName.trim()});
    }
    let identities: OBIAMComponents['schemas']['RegisterAuthRequestBody']['identities'] =
      {
        provider: 'email',
        identifier: '',
      };
    const uid =
      signUpState.provider.value === 'sso' ? signUpState.uid.value : undefined;
    const meta =
      signUpState.provider.value === 'sso' ? signUpState.meta.value : undefined;
    const provider = signUpState.provider.value === 'email' ? 'email' : 'sso';
    const providerType =
      signUpState.provider.value === 'sso'
        ? signUpState.providerType.value
        : undefined;
    identities = {
      provider,
      identifier: signUpState.email.value.toLocaleLowerCase(),
      meta,
      uid,
      provider_type: providerType,
    };
    if (signUpState.provider.value === 'phone') {
      identities = {
        provider: 'phone',
        identifier: signUpState.phone.value,
        country_code: signUpState.countryCode.value,
      };
    }
    if (signUpState.provider.value === 'sso') {
      identities;
    }

    const res = await OB_IAM_SDK.client.authRegister({
      profile,
      identities,
      password: hashPassword,
      device: {
        device_id: authenState.deviceId.value as string,
        os: authenState.deviceOS.value as string,
      },
      push_token: {
        value: authenState.fcmToken.value as string,
        type: 'FCM',
      },
    });
    hideLoading();
    if (res.status !== 200) {
      throw new Error('Failed to fetch users');
    }
    if (identities.provider === 'sso') {
      identities.provider = 'email';
    }
    AsyncStorage.setItem('identity', JSON.stringify(identities));

    return {token: res.data?.data?.token!.value, refreshToken: res.data?.data?.refreshToken!.value};
  },
};

export {signUpState, signUpStateAction, useSignUpState};
