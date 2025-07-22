import dbClient from '../../db/client';

export default class ShuttleBusesRepository {
  static upsert = dbClient.shuttleBuses.upsert;
  static findMany = dbClient.shuttleBuses.findMany;
}
