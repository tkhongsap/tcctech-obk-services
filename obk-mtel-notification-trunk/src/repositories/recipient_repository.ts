import dbClient from '../../db/client';

export default class RecipientRepository {
  static findMany = dbClient.recipient.findMany;
  static create = dbClient.recipient.create;
  static createMany = dbClient.recipient.createMany;
  static findFirst = dbClient.recipient.findFirst;
  static delete = dbClient.recipient.delete;
  static update = dbClient.recipient.update;
}
