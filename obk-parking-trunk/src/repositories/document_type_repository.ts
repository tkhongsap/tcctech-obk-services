import dbClient from "../../db/client";

export default class DocumentTypeRepository {
  static create = dbClient.documentType.create;
  static createMany = dbClient.documentType.createMany;
  static update = dbClient.documentType.update;
  static findMany = dbClient.documentType.findMany;
  static findFirst = dbClient.documentType.findFirst;
  static findUnique = dbClient.documentType.findUnique;
  static updateMany = dbClient.documentType.updateMany;
  static delete = dbClient.documentType.delete;
}
