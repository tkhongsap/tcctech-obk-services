import dbClient from '../../db/client';

export default class PassRepository {
  static createMany = dbClient.pass.createMany;
  static update = dbClient.pass.update;
  static findMany = dbClient.pass.findMany;
  static findFirst = dbClient.pass.findFirst;
  static updateMany = dbClient.pass.updateMany;
}
