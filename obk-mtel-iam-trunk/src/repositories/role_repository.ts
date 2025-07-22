import { dbClient, roDBClient } from '../../db';

export default class RoleRepository {
  static create = dbClient.role.create;
  static upsert = dbClient.role.upsert;
  static update = dbClient.role.update;
  static findMany = roDBClient.role.findMany;
  static findFirst = roDBClient.role.findFirst;
  static delete = dbClient.role.delete;
}
