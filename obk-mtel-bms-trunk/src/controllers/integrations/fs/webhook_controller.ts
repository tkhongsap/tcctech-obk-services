import { Route, Post, Body, Controller, Middlewares } from 'tsoa';

import { Authorizer } from '../../../middlewares/authorizer';
import { WebhookCreateBody } from './webhook_controller_interface';
import { WebhookService } from '../../../services';

@Route('integrations/fs/webhook')
@Middlewares(
  Authorizer({
    resource: 'fs',
    action: '*',
  }),
)
export class WebhookController extends Controller {
  @Post()
  public async create(@Body() body: WebhookCreateBody): Promise<void> {
    const webhookService = new WebhookService();

    await webhookService.handle(body);

    this.setStatus(200);
  }
}
