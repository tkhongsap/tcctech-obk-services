import { Controller, Post, OperationId, Route, Path, Body, Header } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { CampaignBody, CreateCampaignResult } from './campaign_controller.interfaces';
import CampaignRepository from '../repositories/campaign_repository';
import { CampaignService } from '../services/campaign_service';
@Route('campaign')
export class Campaign extends Controller {
  @Post('')
  @OperationId('campaign.create')
  public async create(@Body() body: CampaignBody): Promise<WrappedResponse<CreateCampaignResult>> {
    const { message_template_id, name, scheduled_at } = body;
    const CampaignData = await CampaignRepository.create({
      data: {
        name: name,
        scheduled_at: scheduled_at,
        message_template: {
          connect: { id: message_template_id },
        },
      },
    });
    this.setStatus(200);

    return { data: { data: { result: true } } };
  }

  @OperationId('campaign.start')
  @Post('{id}/start')
  public async start(
    @Path() id: string,
    @Header('accept-language') language: string,
  ): Promise<WrappedResponse<CreateCampaignResult>> {
    const campaignService = new CampaignService();
    await campaignService.createAndSendingMessage(id, language);
    this.setStatus(200);
    return { data: { data: { result: true } } };
  }
}
