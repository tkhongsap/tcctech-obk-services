import dbClient from '../../db/client';

export default class ReceiptRedeemRepository {
  static create = dbClient.receiptRedeem.create;
  static createMany = dbClient.receiptRedeem.createMany;
  static update = dbClient.receiptRedeem.update;
  static findMany = dbClient.receiptRedeem.findMany;
  static findUnique = dbClient.receiptRedeem.findUnique;
  static updateMany = dbClient.receiptRedeem.updateMany;
  static deleteMany = dbClient.receiptRedeem.deleteMany;
}
