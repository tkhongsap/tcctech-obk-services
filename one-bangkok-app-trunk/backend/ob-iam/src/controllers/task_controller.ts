import { DateTimeUtils, logging } from 'ob-common-lib/dist';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas, params } from '../openapi/interfaces/schemas';
import { AccountService, OtpService } from '../services';
import BaseController from './base_controller';
import { get } from 'lodash';

type taskNameMapType = Record<
  params['CreateTaskName'],
  params['CreateTaskName']
>;

const TASK_NAME_DICT: taskNameMapType = {
  delete_deactivate_account: 'delete_deactivate_account',
  delete_expired_otp: 'delete_expired_otp',
};
export default class TaskController extends BaseController {
  public async create(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['CreateTaskResponse']>,
  ) {
    const params = get(req, 'params');
    const taskName = get(params, 'task_name');

    logging.info(`start task ${taskName}`);
    let result = false;
    switch (taskName) {
      case TASK_NAME_DICT.delete_deactivate_account:
        result = await this.bulkDeleteAccount();
        break;
      case TASK_NAME_DICT.delete_expired_otp:
        result = await this.bulkDeleteExpiredOtp();
        break;
      default:
        break;
    }

    const response = {
      data: {
        result,
      },
    };

    return res.json(response);
  }

  private async bulkDeleteAccount(): Promise<boolean> {
    const accountService = new AccountService();
    const deletedDate = DateTimeUtils.getCurrentDateTime().subtract(
      1,
      'months',
    );

    const result = await accountService.bulkDelete({
      deleted_at: {
        lte: deletedDate.toISOString(),
      },
    });
    return result;
  }

  private async bulkDeleteExpiredOtp(): Promise<boolean> {
    const otpService = new OtpService();
    const deletedDate = DateTimeUtils.getCurrentDateTime();

    const result = await otpService.bulkDelete({
      expired_at: {
        lte: deletedDate.toISOString(),
      },
    });
    return result;
  }
}
