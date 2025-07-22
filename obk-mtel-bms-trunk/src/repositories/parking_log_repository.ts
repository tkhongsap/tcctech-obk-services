import dbClient from '../../db/client';

export default class ParkingLogRepository {
  static create = dbClient.parkingLog.create;
  static createMany = dbClient.parkingLog.createMany;
  static findFirst = dbClient.parkingLog.findFirst;
  static findMany = dbClient.parkingLog.findMany;
  static count = dbClient.parkingLog.count;
}
