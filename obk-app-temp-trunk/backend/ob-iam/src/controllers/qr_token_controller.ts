import httpContext from 'express-http-context';

import BaseController from './base_controller';
import { authorizePermission } from '../utils/authorization';
import TokenService from '../services/token_service';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas } from '../openapi/interfaces/schemas';
import { AuthService } from '../services';
import { token } from '../../db/client';

export default class QRTokenController extends BaseController {
  constructor() {
    super();
  }

  public async show(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['ShowQRTokenResponse']>,
  ) {
    const {
      headers: { 'x-account-id': accountId },
    } = req;

    const userPermission = httpContext.get('permissions');
    authorizePermission(userPermission, 'read', 'token');
    const tokenService = new TokenService();
    const token = await tokenService.find(accountId as string);
    let serializedToken;

    if (token) {
      serializedToken = await this.serializedQRToken(token);
    }
    return res.json({
      data: {
        token: serializedToken,
      },
    });
  }

  public async create(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['ShowQRTokenResponse']>,
  ) {
    const {
      headers: { 'x-account-id': accountId },
    } = req;

    const userPermission = httpContext.get('permissions');
    authorizePermission(userPermission, 'create', 'token');

    const authService = new AuthService();
    const qrToken = await authService.generateQRToken(accountId as string);

    return res.json({
      data: {
        token: await this.serializedQRToken(qrToken),
      },
    });
  }

  private async serializedQRToken(token: token) {
    return {
      id: token.id,
      expired_date: token.expired_date?.toISOString() as string,
    };
  }
  public async getEncryptedData(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['EncryptedDataResponse']>,
  ) {
    const userPermission = httpContext.get('permissions');
    authorizePermission(userPermission, 'read', 'fs');

    const { id } = req.params;

    const authService = new AuthService();
    const encrypted_data = await authService.getEncryptedData(
      id as string,
      'fs',
    );

    return res.json({
      data: {
        encrypted_data: encrypted_data,
      },
    });
  }
}
