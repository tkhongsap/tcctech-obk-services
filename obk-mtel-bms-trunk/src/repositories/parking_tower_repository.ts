import dbClient from '../../db/client';

export default class ParkingTowerRepository {
  static create = dbClient.parkingTower.create;
  static upsert = dbClient.parkingTower.upsert;
  static findMany = dbClient.parkingTower.findMany;
  static findFirst = dbClient.parkingTower.findFirst;
}
