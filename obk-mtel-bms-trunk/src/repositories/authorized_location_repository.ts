import dbClient from '../../db/client';

export default class AuthorizedLocationRepository {
  static create = dbClient.authorizedLocation.create;
  static upsert = dbClient.authorizedLocation.upsert;
  static findMany = dbClient.authorizedLocation.findMany;
  static findFirst = dbClient.authorizedLocation.findFirst;
}
