import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas } from '../openapi/interfaces/schemas';
import { AccountService, SettingService } from '../services';
import BaseController from './base_controller';
import {
  setting as SettingType,
  account as AccountType,
} from 'ob-iam/db/client';

export default class SettingController extends BaseController {
  public async find(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['FindSettingResponse']>,
  ) {
    const settingService = new SettingService();
    const accountService = new AccountService();

    const {
      headers: { 'x-account-id': accountId },
    } = req;

    const setting = await settingService.find({
      account_id: accountId as string,
    });
    const account = await accountService.find(accountId as string);

    const response = {
      data: {
        setting: await this.serailziedSetting(setting, account),
      },
    };

    return res.json(response);
  }

  public async update(
    req: TypedRequest<schemas['UpdateSettingRequestBody']>,
    res: TypedResponse<schemas['UpdateSettingResponse']>,
  ) {
    const {
      headers: { 'x-account-id': accountId },
      body,
    } = req;

    const settingService = new SettingService();
    const accountService = new AccountService();

    const setting = await settingService.update(
      { account_id: accountId as string },
      body,
    );

    const account = await accountService.find(accountId as string);

    const response = {
      data: {
        setting: await this.serailziedSetting(setting, account),
      },
    };

    return res.json(response);
  }

  private serailziedSetting(
    setting: SettingType,
    account?: AccountType | null,
  ) {
    return {
      two_factor_authentication_enabled:
        setting.two_factor_authentication_enabled,
      password_enabled: account?.password ? true : false,
    };
  }
}
