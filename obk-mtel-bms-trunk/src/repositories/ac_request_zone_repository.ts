import dbClient from '../../db/client';

export default class ACRequestZoneRepository {
  static create = dbClient.aCRequestZone.create;
  static createMany = dbClient.aCRequestZone.createMany;
  static findMany = dbClient.aCRequestZone.findMany;

  static defaultInclude = {
    ac_zone: true,
  };
}
