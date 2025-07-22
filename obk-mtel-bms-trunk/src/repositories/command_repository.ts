import dbClient from '../../db/client';

export default class CommandRepository {
  static create = dbClient.command.create;
  static findMany = dbClient.command.findMany;
  static findFirst = dbClient.command.findFirst;
}
