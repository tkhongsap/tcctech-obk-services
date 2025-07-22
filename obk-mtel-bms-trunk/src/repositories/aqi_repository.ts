import dbClient from '../../db/client';

export default class AirQualityRepository {
  static create = dbClient.airQualityIndex.create;
  static findMany = dbClient.airQualityIndex.findMany;
}
