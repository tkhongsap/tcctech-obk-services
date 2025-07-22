import { dbClient, roDBClient } from '../../db';

export default class AttachedPermissionRepository {
  static create = dbClient.attached_permission.create;
  static upsert = dbClient.attached_permission.upsert;
  static findMany = roDBClient.attached_permission.findMany;
  static findFirst = roDBClient.attached_permission.findFirst;
  static update = dbClient.attached_permission.update;
}
