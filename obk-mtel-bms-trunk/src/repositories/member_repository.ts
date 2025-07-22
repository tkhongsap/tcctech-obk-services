import dbClient from '../../db/client';

export default class MemberRepository {
  static create = dbClient.member.create;
  static update = dbClient.member.update;
  static upsert = dbClient.member.upsert;
  static findMany = dbClient.member.findMany;
  static deleteMany = dbClient.member.deleteMany;
  static findFirst = dbClient.member.findFirst;
  static count = dbClient.member.count;

  static defaultInclude = {
    tenant_members: { include: { tenant: true } },
  };
}
