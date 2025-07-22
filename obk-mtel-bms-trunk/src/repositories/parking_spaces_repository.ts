import dbClient from '../../db/client';

export default class ParkingSpaceRepository {
  static create = dbClient.parkingSpace.create;
  static findMany = dbClient.parkingSpace.findMany;
  static upsert = dbClient.parkingSpace.upsert;
  static createMany = dbClient.parkingSpace.createMany;
  static update = dbClient.parkingSpace.update;
  static updateMany = dbClient.parkingSpace.updateMany;
  static findFirst = dbClient.parkingSpace.findFirst;
}
