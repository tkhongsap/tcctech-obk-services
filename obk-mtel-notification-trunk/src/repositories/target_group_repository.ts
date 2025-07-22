import dbClient from '../../db/client';

export default class TargetGroupRepository {
  static findMany = dbClient.target_group.findMany;
  static create = dbClient.target_group.create;
  static findFirst = dbClient.target_group.findFirst;
  static upsert = dbClient.target_group.upsert;
  static delete = dbClient.target_group.delete;
  static deleteMany = dbClient.target_group.deleteMany;
}
