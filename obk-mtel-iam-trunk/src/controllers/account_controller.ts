import { Request as Req } from 'express';
import { Body, Controller, Delete, Get, OperationId, Path, Post, Put, Request, Route } from 'tsoa';
import { ResultResponseData, WrappedResponse } from './index.interface';
import AccountService from '../services/account_service';
import { DateTimeUtils } from '../utils/datetime';
import { AccountIdRequestResponse, AccountResponseData, PasswordRequestBody } from './account_controller.interfaces';
import { get } from 'lodash';
import { loginResult } from '../services/auth_service/index.interface';
import { CustomError } from '../midlewares/error';
import { OBError } from '../utils/error_spec';
import ActivityLog from '../utils/activity_log';
import cache from '../libs/cache';
import ProfileRepository from '../repositories/profile_repository';

@Route('me/account')
export class AccountController extends Controller {
  @Get('')
  @OperationId('account.accountId')
  public async accountId(@Request() req: Req): Promise<WrappedResponse<AccountResponseData>> {
    const accountService = new AccountService();
    const account = await accountService.findAccount(req);
    if (!account) {
      throw new CustomError(OBError.IAM_IDT_003);
    }
    const response = {
      data: {
        account: {
          id: account.id,
        },
      },
    };
    return response;
  }
  @Delete('')
  @OperationId('account.delete')
  @ActivityLog('account.deactivate')
  public async delete(@Request() req: Req): Promise<WrappedResponse<ResultResponseData>> {
    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();

    if (!accountId) {
      throw new CustomError(OBError.IAM_AUTH_006);
    }
    const accountService = new AccountService();

    const deletedAt = DateTimeUtils.getCurrentDateTime().toISOString();

    await accountService.update({ deleted_at: deletedAt }, { id: accountId });
    const response = {
      data: {
        result: true,
      },
    };
    return response;
  }
  @Post('verify_password')
  @OperationId('account.verifyPassword')
  public async verifyPassword(
    @Request() req: Req,
    @Body() body: PasswordRequestBody,
  ): Promise<WrappedResponse<ResultResponseData>> {
    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();
    const { password } = body;
    if (!accountId) {
      throw new CustomError(OBError.IAM_AUTH_006);
    }
    const accountService = new AccountService();
    const result = await accountService.verifyPassword(accountId, password);

    const response = {
      data: {
        result,
      },
    };
    return response;
  }
  @Put('password')
  @OperationId('account.updatePassword')
  public async updatePassword(
    @Request() req: Req,
    @Body() body: PasswordRequestBody,
  ): Promise<WrappedResponse<ResultResponseData>> {
    const header = get(req, 'headers');
    const accountId = get(header, 'x-account-id', '').toString();
    const { password } = body;
    if (!accountId) {
      throw new CustomError(OBError.IAM_AUTH_006);
    }
    const accountService = new AccountService();
    const result = await accountService.updatePassword(accountId, password);

    const response = {
      data: {
        result,
      },
    };
    return response;
  }
  @Put('reset_password')
  @OperationId('account.resetPassword')
  public async resetPassword(@Request() req: Req): Promise<WrappedResponse<loginResult>> {
    const accountService = new AccountService();
    const result = await accountService.resetPassword(req);
    const response = {
      data: result,
    };
    return response;
  }
  @Get('{email}/account_id')
  @OperationId('account.accountId')
  public async getAccountIdFromEmail(@Path() email: string): Promise<WrappedResponse<AccountIdRequestResponse>> {
    const accountService = new AccountService();
    const accountId = await accountService.getAccountIdFromEmail(email);
    if (!accountId) {
      throw new CustomError(OBError.IAM_IDT_003);
    }
    await cache.getSet(`profile_${accountId}`, async () => {
      const profileData = await ProfileRepository.findFirst({
        where: { account_id: accountId as string },
      });
      if (profileData) {
        return JSON.stringify(profileData);
      } else {
        return '';
      }
    });
    const response = {
      data: {
        account_id: accountId,
      },
    };
    return response;
  }
}
