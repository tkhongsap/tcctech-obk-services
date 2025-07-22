import dbClient from '../../db/client';

export default class ReceiptRepository {
  static create = dbClient.receipt.create;
  static createMany = dbClient.receipt.createMany;
  static update = dbClient.receipt.update;
  static findMany = dbClient.receipt.findMany;
  static findFirst = dbClient.receipt.findFirst;
  static findUnique = dbClient.receipt.findUnique;
  static updateMany = dbClient.receipt.updateMany;
  static count = dbClient.receipt.count;
}
