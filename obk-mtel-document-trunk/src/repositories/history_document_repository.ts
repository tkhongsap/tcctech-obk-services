import dbClient from '../../db/client';

export default class HistoryDocumentRepository {
  static findMany = dbClient.history_document.findMany;
  static create = dbClient.history_document.create;
  static findFirst = dbClient.history_document.findFirst;
}
