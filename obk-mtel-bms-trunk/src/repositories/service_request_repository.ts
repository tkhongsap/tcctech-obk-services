import dbClient from '../../db/client';

export default class ServiceRequestRepository {
  static create = dbClient.serviceRequest.create;
  static createMany = dbClient.serviceRequest.createMany;
  static update = dbClient.serviceRequest.update;
  static findMany = dbClient.serviceRequest.findMany;
  static findFirst = dbClient.serviceRequest.findFirst;
  static updateMany = dbClient.serviceRequest.updateMany;

  static defaultInclude = {
    requester: { include: { tenant_members: { include: { tenant: true } } } },
    issue_type: true,
    tower: true,
    floor: true,
  };
}
