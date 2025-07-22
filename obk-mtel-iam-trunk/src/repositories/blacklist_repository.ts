import { dbClient, roDBClient } from '../../db';
export default class BlacklistRepository {
  static findFirst = roDBClient.blacklist.findFirst;
  static findMany = roDBClient.blacklist.findMany;
  static createMany = dbClient.blacklist.createMany;
}
