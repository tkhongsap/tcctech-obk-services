import dbClient from '../../db/client';

export default class ActivityLogRepository {
  static create = dbClient.activityLog.create;
  static update = dbClient.activityLog.update;
}
