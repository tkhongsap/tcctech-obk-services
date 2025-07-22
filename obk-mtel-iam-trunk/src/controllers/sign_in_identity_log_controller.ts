import { Controller, Get, OperationId, Path, Route } from 'tsoa';
import { WrappedResponse } from './index.interface';
import SignInIdentityService from '../services/sign_in_identity_log_service';
import { SigninIdentityLogResultData } from './sign_in_identity_log_controller.interfaces';
import { signInidentityLogSerializer } from './sign_in_identity_log_controller.serializer';

@Route('sign_in_identity')
export class SecuritysController extends Controller {
  @Get('{id}')
  @OperationId('sign_in_identity.show')
  public async show(@Path() id: string): Promise<WrappedResponse<SigninIdentityLogResultData>> {
    const signInIdentityService = new SignInIdentityService();
    const result = await signInIdentityService.show(id);

    return {
      data: signInidentityLogSerializer(result as SigninIdentityLogResultData),
    };
  }
}
