import { Prisma, campaign, transaction_status_campaign } from '../../../db/client/';
import { TargetGroupBody } from '../../services/interfaces/target_group_interface';
import { BaseIndexQuery } from '../base_controller.interfaces';
import { MessageTemplateData, TranslateableContentData } from './index.interface';

type TagData = {
  id: string;
  name: string;
};

type TargetGroupData = {
  id: string;
  name: string;
};

type CsvData = {
  account_id_group: {
    account_id: string;
  }[];
  name: string;
};

// export type CampaignsIndexResponseData = CampaignData[];
// export type CampaignsCreateResponseData = CampaignData;

export type EnumsCampaignStatus =
  | 'DRAFT'
  | 'WATING_FOR_APPROVAL'
  | 'APPROVED_SCHEDULED'
  | 'APPROVED_SENT'
  | 'REJECTED'
  | 'RESIDENTIAL'
  | 'RESIDENTIAL_SENT';

export interface CampaignData
  extends Omit<campaign, 'created_at' | 'updated_at' | 'scheduled_at' | 'status' | 'submitted_at' | 'note'> {
  status: EnumsCampaignStatus;
  submitted_at?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
  push_notification_data: Prisma.JsonValue;
  message_template: MessageTemplateData | null;
  target_groups: TargetGroupData[] | CsvData[];
  tags: TagData[];
  note?: string | null;
  transaction_status?: TransactionStatusCampaign[];
}

export interface CampaignsIndexQuery extends BaseIndexQuery {
  'name.contains'?: string;
  status?: string;
  'message_template.message_category_id'?: string;
  'tag_on_campaigns.some.id'?: string;
  'tag_on_campaigns.some.tag_id'?: string;
}

export interface PushNotificationData {
  title: TranslateableContentData;
  message: TranslateableContentData;
}

export interface CampaignsCreateRequestBody {
  name?: string;
  scheduled_at?: string;
  push_notification_data?: PushNotificationData;
  message_template?: Partial<Omit<MessageTemplateData, 'id' | 'created_at' | 'updated_at'>>;
  message_category_id?: string;
  target_group_id?: string;
  tags?: string[];
  updated_by?: string;
  updated_by_name?: string;
  submitted_by?: string;
  submitted_by_name?: string;
  created_by?: string;
  created_by_name?: string;
  targetGroupDetails?: TargetGroupBody;
}

export interface CampaignsUpdateRequestBody {
  name?: string;
  scheduled_at?: string;
  push_notification_data?: PushNotificationData;
  message_template?: Partial<Omit<MessageTemplateData, 'id' | 'created_at' | 'updated_at'>>;
  message_category_id?: string;
  target_group_id?: string;
  tags?: string[];
}

export interface TransactionStatusCampaign
  extends Omit<transaction_status_campaign, 'created_at' | 'from_status' | 'to_status'> {
  from_status: EnumsCampaignStatus;
  to_status: EnumsCampaignStatus;
  created_at: string;
}
