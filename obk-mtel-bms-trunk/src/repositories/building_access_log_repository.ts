import dbClient from '../../db/client';

export default class BuildingAccessLogRepository {
  static create = dbClient.buildingAccessgLog.create;
  static createMany = dbClient.buildingAccessgLog.createMany;
  static findMany = dbClient.buildingAccessgLog.findMany;
  static findFirst = dbClient.buildingAccessgLog.findFirst;
  static count = dbClient.buildingAccessgLog.count;
}
