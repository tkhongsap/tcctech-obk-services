import { Route, Post, Body, Controller, Middlewares } from 'tsoa';

import { WebhookCreateBody } from './webhook_controller_interface';
import { WebhookService } from '../../../services';
import { Authorizer } from '../../../middlewares/authorizer';

@Route('integrations/montri/webhook')
@Middlewares(
  Authorizer({
    resourceType: 'montri',
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
