import { get } from 'lodash';
import { logging } from 'ob-common-lib/dist';
import { CampaignService } from '../services/campaign_service';
import BaseController from './base_controller';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas } from '../openapi/interfaces/schemas';

export default class CampaignController extends BaseController {
  public async start(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['SendingCampaignResponse']>,
  ) {
    logging.info('start call sending campaign');

    const params = get(req, 'params');
    const campaignId = get(params, 'id');

    const campaignService = new CampaignService();
    await campaignService.createAndSendingMessage(campaignId);

    res.json({
      data: {
        result: true,
      },
    });
  }

  public async create(
    req: TypedRequest<schemas['CreateCampaignRequest']>,
    res: TypedResponse<schemas['CreateCampaignResponse']>,
  ) {
    logging.info('start call create campaign');

    const { message_template_id, name } = req.body;
    const campaignService = new CampaignService();

    await campaignService.create({
      name,
      message_template_id,
    });

    res.json({
      data: {
        result: true,
      },
    });
  }
}
