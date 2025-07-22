import { dbClient, roDBClient } from '../../db';

export default class ProfileRepository {
  static update = dbClient.profile.update;
  static findFirst = roDBClient.profile.findFirst;
}
