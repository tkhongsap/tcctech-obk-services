import dbClient from '../../db/client';

export default class ShuttleBusMappingDetailsRepository {
  static upsert = dbClient.shuttleBusMappingDetails.upsert;
  static findMany = dbClient.shuttleBusMappingDetails.findMany;
  static delete = dbClient.shuttleBusMappingDetails.delete;
  static findFirst = dbClient.shuttleBusMappingDetails.findFirst;
}
