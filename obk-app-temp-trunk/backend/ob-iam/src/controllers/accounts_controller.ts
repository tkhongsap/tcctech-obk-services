import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas } from '../openapi/interfaces/schemas';

import { AccountService } from '../services';
import BaseController from './base_controller';

export default class AccountsController extends BaseController {
  public async find(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['AccountDataResponse']>,
  ) {
    const accountService = new AccountService();
    const { id } = req.params;
    const response = await accountService.getAccountDetail(id);
    return res.json({
      data: response,
    });
  }
}
