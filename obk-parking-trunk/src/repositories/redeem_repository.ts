import dbClient from '../../db/client';

export default class RedeemRepository {
  static create = dbClient.redeem.create;
  static createMany = dbClient.redeem.createMany;
  static update = dbClient.redeem.update;
  static findMany = dbClient.redeem.findMany;
  static findUnique = dbClient.redeem.findUnique;
  static updateMany = dbClient.redeem.updateMany;
  static deleteMany = dbClient.redeem.deleteMany;
}
