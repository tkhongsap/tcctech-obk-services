import dbClient from '../../db/client';

export default class ParkingDetailsRepository {
  static create = dbClient.parkingDetail.create;
  static createMany = dbClient.parkingDetail.createMany;
  static update = dbClient.parkingDetail.update;
  static findMany = dbClient.parkingDetail.findMany;
  static findUnique = dbClient.parkingDetail.findUnique;
  static updateMany = dbClient.parkingDetail.updateMany;
  static count = dbClient.parkingDetail.count;
}
