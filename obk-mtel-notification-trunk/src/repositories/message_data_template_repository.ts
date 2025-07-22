import dbClient from '../../db/client';

export default class MessageDataTemplateRepository {
  static findMany = dbClient.message_data_template.findMany;
  static create = dbClient.message_data_template.create;
  static createMany = dbClient.message_data_template.createMany;
  static findFirst = dbClient.message_data_template.findFirst;
}
