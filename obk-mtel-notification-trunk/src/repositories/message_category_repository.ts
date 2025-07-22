import dbClient from '../../db/client';

export default class MessageCategoryRepository {
  static findMany = dbClient.message_category.findMany;
  static create = dbClient.message_category.create;
  static createMany = dbClient.message_category.createMany;
  static findFirst = dbClient.message_category.findFirst;
  static update = dbClient.message_category.update;
  static delete = dbClient.message_category.delete;
  static count = dbClient.message_category.count;
}
