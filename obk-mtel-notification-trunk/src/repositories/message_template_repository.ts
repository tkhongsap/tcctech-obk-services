import dbClient from '../../db/client';

export default class MessageTemplateRepository {
  static findMany = dbClient.message_template.findMany;
  static create = dbClient.message_template.create;
  static createMany = dbClient.message_template.createMany;
  static findFirst = dbClient.message_template.findFirst;
  static update = dbClient.message_template.update;
  static delete = dbClient.message_template.delete;
  static count = dbClient.message_template.count;
}
