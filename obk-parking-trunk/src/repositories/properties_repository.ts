import dbClient from "../../db/client";

export default class PropertyRepository {
  static create = dbClient.property.create;
  static findFirst = dbClient.property.findFirst;
  static findMany = dbClient.property.findMany;
  static findUnique = dbClient.property.findUnique;
  static createMany = dbClient.property.createMany;
  static update = dbClient.property.update;
  static delete = dbClient.property.delete;
}
