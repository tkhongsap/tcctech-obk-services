import { dbClient, roDBClient } from '../../db';

export default class DeviceRepository {
  static create = dbClient.device.create;
  static findFirst = roDBClient.device.findFirst;
  static updateMany = dbClient.device.updateMany;
  static update = dbClient.device.update;
}
