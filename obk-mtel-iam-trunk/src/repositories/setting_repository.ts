import { dbClient, roDBClient } from '../../db';

export default class SettingRepository {
  static update = dbClient.setting.update;
  static findFirst = roDBClient.setting.findFirst;
  static findFirstOrThrow = roDBClient.setting.findFirstOrThrow;
}
