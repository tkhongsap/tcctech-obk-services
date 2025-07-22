import dbClient from '../../db/client';

export default class ParkingFloorRepository {
  static upsert = dbClient.parkingFloor.upsert;
  static findMany = dbClient.parkingFloor.findMany;
  static create = dbClient.parkingFloor.create;
  static findFirst = dbClient.parkingFloor.findFirst;
  static delete = dbClient.parkingFloor.delete;
}
