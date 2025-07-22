import { Controller, OperationId, Route, Post, Path } from 'tsoa';

import { TaskName, TaskPath, TaskResult } from './task_controller.interfaces';
import logging from '../utils/logging';
import { WrappedResponse } from './base_controller.interfaces';
import TaskService from '../services/task_service';
import { WebhookService } from '../services/v2';
const TASK_NAME_DICT: TaskPath = {
  delete_bus_position: 'delete_bus_position',
  process_bus_position: 'process_bus_position'
};
@Route('task')
export class TaskController extends Controller {
  @Post('{task_name}')
  @OperationId('task.index')
  public async index(@Path() task_name: TaskName): Promise<WrappedResponse<TaskResult>> {
    logging.info(`start task ${task_name}`);
    let result = false;
    const taskService = new TaskService();
    const webhookService = new WebhookService();
    switch (task_name) {
      case TASK_NAME_DICT.delete_bus_position:
        result = await taskService.bulkDeleteShuttleBusPosition();
        break;
      case TASK_NAME_DICT.process_bus_position:
        result = await webhookService.processPosition();
      default:
        break;
    }

    return {
      data: { result: result },
    };
  }
}
