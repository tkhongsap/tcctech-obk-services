import dbClient from '../../db/client';

export default class BeaconRepository {
  static create = dbClient.beacon.create;
  static upsert = dbClient.beacon.upsert;
  static findMany = dbClient.beacon.findMany;
}
