import dbClient from '../../db/client';

export default class AutoMessageRepository {
  static findMany = dbClient.auto_message.findMany;
  static create = dbClient.auto_message.create;
  static createMany = dbClient.auto_message.createMany;
  static findFirst = dbClient.auto_message.findFirst;
}
