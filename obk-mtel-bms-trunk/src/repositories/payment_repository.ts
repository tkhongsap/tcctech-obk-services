import dbClient from '../../db/client';

export default class PaymentRepository {
  static create = dbClient.payment.create;
  static update = dbClient.payment.update;
  static findFirst = dbClient.payment.findFirst;
  static findMany = dbClient.payment.findMany;
  static updateMany = dbClient.payment.updateMany;
}
