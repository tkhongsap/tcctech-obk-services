import dbClient from '../../db/client';

export default class SensorRepository {
  static create = dbClient.sensor.create;
  static findMany = dbClient.sensor.findMany;
}
