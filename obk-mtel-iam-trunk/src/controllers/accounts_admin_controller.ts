import { BaseController } from './base_controller';
import { OperationId, Route, Path, Put, Body, Delete } from 'tsoa';
import { ResultResponseData, WrappedResponse } from './index.interface';
import { DefaultIdentity, RemoveIdentity } from './accounts_controller.interfaces';
import AccountService from '../services/account_service';
import { ProfileResult, ProfileUpdateBody } from './profile_controller.interface';
import ProfileRepository from '../repositories/profile_repository';
import cache from '../libs/cache';
import ActivityLog from '../utils/activity_log';
import { EventProducer } from '../utils/kafka';
import { ProfileSerializer } from './profile_controller.serializer';
import IdentityService from '../services/identity_service';
import { DateTimeUtils } from '../utils/datetime';

@Route('accounts/admin')
export class AccountsAdminController extends BaseController {
  @Put('{id}/edit_profile')
  @OperationId('profile.update.admin')
  @ActivityLog('profile.update.admin')
  public async update(
    @Path() id: string,
    @Body() body: ProfileUpdateBody,
  ): Promise<WrappedResponse<ProfileResult | null>> {
    const { first_name, middle_name, last_name, title, dob, gender } = body;
    const restProfile = {
      title: title,
      dob: dob,
      gender: gender,
    };

    const profile = await ProfileRepository.update({
      where: { account_id: id },
      data: {
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        ...restProfile,
      },
    });

    await cache.set(`profile_${id}`, JSON.stringify(profile));

    EventProducer.send({
      name: 'ob-iam.profile.updated',
      payload: {
        account_id: profile?.account_id,
        first_name: profile?.first_name,
        middle_name: profile?.middle_name,
        last_name: profile?.last_name,
        gender: profile?.gender,
        dob: profile?.dob,
      },
    });

    const result = ProfileSerializer(profile);
    return {
      data: result,
    };
  }

  @Put('{id}/identity/default')
  @OperationId('identity.default.admin')
  @ActivityLog('identity.default.admin')
  public async default(
    @Path('id') accountId: string,
    @Body() body: DefaultIdentity,
  ): Promise<WrappedResponse<ResultResponseData>> {
    const identityService = new IdentityService();
    const { identityId } = body;

    const result = await identityService.updateDefault(identityId, accountId);

    return {
      data: {
        result: result,
      },
    };
  }

  @Delete('{id}/identity/delete')
  @OperationId('identity.delete.admin')
  @ActivityLog('identity.delete.admin')
  public async deleteIdentity(
    @Path('id') accountId: string,
    @Body() body: RemoveIdentity,
  ): Promise<WrappedResponse<ResultResponseData>> {
    const identityService = new IdentityService();

    const { identityId } = body;

    const result = await identityService.delete(accountId, identityId);

    return {
      data: { result: result },
    };
  }
  @Put('{id}/suspend')
  @OperationId('account.suspend.admin')
  @ActivityLog('account.suspend.admin')
  public async suspend(@Path('id') accountId: string): Promise<WrappedResponse<ResultResponseData>> {
    const accountService = new AccountService();
    const result = await accountService.suspendAccount(accountId);
    return {
      data: { result: result },
    };
  }

  @Put('{id}/unsuspend')
  @OperationId('account.unsuspend.admin')
  @ActivityLog('account.unsuspend.admin')
  public async unsuspend(@Path('id') accountId: string): Promise<WrappedResponse<ResultResponseData>> {
    const accountService = new AccountService();
    const result = await accountService.unsuspendAccount(accountId);
    return {
      data: { result: result },
    };
  }

  @Delete('{id}/delete')
  @OperationId('account.delete.admin')
  @ActivityLog('account.delete.admin')
  public async deleteAccount(@Path('id') accountId: string): Promise<WrappedResponse<ResultResponseData>> {
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
}
