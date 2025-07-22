import { get } from 'lodash';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { CustomError } from '../middlewares/error_middleware';
import { schemas } from '../openapi/interfaces/schemas';

import { AccountService } from '../services';
import BaseController from './base_controller';
import { DateTimeUtils } from 'ob-common-lib/dist';

export default class AccountController extends BaseController {
  public async find(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['AccountResponse']>,
  ) {
    const accountService = new AccountService();
    const account = await accountService.findAccount(req);
    if (!account) {
      throw new CustomError(400, 'Can not find account id');
    }
    // trigger deployment
    const response = {
      data: {
        account: {
          id: account.id,
        },
      },
    };
    res.json(response);
  }

  public async delete(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['DeleteAccountResponse']>,
  ) {
    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();

    if (!accountId) {
      throw new CustomError(400, 'x-account-id cannot be null');
    }
    const accountService = new AccountService();

    const deletedAt = DateTimeUtils.getCurrentDateTime().toISOString();

    await accountService.update({ deleted_at: deletedAt }, { id: accountId });
    const response = {
      data: {
        result: true,
      },
    };
    res.json(response);
  }

  public async verifyPassword(
    req: TypedRequest<schemas['VerifyPasswordRequestBody']>,
    res: TypedResponse<schemas['VerifyPasswordResponse']>,
  ) {
    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();
    const { password } = req.body;
    if (!accountId) {
      throw new CustomError(400, 'x-account-id cannot be null');
    }
    const accountService = new AccountService();
    const result = await accountService.verifyPassword(accountId, password);

    const response = {
      data: {
        result,
      },
    };
    res.json(response);
  }

  public async updatePassword(
    req: TypedRequest<schemas['UpdatePasswordRequestBody']>,
    res: TypedResponse<schemas['UpdatePasswordResponse']>,
  ) {
    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();
    const { password } = req.body;
    if (!accountId) {
      throw new CustomError(400, 'x-account-id cannot be null');
    }
    const accountService = new AccountService();
    const result = await accountService.updatePassword(accountId, password);

    const response = {
      data: {
        result,
      },
    };
    res.json(response);
  }

  public async resetPassword(
    req: TypedRequest<schemas['ResetPasswordRequestBody']>,
    res: TypedResponse<schemas['ResetPasswordResponse']>,
  ) {
    const accountService = new AccountService();
    const result = await accountService.resetPassword(req);
    const response = {
      data: result,
    };
    return res.json(response);
  }
}
