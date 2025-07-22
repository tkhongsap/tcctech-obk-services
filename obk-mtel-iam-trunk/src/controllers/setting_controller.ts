import { Controller, Get, OperationId, Route, Put, Body, Header } from 'tsoa';
import { WrappedResponse } from './index.interface';
import SettingRepository from '../repositories/setting_repository';
import AccountRepository from '../repositories/account_repository';
import { SettingSerializer } from './setting_controller.serializer';
import { SettingBody, SettingResult } from './setting_controller.interfaces';
import SettingService from '../services/setting_service';
import ActivityLog from '../utils/activity_log';

@Route('me/setting')
export class SettingController extends Controller {
  @Get('')
  @OperationId('setting.index')
  public async index(@Header('x-account-id') accountId: string): Promise<WrappedResponse<SettingResult | null>> {
    const setting = await SettingRepository.findFirst({
      where: {
        account_id: accountId,
      },
    });

    const account = await AccountRepository.findFirst({
      where: {
        id: accountId,
      },
    });
    return {
      data: SettingSerializer(setting, account),
    };
  }

  @Put('')
  @OperationId('setting.update')
  @ActivityLog('setting.update')
  public async update(
    @Header('x-account-id') accountId: string,
    @Header('x-access-token') accessToken: string,
    @Body() body: SettingBody,
  ): Promise<WrappedResponse<SettingResult>> {
    const settingService = new SettingService();

    const setting = await settingService.update({ account_id: accountId as string }, body);

    const account = await AccountRepository.findFirst({
      where: {
        id: accountId as string,
      },
    });

    return {
      data: SettingSerializer(setting, account),
    };
  }
}
