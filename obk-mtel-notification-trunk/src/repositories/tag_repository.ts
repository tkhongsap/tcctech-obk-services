import dbClient from '../../db/client';

export default class TagRepository {
  static findMany = dbClient.tag.findMany;
  static create = dbClient.tag.create;
  static createMany = dbClient.tag.createMany;
  static findFirst = dbClient.tag.findFirst;
  static update = dbClient.tag.update;
  static delete = dbClient.tag.delete;
  static count = dbClient.tag.count;
}
