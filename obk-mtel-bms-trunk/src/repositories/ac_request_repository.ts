import dbClient from '../../db/client';

export default class ACRequestRepository {
  static create = dbClient.aCRequest.create;
  static createMany = dbClient.aCRequest.createMany;
  static upsert = dbClient.aCRequest.upsert;
  static update = dbClient.aCRequest.update;
  static findMany = dbClient.aCRequest.findMany;
  static findFirst = dbClient.aCRequest.findFirst;
  static updateMany = dbClient.aCRequest.updateMany;

  static defaultInclude = {
    floor: true,
    tower: true,
    requester: { include: { tenant_members: { include: { tenant: true } } } },
    ac_request_zones: { include: { ac_zone: true } },
  };
}
