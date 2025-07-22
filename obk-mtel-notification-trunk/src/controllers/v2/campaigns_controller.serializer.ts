import { map } from 'lodash';
import { Prisma } from '../../../db/client/';
import { CampaignData, TransactionStatusCampaign } from './index.interface';
import { messageTemplateSerializer } from './message_templates_controller.serializer';

export function campaignSerializer(
  campaign: Prisma.campaignGetPayload<{
    include: {
      message_template: { include: { message_category: true } };
      tag_on_campaigns: { include: { tag: true } };
      campaign_target_groups: { include: { target_group: true } };
      transaction_status_campaign: true;
    };
  }>,
): CampaignData {
  return {
    id: campaign.id,
    name: campaign.name,
    push_notification_data: campaign.push_notification_data,
    status: campaign.status,
    message_template_id: campaign.message_template_id,
    submitted_at: campaign.submitted_at?.toISOString(),
    scheduled_at: campaign.scheduled_at?.toISOString(),
    created_at: campaign.created_at.toISOString(),
    updated_at: campaign.updated_at.toISOString(),
    updated_by: campaign.updated_by,
    submitted_by: campaign.submitted_by,
    updated_by_name: campaign.updated_by_name,
    submitted_by_name: campaign.created_by_name,
    message_template: campaign.message_template ? messageTemplateSerializer(campaign.message_template) : null,
    target_groups: map(campaign.campaign_target_groups, (campaignTargetGroup) => {
      return {
        id: campaignTargetGroup.target_group_id,
        name: campaignTargetGroup.target_group.name,
      };
    }),
    tags: map(campaign.tag_on_campaigns, (tagOnCampaign) => {
      return {
        id: tagOnCampaign.tag_id,
        name: tagOnCampaign.tag.name,
      };
    }),
    note: campaign.note,
    created_by: campaign.created_by,
    created_by_name: campaign.created_by_name,
    transaction_status: mapTransactionStatus(campaign.transaction_status_campaign),
  };
}

function mapTransactionStatus(
  transactionStatusCampaigns: Prisma.transaction_status_campaignGetPayload<true>[],
): TransactionStatusCampaign[] {
  return map(transactionStatusCampaigns, (transactionStatusCampaign) => {
    return {
      id: transactionStatusCampaign.id,
      campaign_id: transactionStatusCampaign.campaign_id,
      from_status: transactionStatusCampaign.from_status,
      to_status: transactionStatusCampaign.to_status,
      created_at: transactionStatusCampaign.created_at.toISOString(),
      created_by: transactionStatusCampaign.created_by,
      created_by_name: transactionStatusCampaign.created_by_name,
    };
  });
}
