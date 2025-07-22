import { Controller, OperationId, Route, Post, Path } from 'tsoa';
import { WrappedResponse } from './index.interface';

import { TaskName, TaskPath, TaskResult } from './task_controller.interfaces';
import logging from '../utils/logging';
import TaskService from '../services/tesk_service';
const TASK_NAME_DICT: TaskPath = {
  delete_deactivate_account: 'delete_deactivate_account',
  delete_expired_otp: 'delete_expired_otp',
};
@Route('task')
export class TaskController extends Controller {
  @Post('{task_name}')
  @OperationId('task.index')
  public async index(@Path() task_name: TaskName): Promise<WrappedResponse<TaskResult>> {
    logging.info(`start task ${task_name}`);
    let result = false;
    const taskService = new TaskService();
    switch (task_name) {
      case TASK_NAME_DICT.delete_deactivate_account:
        result = await taskService.bulkDeleteAccount();
        break;
      case TASK_NAME_DICT.delete_expired_otp:
        result = await taskService.bulkDeleteExpiredOtp();
        break;
      default:
        break;
    }

    return {
      data: { result: result },
    };
  }
}
