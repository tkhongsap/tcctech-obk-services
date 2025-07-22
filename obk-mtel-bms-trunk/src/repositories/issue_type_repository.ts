import dbClient from '../../db/client';

export default class IssueTypeRepository {
  static findMany = dbClient.issueType.findMany;
  static findFirst = dbClient.issueType.findFirst;
  static create = dbClient.issueType.create;
  static update = dbClient.issueType.update;
}
