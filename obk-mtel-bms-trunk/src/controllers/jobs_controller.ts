import { Body, Controller, Header, Middlewares, Path, Post, Route } from 'tsoa';
import logging from '../utils/logging';
import { PaymentService } from '../services';
import { Authorizer } from '../middlewares/authorizer';

enum JobName {
  CancelExpiredPayments = 'cancel_expired_payments',
}

@Route('jobs')
@Middlewares(
  Authorizer({
    resource: 'job:execution',
    action: 'create',
  }),
)
export class JobExcecutionsController extends Controller {
  @Post(':name/execute')
  public async execute(
    @Header('x-permissions') header: string,
    @Path('name') name: string,
    @Body() body?: Record<string, any>,
  ): Promise<void> {
    logging.info(`Executing job ${name} with payload: `, body);

    switch (name) {
      case JobName.CancelExpiredPayments:
        const service = new PaymentService();
        await service.cancelExpiredPayments();
        break;
      default:
        throw new Error('Job not found');
    }

    logging.info(`Job ${name} executed successfully`);
    this.setStatus(200);
  }
}
