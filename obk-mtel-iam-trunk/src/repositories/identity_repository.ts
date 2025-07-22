import { dbClient, roDBClient } from '../../db';
import { DBClient } from '../utils/prisma/client';

export default class IdentityRepository extends DBClient {
  static create = dbClient.identity.create;
  static upsert = dbClient.identity.upsert;
  static findMany = roDBClient.identity.findMany;
  static findFirst = roDBClient.identity.findFirst;
  static update = dbClient.identity.update;
  static delete = dbClient.identity.delete;
}
