import dbClient from '../../db/client';

export default class TypeRepository {
  static create = dbClient.type.create;
  static findMany = dbClient.type.findMany;
  static createMany = dbClient.type.createMany;
  static update = dbClient.type.update;
  static delete = dbClient.type.delete;
}
