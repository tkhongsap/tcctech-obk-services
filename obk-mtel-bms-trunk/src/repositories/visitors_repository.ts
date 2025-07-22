import dbClient from '../../db/client';

export default class VisitorRepository {
  static findFirst = dbClient.visitor.findFirst;
  static create = dbClient.visitor.create;
  static delete = dbClient.visitor.delete;

  static defaultInclude = {
    inviter: { include: { tenant_members: true, parking_tickets: true } },
  };
}
