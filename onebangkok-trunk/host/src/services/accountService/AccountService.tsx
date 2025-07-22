import authenState from '~/states/authen/authenState';
import {hideLoading, showLoading} from '~/states/loadingState';
import hash, {HashingType} from '~/utils/encrypt';

import accountAction from '~/states/account/accountAction';
import * as OB_IAM_SDK from 'ob-iam-sdk';

class AccountService {
  public verifyPassword = async (currentPassword: string) => {
    showLoading();
    const hashPassword = hash(HashingType.SHA512, currentPassword);
    if (authenState.token.value !== null) {
      try {
        const res = await OB_IAM_SDK.client.accountVerifyPassword({
          password: hashPassword,
        });
        hideLoading();
        if (res.status !== 200) {
          return null;
        }
        return res.data?.data?.result;
      } catch (error) {
        hideLoading();
      }
    }
  };
  public submitNewPassword = async (password: string) => {
    showLoading();
    const hashPassword = hash(HashingType.SHA512, password);
    if (authenState.token.value !== null) {
      const res = await OB_IAM_SDK.client.accountUpdatePassword({
        password: hashPassword,
      });
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      return res.data?.data?.result;
    }
    hideLoading();
  };
  public submitNewBirthday = async (dob: Date) => {
    const res = await this.updateProfile({
      dob: dob,
    });
    return res;
  };

  public submitNewName = async (
    firstName: string,
    middleName: string,
    lastName: string,
  ) => {
    const res = await this.updateProfile({
      firstName: firstName?.trim() as string,
      middleName: middleName?.trim() as string,
      lastName: lastName?.trim() as string,
    });
    return res;
  };

  private updateProfile = async (data: object) => {
    const res = await accountAction.updateProfile(data);
    return res;
  };
}
const accountService = new AccountService();
export default accountService;
