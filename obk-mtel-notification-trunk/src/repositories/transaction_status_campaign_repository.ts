import dbClient from '../../db/client';

export default class TransactionStatusCampaignRepository {
  static findMany = dbClient.transaction_status_campaign.findMany;
  static create = dbClient.transaction_status_campaign.create;
  static findFirst = dbClient.transaction_status_campaign.findFirst;
}
