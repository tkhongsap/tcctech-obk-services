import {
  Controller,
  Get,
  Route,
  OperationId,
  SuccessResponse,
  Post,
  Body,
} from "tsoa";
import { UpsertCampaign } from "./campaign_controller.interface";
import { upsertCampaignSchema } from "../validators/campaign";
import { CustomError } from "../middlewares/error";
import { OBError } from "../utils/error_spec";
import campaignService from "../services/campaign";

@Route("campaign")
export class CampaignController extends Controller {
  @Get("")
  @OperationId("campaign.index")
  @SuccessResponse(200)
  public async campaignIndex() {
    const campaigns = await campaignService.getCampaigns();
    return campaigns;
  }

  @Post("")
  @OperationId("campaign.upsert")
  @SuccessResponse(200)
  public async campaignUpsert(@Body() body: UpsertCampaign) {
    const result = await upsertCampaignSchema.isValid(body.data);
    if (!result) {
      throw new CustomError(OBError.CF_CP_001);
    }
    const updatedCampaign = await campaignService.upsertCampaign(body);
    return updatedCampaign;
  }
}
