import dbClient from '../../db/client';

export default class ShuttleBusPositionsRepository {
  static create = dbClient.shuttleBusPositions.create;
  static deleteMany = dbClient.shuttleBusPositions.deleteMany;
  static update = dbClient.shuttleBusPositions.update;
  static findFirst = dbClient.shuttleBusPositions.findFirst;
}
