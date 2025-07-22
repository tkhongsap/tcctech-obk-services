import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  OperationId,
  Path,
  Post,
  Put,
  Queries,
  Query,
  Request,
  Route,
} from 'tsoa';
import { Provider, ResultResponseData, WrappedResponse } from './index.interface';
import { CreateIdentityRequestBody, ValidateRequestBody } from './identity_controller.interfaces';
import IdentityService from '../services/identity_service';
import { getIdentifier } from '../utils/identifier';
import { Request as Req } from 'express';
import AccountService from '../services/account_service';
import { IdentityResponse } from '../services/identity_service/index.interface';
import { CustomError } from '../midlewares/error';
import { OBError } from '../utils/error_spec';
import AuthService from '../services/auth_service';
import ActivityLog from '../utils/activity_log';

@Route('identity')
export class IdentityController extends Controller {
  @OperationId('identity.validate')
  @Get('validate')
  public async validate(@Queries() query: ValidateRequestBody): Promise<WrappedResponse<ResultResponseData>> {
    const { provider, identifier, country_code: countryCode } = query;
    const identityService = new IdentityService();

    const formatIdentifier = getIdentifier(provider, identifier, countryCode);
    if (process.env.ENABLE_REGISTRATION_WHITELIST === 'true') {
      const isWhitelisted = await new AuthService().validateWhitelist(formatIdentifier, provider);
      if (!isWhitelisted) {
        throw new CustomError(OBError.IAM_IDT_0010);
      }
    }

    const isValid = await identityService.validate(formatIdentifier, provider);

    return {
      data: {
        result: isValid,
      },
    };
  }

  @Post()
  @OperationId('identity.create')
  @ActivityLog('identity.create')
  public async create(
    @Request() req: Req,
    @Body() body: CreateIdentityRequestBody,
  ): Promise<WrappedResponse<ResultResponseData>> {
    const {
      headers: { 'x-account-id': accountId },
    } = req;

    const accountService = new AccountService();
    const {
      identity: { identifier, provider, country_code },
      otp: { id: otpId },
    } = body;
    const identityService = new IdentityService();
    const isValid = await identityService.validate(getIdentifier(provider, identifier, country_code), provider);
    if (isValid) {
      throw new CustomError(OBError.IAM_IDT_002);
    }

    const registerResult = await accountService.createIdentity(
      { identifier, provider, country_code },
      accountId as string,
      otpId,
    );
    return {
      data: {
        result: registerResult,
      },
    };
  }

  @Put('{id}/default')
  @OperationId('identity.default')
  @ActivityLog('identity.default')
  public async default(@Path() id: string, @Request() req: Req): Promise<WrappedResponse<ResultResponseData>> {
    const {
      headers: { 'x-account-id': accountId },
    } = req;

    const identityService = new IdentityService();
    const result = await identityService.updateDefault(id, accountId as string);

    return {
      data: {
        result: result,
      },
    };
  }

  @Get()
  @OperationId('identity.show')
  public async show(
    @Header('x-account-id') accountId: string,
    @Query() provider?: Provider,
  ): Promise<WrappedResponse<IdentityResponse>> {
    const identityService = new IdentityService();

    const result = await identityService.findAll(accountId as string, provider);
    return {
      data: result,
    };
  }
  @Delete('{id}')
  @OperationId('identity.delete')
  @ActivityLog('identity.delete')
  public async delete(
    @Header('x-account-id') accountId: string,
    @Path() id: string,
  ): Promise<WrappedResponse<ResultResponseData>> {
    const identityService = new IdentityService();

    const result = await identityService.delete(accountId, id);

    return {
      data: { result: result },
    };
  }
}
