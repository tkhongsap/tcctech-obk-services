import dbClient from '../../db/client';

export class syncRoleLogRepository {
  static create = dbClient.syncRoleLog.create;
  static update = dbClient.syncRoleLog.update;
  static findUnique = dbClient.syncRoleLog.findUnique;
  static findMany = dbClient.syncRoleLog.findMany;
  static updateMany = dbClient.syncRoleLog.updateMany;
  static createMany = dbClient.syncRoleLog.createMany;
}
