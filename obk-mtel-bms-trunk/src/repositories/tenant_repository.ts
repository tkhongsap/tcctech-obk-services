import dbClient from '../../db/client';

export default class TenantRepository {
  static create = dbClient.tenant.create;
  static upsert = dbClient.tenant.upsert;
  static findMany = dbClient.tenant.findMany;
  static findFirst = dbClient.tenant.findFirst;
}
