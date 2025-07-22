import {
  CampaignResponse,
  CampaignSequenceResponse,
  UpsertCampaign,
} from "../../controllers/campaign_controller.interface";
import CampaignRepository from "../../repositories/campaign_repository";
import { prisma } from "../../../tests/helpers/db";
import { CustomError } from "../../middlewares/error";
import { OBError } from "../../utils/error_spec";

export class CampaignService {
  public async getCampaigns(): Promise<CampaignSequenceResponse> {
    const campaigns = await CampaignRepository.findMany();
    const campaignSequence = {} as CampaignSequenceResponse["data"];

    if (!campaigns.length) {
      throw new CustomError(OBError.CF_CP_002);
    }

    campaigns?.forEach((item) => {
      const sequence = item.sequence as keyof CampaignSequenceResponse["data"];
      campaignSequence[sequence] = item;
    });

    return {
      data: campaignSequence,
      created_at: campaigns[0].created_at || "",
      updated_at: campaigns[0].updated_at || "",
      updated_by: campaigns[0].updated_by || "",
    };
  }

  public async upsertCampaign(
    body: UpsertCampaign
  ): Promise<CampaignResponse[]> {
    const { data, updated_by } = body;
    const newCampaign = prisma.$transaction(
      Object.entries(data).map(([key, value], index) =>
        CampaignRepository.upsert({
          where: {
            sequence: parseInt(key) || index + 1,
          },
          update: {
            price_min: value.price_min,
            price_max: value.price_max,
            redeem_hour: value.redeem_hour,
            rate_code: value.rate_code,
            ...(updated_by && { updated_by }),
          },
          create: {
            sequence: parseInt(key) || index + 1,
            price_min: value.price_min,
            price_max: value.price_max,
            redeem_hour: value.redeem_hour,
            rate_code: value.rate_code,
            ...(updated_by && { updated_by }),
          },
        })
      )
    );
    return newCampaign;
  }

  public async getRateCode(price: number): Promise<string | null> {
    const matchCampaignRange = await CampaignRepository.findFirst({
      where: {
        price_min: { lte: price },
        AND: [
          {
            OR: [{ price_max: { gte: price } }, { price_max: null }],
          },
        ],
      },
      orderBy: {
        sequence: "asc",
      },
    });
    if (!matchCampaignRange) {
      return null;
    }
    return matchCampaignRange.rate_code;
  }
}

const campaignService = new CampaignService();
export default campaignService;
