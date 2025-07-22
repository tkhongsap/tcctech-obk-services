import dbClient from '../../db/client';

export default class ParkingLotRepository {
  static create = dbClient.parkingLot.create;
  static findMany = dbClient.parkingLot.findMany;
  static upsert = dbClient.parkingLot.upsert;

  static defaultInclude = {
    parking_spaces: true,
    parking_floors: true,
  };
}
