import httpContext from 'express-http-context';
import { Controller, Get, OperationId, Route, Request, Post, Path, Header } from 'tsoa';
import { WrappedResponse } from './index.interface';
import { Request as Req } from 'express';
import { authorizePermission } from '../utils/authorization';
import { CustomError } from '../midlewares/error';
import { OBError } from '../utils/error_spec';
import { EncryptedDataResult, TokensDataResult } from './qr_token_controller.interface';
import QrService from '../services/qr_service';
import { QrTokenResult } from '../services/qr_service/index.interface';

@Route('me')
export class QrTokenController extends Controller {
  @Get('qr_token')
  @OperationId('qr_token.show')
  public async show(@Request() req: Req): Promise<WrappedResponse<QrTokenResult>> {
    const {
      headers: { 'x-account-id': accountId },
    } = req;
    const userPermission = httpContext.get('permissions');
    authorizePermission(userPermission, 'read', 'token');
    const qrService = new QrService();
    const token: QrTokenResult = await qrService.find(accountId as string);

    return {
      data: token,
    };
  }
  @Post('qr_token')
  @OperationId('qr_token.getEncryptedData')
  public async getEncryptedData(@Request() req: Req): Promise<WrappedResponse<QrTokenResult | null>> {
    const {
      headers: { 'x-account-id': accountId },
    } = req;

    const userPermission = httpContext.get('permissions');
    authorizePermission(userPermission, 'create', 'token');
    const qrService = new QrService();
    const token: QrTokenResult = await qrService.generateQRToken(accountId as string);
    return {
      data: token,
    };
  }
}

@Route('integration')
export class TokenController extends Controller {
  @Get('tokens/{id}')
  @OperationId('integration.EncryptedData')
  public async EncryptedData(
    @Path() id: string,
    @Header('x-account-id') XAccountId?: string,
  ): Promise<WrappedResponse<EncryptedDataResult>> {
    const userPermission = httpContext.get('permissions');
    authorizePermission(userPermission, 'read', 'fs');
    const qrService = new QrService();
    const encryptedData: EncryptedDataResult = await qrService.getEncryptedData(id, XAccountId);

    return {
      data: encryptedData,
    };
  }

  @Get('tokens/{id}/account')
  @OperationId('integration.token')
  public async integrationTokenData(
    @Path() id: string,
    @Header('x-account-id') XAccountId?: string,
  ): Promise<WrappedResponse<TokensDataResult>> {
    const userPermission = httpContext.get('permissions');
    authorizePermission(userPermission, 'read', 'fs');
    if (!XAccountId) throw new CustomError(OBError.IAM_AUTH_006);

    const qrService = new QrService();
    const accountId: string = await qrService.getTokenData(id);

    return {
      data: { id: accountId },
    };
  }
}
