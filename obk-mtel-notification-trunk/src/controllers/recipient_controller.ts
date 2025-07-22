import { Controller, Post, OperationId, Route, Header, Body, Put } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import {
  CreateRecipientBody,
  CreateRecipientResult,
  UpdateRecipientFCMTokenData,
} from './recipient_controller.interfaces';
import { RecipientService } from '../services/recipient_service';
@Route('me/recipient')
export class RecipientController extends Controller {
  @Post('')
  @OperationId('recipient.create')
  public async create(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Body() body: CreateRecipientBody,
  ): Promise<WrappedResponse<CreateRecipientResult>> {
    this.setStatus(200);
    return {
      data: {
        result: true,
      },
    };
  }
  @Put('')
  @OperationId('recipient_fcm_token.update')
  public async updateFCMToken(
    @Header('x-account-id') accountId: string,
    @Header('X-Access-Token') accessToken: string,
    @Body() body: UpdateRecipientFCMTokenData,
  ): Promise<WrappedResponse<CreateRecipientResult>> {
    const { push_token } = body;
    const recipientService = new RecipientService();
    await recipientService.updateRecipientFCMToken({ account_id: accountId, push_token });

    this.setStatus(200);
    return {
      data: {
        result: true,
      },
    };
  }
}
