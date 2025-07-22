import dbClient from '../../db/client';

export default class HistoryCategoryRepository {
  static findMany = dbClient.history_category.findMany;
  static create = dbClient.history_category.create;
  static findFirst = dbClient.history_category.findFirst;
  static count = dbClient.history_category.count;
}
