import dbClient from '../../db/client';

export default class DocumentRepository {
  static findMany = dbClient.document.findMany;
  static create = dbClient.document.create;
  static update = dbClient.document.update;
  static findFirst = dbClient.document.findFirst;
  static delete = dbClient.document.delete;
}
