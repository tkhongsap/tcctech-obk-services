import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas } from '../openapi/interfaces/schemas';

import { AuthService, AccountService } from '../services';
import BaseController from './base_controller';

export default class AuthController extends BaseController {
  public async register(
    req: TypedRequest<schemas['RegisterAuthRequestBody']>,
    res: TypedResponse<schemas['RegisterAuthResponse']>,
  ) {
    const accountService = new AccountService();
    const { profile, identities, password, device, push_token } = req.body;

    const token = await accountService.register({
      profile,
      identities,
      password: password ? password : null,
      device,
      push_token,
    });

    const response = {
      data: {
        token: {
          value: token.value,
        },
      },
    };
    res.json(response);
  }

  public async login(
    req: TypedRequest<schemas['LoginAuthRequestBody']>,
    res: TypedResponse<schemas['LoginAuthResponse']>,
  ) {
    const authService = new AuthService();

    const result = await authService.login(req);
    const response = {
      data: result,
    };

    return res.json(response);
  }

  public async logout(
    req: TypedRequest<schemas['LogoutAuthRequestBody']>,
    res: TypedResponse<schemas['LogoutAuthResponse']>,
  ) {
    const {
      headers: { 'x-access-token': token },
    } = req;
    const authService = new AuthService();

    authService.logout(token as string);
    const response = {
      data: {
        result: true,
      },
    };

    return res.json(response);
  }

  public async reactivate(
    req: TypedRequest<schemas['ReactivateAuthRequestBody']>,
    res: TypedResponse<schemas['ReactivateAuthResponse']>,
  ) {
    const authService = new AuthService();

    const result = await authService.reactivate(req);
    const response = {
      data: result,
    };

    return res.json(response);
  }
}
