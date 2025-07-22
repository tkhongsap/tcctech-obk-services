import dbClient from '../../db/client';

export default class TowerRepository {
  static create = dbClient.tower.create;
  static upsert = dbClient.tower.upsert;
  static findMany = dbClient.tower.findMany;
  static findFirst = dbClient.tower.findFirst;
}
