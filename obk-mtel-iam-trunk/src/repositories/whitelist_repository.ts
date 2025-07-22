import { dbClient, roDBClient } from '../../db';

export default class WhitelistRepository {
  static findMany = roDBClient.whitelist.findMany;
  static create = dbClient.whitelist.create;
}
