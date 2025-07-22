import dbClient from '../../db/client';

export default class LocationRepository {
  static create = dbClient.location.create;
  static upsert = dbClient.location.upsert;
  static findMany = dbClient.location.findMany;
  static findFirst = dbClient.location.findFirst;
}
