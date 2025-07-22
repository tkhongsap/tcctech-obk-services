import dbClient from '../../db/client';

export default class FloorRepository {
  static create = dbClient.floor.create;
  static upsert = dbClient.floor.upsert;
  static findFirst = dbClient.floor.findFirst;
  static findMany = dbClient.floor.findMany;
}
