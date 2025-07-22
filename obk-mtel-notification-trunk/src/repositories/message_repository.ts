import dbClient from '../../db/client';

export default class MessageRepository {
  static findMany = dbClient.message.findMany;
  static create = dbClient.message.create;
  static createMany = dbClient.message.createMany;
  static findFirst = dbClient.message.findFirst;
  static count = dbClient.message.count;
  static update = dbClient.message.update;
  static updateMany = dbClient.message.updateMany;
  static delete = dbClient.message.delete;
}
