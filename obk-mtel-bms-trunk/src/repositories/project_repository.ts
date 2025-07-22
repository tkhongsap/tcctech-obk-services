import dbClient from '../../db/client';

export default class ProjectRepository {
  static create = dbClient.project.create;
  static createMany = dbClient.project.createMany;
  static upsert = dbClient.project.upsert;
  static findMany = dbClient.project.findMany;
  static findFirst = dbClient.project.findFirst;
}
