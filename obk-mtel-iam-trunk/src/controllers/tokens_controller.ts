import { Controller, Post, OperationId, Body, Header, Route, Get, Path } from 'tsoa';
import AuthService from '../services/auth_service';
import dayjs from 'dayjs';
import { WrappedResponse } from './index.interface';
import { TokenSerializer, TokenSerializerWithAccountId } from './tokens_controller.serializer';
import { CreateTokenRequestBody, CreateTokenResponse, ShowTokenResponse } from './tokens_controller.interfaces';
import TokenRepository from '../repositories/token_repository';
import { CustomError } from '../midlewares/error';
import { OBError } from '../utils/error_spec';
import QrService from '../services/qr_service';

@Route('tokens')
export class TokensController extends Controller {
  @Post('')
  @OperationId('tokens.create')
  public async create(
    @Body() body: CreateTokenRequestBody,
    @Header('x-account-id') XAccountId?: string,
  ): Promise<WrappedResponse<CreateTokenResponse>> {
    const expiredAt = dayjs(body.expired_at);
    const token = await new AuthService().generateEncryptedToken({
      accountId: XAccountId as string,
      type: body.type,
      payloadArray: body.value,
      expiredAt,
    });
    return {
      data: TokenSerializer(token),
    };
  }
  @Get('{token_id}')
  @OperationId('tokens.show')
  public async show(@Path() token_id: string): Promise<WrappedResponse<ShowTokenResponse>> {
    const cachetoken = await new QrService().getByTokenId(token_id);
    if (cachetoken) {
      return {
        data: {
          token: {
            id: cachetoken.id,
            expired_date: cachetoken.expired_date,
            account_id: cachetoken.account_id,
            type: cachetoken.type,
          },
        },
      };
    }

    const token = await TokenRepository.findFirst({ where: { id: token_id } });
    if (!token) {
      throw new CustomError(OBError.IAM_IDT_001);
    }
    return {
      data: TokenSerializerWithAccountId(token),
    };
  }
  @Get('/validate/{token_id}')
  @OperationId('tokens.validate')
  public async validate(@Path() token_id: string): Promise<void> {
    const cachetoken = await new QrService().getByTokenValue(token_id);
    if (cachetoken) {
      return this.setStatus(200);
    }
    const token = await TokenRepository.findFirst({ where: { value: token_id, active: true } });
    if (!token) {
      this.setStatus(401);
    } else {
      this.setStatus(200);
    }
  }
}
