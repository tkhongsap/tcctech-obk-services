import { Body, Controller, Delete, Header, OperationId, Post, Put, Request, Route } from 'tsoa';

import AuthService from '../services/auth_service';
import {
  ReactivateAuthResponseData,
  RegisterAuthRequestBody,
  RenewAuthResponseData,
} from './auth_controller.interfaces';
import { loginResult } from '../services/auth_service/index.interface';
import { ResultResponseData, WrappedResponse } from './index.interface';
import TokenRepository from '../repositories/token_repository';
import logging from '../utils/logging';
import { CustomError } from '../midlewares/error';
import { OBError } from '../utils/error_spec';
import AccountService from '../services/account_service';
import { Request as Req } from 'express';
import ActivityLog from '../utils/activity_log';
import { isEmpty, isUndefined } from 'lodash';
import ActivityLogService from '../services/activity_log_service';

@Route('auth')
export class AuthController extends Controller {
  @Post('login')
  @OperationId('auth.login')
  @ActivityLog('auth.login')
  public async login(@Request() req: Req): Promise<WrappedResponse<loginResult | null>> {
    const authService = new AuthService();

    const result = await authService.login(req);

    if (!isEmpty(result) && !isUndefined(result.token)) {
      const activityLogService = new ActivityLogService();
      await activityLogService.createActivityLog(result.token?.value, 'auth.login');
    }

    return {
      data: result,
    };
  }

  @Post('login_ipad_resident')
  @OperationId('auth.login_ipad_resident')
  @ActivityLog('auth.login_ipad_resident')
  public async loginIpadResident(@Request() req: Req): Promise<WrappedResponse<loginResult | null>> {
    const authService = new AuthService();
    const result = await authService.loginIpadResident(req);

    if (!isEmpty(result) && !isUndefined(result.token)) {
      const activityLogService = new ActivityLogService();
      await activityLogService.createActivityLog(result.token?.value, 'auth.login_ipad_resident');
    }

    return {
      data: result,
    };
  }

  @Delete('logout')
  @OperationId('auth.logout')
  @ActivityLog('auth.logout')
  public async logout(@Header('x-account-id') accountId: string): Promise<WrappedResponse<ResultResponseData>> {
    const tokenUpdate = await TokenRepository.updateMany({ where: { account_id: accountId }, data: { active: false } });

    if (!tokenUpdate) {
      logging.error('auth service logout err token not found');
      throw new CustomError(OBError.IAM_STT_001);
    }

    return {
      data: {
        result: true,
      },
    };
  }

  @Post('register')
  @OperationId('auth.register')
  public async register(@Body() body: RegisterAuthRequestBody): Promise<WrappedResponse<loginResult | null>> {
    const accountService = new AccountService();
    const { profile, identities, password, device, push_token } = body;

    const { token, refreshToken } = await accountService.register({
      profile,
      identities,
      password: password ? password : null,
      device,
      push_token,
    });

    return {
      data: {
        token: {
          value: token.value,
        },
        refreshToken: {
          value: refreshToken.value,
        },
      },
    };
  }

  @Put('reactivate')
  @OperationId('auth.reactivate')
  @ActivityLog('auth.reactivate')
  public async reactivate(@Request() req: Req): Promise<WrappedResponse<ReactivateAuthResponseData | null>> {
    const authService = new AuthService();

    const result = await authService.reactivate(req);

    if (!isEmpty(result) && !isUndefined(result.token)) {
      const activityLogService = new ActivityLogService();
      await activityLogService.createActivityLog(result.token?.value, 'auth.reactivate');
    }

    return {
      data: result,
    };
  }

  @Put('renew')
  @OperationId('auth.renew')
  @ActivityLog('auth.renew')
  public async renew(@Request() req: Req): Promise<WrappedResponse<RenewAuthResponseData | null>> {
    const authService = new AuthService();

    const result = await authService.renew(req);

    return {
      data: result,
    };
  }
}
