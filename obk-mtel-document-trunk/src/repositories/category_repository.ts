import dbClient from '../../db/client';

export default class CategoryRepository {
  static findMany = dbClient.category.findMany;
  static findFirst = dbClient.category.findFirst;
  static create = dbClient.category.create;
  static delete = dbClient.category.delete;
  static update = dbClient.category.update;
}
