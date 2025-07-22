import dbClient from "../../db/client";

export default class CampaignRepository {
  static create = dbClient.campaign.create;
  static createMany = dbClient.campaign.createMany;
  static upsert = dbClient.campaign.upsert;
  static update = dbClient.campaign.update;
  static findMany = dbClient.campaign.findMany;
  static findFirst = dbClient.campaign.findFirst;
  static findUnique = dbClient.campaign.findUnique;
  static updateMany = dbClient.campaign.updateMany;
  static delete = dbClient.campaign.delete;
}
