import { dbClient, roDBClient } from '../../db';

export default class ActivityLogRepository {
  static create = dbClient.activityLog.create;
  static update = dbClient.activityLog.update;
  static findMany = roDBClient.activityLog.findMany;
  static findFirst = roDBClient.activityLog.findFirst;
  static count = roDBClient.activityLog.count;
}
