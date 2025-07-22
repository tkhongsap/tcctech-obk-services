import { dbClient, roDBClient } from '../../db';

export default class TokenRepository {
  static update = dbClient.token.update;
  static findFirst = roDBClient.token.findFirst;
  static updateMany = dbClient.token.updateMany;
  static create = dbClient.token.create;
  static createMany = dbClient.token.createMany;
}
