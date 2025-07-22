import {hookstate, useHookstate} from '@hookstate/core';
import hash, {HashingType} from '~/utils/encrypt';
import {hideLoading, showLoading} from '~/states/loadingState';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {assign} from 'lodash';
import * as OB_IAM_SDK from 'ob-iam-sdk';

interface ResetPasswordStateDTO {
  isFocusing: boolean;
  password: string;
  confirmPassword: string;
  validIdentifier: boolean;
  errMsgPassword: string;
  errMsgConfirmPassword: string;
  showStrengthBar: boolean;
  identifier: string;
  countryCode: string;
  provider: string;
  otp: string;
  reference: string;
}

const DEFAULT_STATE = {
  isFocusing: false,
  password: '',
  confirmPassword: '',
  validIdentifier: false,
  errMsgPassword: '',
  errMsgConfirmPassword: '',
  showStrengthBar: false,
  identifier: '',
  countryCode: '',
  provider: '',
  otp: '',
  reference: '',
};

const resetPasswordState = hookstate<ResetPasswordStateDTO>({...DEFAULT_STATE});

const useResetPasswordState = () => useHookstate(resetPasswordState);

const resetPasswordStateAction = {
  reset: () => {
    resetPasswordState.set(DEFAULT_STATE);
  },
  setIdentityVariable: (
    identifier: string,
    countryCode: string,
    provider: string,
    otp: string,
    reference: string,
  ) => {
    resetPasswordState.set(state => {
      state.identifier = identifier;
      state.countryCode = countryCode;
      state.provider = provider;
      state.otp = otp;
      state.reference = reference;
      return state;
    });
  },
  submitNewPassword: async (
    password: string,
    otp?: string,
    reference?: string,
  ) => {
    showLoading();
    const hashedPassword = hash(HashingType.SHA512, password);

    const requestData = {
      body: {
        identity: {
          identifier: resetPasswordState.identifier.value,
          provider: resetPasswordState.provider.value as ProviderType,
          country_code: resetPasswordState.countryCode.value,
          otp: resetPasswordState.otp.value,
          reference: resetPasswordState.reference.value,
        },
        hashedPassword: hashedPassword,
      },
    };

    if (otp) {
      assign(requestData.body, {otp: {id: otp, reference: reference}});
    }

    try {
      const res = await OB_IAM_SDK.client.accountResetPassword({
        data: requestData.body,
      });
      if (res.status !== 200) {
        throw new Error('Failed to reset password');
      }
      return res.data?.data;
    } catch (error) {
      console.error('Error resetting password:', error);
    } finally {
      hideLoading();
    }
  },
};

export {resetPasswordState, resetPasswordStateAction, useResetPasswordState};
