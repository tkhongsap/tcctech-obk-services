import dbClient from '../../db/client';

export default class SpotTypeRepository {
  static upsert = dbClient.spotType.upsert;
  static findMany = dbClient.spotType.findMany;
}
