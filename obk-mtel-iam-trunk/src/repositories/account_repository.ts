import { dbClient, roDBClient } from '../../db';

export default class AccountRepository {
  static create = dbClient.account.create;
  static upsert = dbClient.account.upsert;
  static findMany = roDBClient.account.findMany;
  static findFirst = roDBClient.account.findFirst;
  static update = dbClient.account.update;
  static deleteMany = dbClient.account.deleteMany;
  static count = roDBClient.account.count;
}
