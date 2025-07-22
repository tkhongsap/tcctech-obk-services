export interface CampaignBody {
  message_template_id: string;
  scheduled_at: string;
  name: string;
}
interface CampaignDataResult {
  result: boolean;
}
export interface CreateCampaignResult {
  data: CampaignDataResult;
}
