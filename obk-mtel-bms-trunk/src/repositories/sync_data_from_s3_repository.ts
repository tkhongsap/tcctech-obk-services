import dbClient from '../../db/client';

export default class SyncDataFromS3Repository {
  static deleteMany = dbClient.syncDataFromS3.deleteMany;
  static create = dbClient.syncDataFromS3.create;
  static upsert = dbClient.syncDataFromS3.upsert;
  static findMany = dbClient.syncDataFromS3.findMany;
  static findFirst = dbClient.syncDataFromS3.findFirst;
  static update = dbClient.syncDataFromS3.update;
}
