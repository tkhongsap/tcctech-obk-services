import dbClient from '../../db/client';

export default class MessageTransactionRepository {
  static findMany = dbClient.message_transaction.findMany;
  static create = dbClient.message_transaction.create;
  static createMany = dbClient.message_transaction.createMany;
  static findFirst = dbClient.message_transaction.findFirst;
}
