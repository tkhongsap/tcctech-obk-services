import dbClient from "../../db/client";

export default class StoresRepository {
  static create = dbClient.storeWhitelist.create;
  static createMany = dbClient.storeWhitelist.createMany;
  static update = dbClient.storeWhitelist.update;
  static findMany = dbClient.storeWhitelist.findMany;
  static findUnique = dbClient.storeWhitelist.findUnique;
  static updateMany = dbClient.storeWhitelist.updateMany;
  static delete = dbClient.storeWhitelist.delete;
}
