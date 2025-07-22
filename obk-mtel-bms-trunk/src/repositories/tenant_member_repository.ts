import dbClient from '../../db/client';

export default class TenantMemberRepository {
  static create = dbClient.tenantMember.create;
  static upsert = dbClient.tenantMember.upsert;
  static findMany = dbClient.tenantMember.findMany;
  static findFirst = dbClient.tenantMember.findFirst;
}
