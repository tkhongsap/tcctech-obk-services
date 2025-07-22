import { dbClient, roDBClient } from '../../db';

export default class ExternalIdentityRepository {
  static create = dbClient.external_identity.create;
  static upsert = dbClient.external_identity.upsert;
  static findMany = roDBClient.external_identity.findMany;
  static findFirst = roDBClient.external_identity.findFirst;
  static deleteMany = dbClient.external_identity.deleteMany;
  static update = dbClient.external_identity.update;
}
