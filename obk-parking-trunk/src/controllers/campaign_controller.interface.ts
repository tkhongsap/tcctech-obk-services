import { Prisma } from "../../db/client";

export type CampaignResponse = {
  id: string;
  sequence: number;
  price_min: number;
  price_max: number | null;
  redeem_hour: number;
  rate_code: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type CampaignSequenceResponse = {
  data: {
    1: CampaignResponse;
    2: CampaignResponse;
    3: CampaignResponse;
    4: CampaignResponse;
  };
  created_at: Date | string;
  updated_at: Date | string;
  updated_by: string | null;
};

type BaseCampaignBody = {
  id?: string;
  price_min: number;
  redeem_hour: number;
  rate_code: string;
};

type CampaignBody = BaseCampaignBody & {
  price_max: number;
};

type FinalCampaignBody = BaseCampaignBody & {
  price_max?: number;
};

export type UpsertCampaignBody = {
  1: CampaignBody;
  2: CampaignBody;
  3: CampaignBody;
  4: FinalCampaignBody;
};

export type UpsertCampaign = {
  data: UpsertCampaignBody;
  updated_by?: string;
};
