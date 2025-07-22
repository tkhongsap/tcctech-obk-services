import { dbClient, roDBClient } from '../../db';
import { DBClient } from '../utils/prisma/client';

export default class OtpRepository extends DBClient {
  static update = dbClient.otp.update;
  static updateMany = dbClient.otp.updateMany;
  static create = dbClient.otp.create;
  static findFirst = roDBClient.otp.findFirst;
  static findMany = roDBClient.otp.findMany;
  static deleteMany = dbClient.otp.deleteMany;
}
