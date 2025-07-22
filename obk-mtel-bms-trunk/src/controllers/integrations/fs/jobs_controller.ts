/* eslint-disable @typescript-eslint/no-unused-vars */
import { Post, Body, Controller, Route } from 'tsoa';
import { get } from 'lodash';
import { JobService } from '../../../services';
import { SyncBody, SyncResponse, SyncResult } from './jobs_controller_interface';
@Route('integrations/fs/job')
export class JobsController extends Controller {
  @Post('sync')
  async sync(@Body() body: SyncBody): Promise<SyncResponse> {
    const jobName = get(body, 'name');
    const jobService = new JobService();

    const result = await jobService.sync(jobName);

    this.setStatus(200);
    return {
      data: result as SyncResult,
    };
  }

  @Post('auto_sync')
  async autoSync(): Promise<SyncResponse> {
    const jobService = new JobService();
    const result = await jobService.autoSync();

    this.setStatus(200);
    return {
      data: result as SyncResult,
    };
  }
}
