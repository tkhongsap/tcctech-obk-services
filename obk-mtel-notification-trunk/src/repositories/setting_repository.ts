import dbClient from '../../db/client';

export default class SettingRepository {
  static findMany = dbClient.setting.findMany;
  static create = dbClient.setting.create;
  static createMany = dbClient.setting.createMany;
  static findFirst = dbClient.setting.findFirst;
}
