import { Route, Post, Body, Controller, Middlewares } from 'tsoa';

import { WebhookCreateBody } from './webhook_controller_interface';
import { Authorizer } from '../../../../middlewares/authorizer';
import { WebhookService } from '../../../../services/v2';

@Route('v2/integrations/montri/webhook')
@Middlewares(
  Authorizer({
    resourceType: 'montri',
    action: '*',
  }),
)
export class WebhookControllerV2 extends Controller {
  @Post()
  public async create(@Body() body: WebhookCreateBody): Promise<void> {
    const webhookService = new WebhookService();

    await webhookService.handle(body);

    this.setStatus(200);
  }
}
