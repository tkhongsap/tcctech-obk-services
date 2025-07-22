import dbClient from '../../db/client';

export default class ZoneRepository {
  static create = dbClient.zone.create;
  static upsert = dbClient.zone.upsert;
  static findMany = dbClient.zone.findMany;
}
