import dbClient from '../../db/client';

export default class TagOnCampaignRepository {
  static create = dbClient.tag_on_campaign.create;
}
