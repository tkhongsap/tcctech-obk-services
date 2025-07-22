import dbClient from '../../db/client';

export default class AreasRepository {
  static findMany = dbClient.areas.findMany;
}
