import dbClient from '../../db/client';

export default class VisitorTokenRepository {
  static create = dbClient.visitorToken.create;
  static findMany = dbClient.visitorToken.findMany;
}
