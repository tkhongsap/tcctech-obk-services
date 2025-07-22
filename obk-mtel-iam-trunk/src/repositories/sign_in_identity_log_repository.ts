import { dbClient, roDBClient } from '../../db';

export default class SignInIdentityLogRepository {
  static create = dbClient.sign_in_identity_log.create;
  static upsert = dbClient.sign_in_identity_log.upsert;
  static update = dbClient.sign_in_identity_log.update;
  static findMany = roDBClient.sign_in_identity_log.findMany;
  static findFirst = roDBClient.sign_in_identity_log.findFirst;
  static delete = dbClient.sign_in_identity_log.delete;
}
