import dbClient from '../../db/client';

export default class ItemRepository {
  static create = dbClient.item.create;
  static createMany = dbClient.item.createMany;
  static update = dbClient.item.update;
  static findMany = dbClient.item.findMany;
  static findUnique = dbClient.item.findUnique;
  static updateMany = dbClient.item.updateMany;
  static deleteMany = dbClient.item.deleteMany;
}
