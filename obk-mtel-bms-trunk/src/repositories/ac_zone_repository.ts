import dbClient from '../../db/client';

export default class ACZoneRepository {
  static create = dbClient.aCZone.create;
  static upsert = dbClient.aCZone.upsert;
  static findMany = dbClient.aCZone.findMany;
  static findFirst = dbClient.aCZone.findFirst;
}
