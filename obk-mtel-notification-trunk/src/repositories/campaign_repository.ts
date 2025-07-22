import dbClient from '../../db/client';

export default class CampaignRepository {
  static findMany = dbClient.campaign.findMany;
  static create = dbClient.campaign.create;
  static update = dbClient.campaign.update;
  static findFirst = dbClient.campaign.findFirst;
  static delete = dbClient.campaign.delete;
  static count = dbClient.campaign.count;

  static defaultInclude = {
    message_template: {
      include: {
        message_category: true,
      },
    },
    tag_on_campaigns: {
      include: {
        tag: true,
      },
    },
    campaign_target_groups: {
      include: {
        target_group: true,
      },
    },
    transaction_status_campaign: true,
  };
}
