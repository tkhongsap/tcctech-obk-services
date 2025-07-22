import { roDBClient } from '../../db';
import { DBClient } from '../utils/prisma/client';

export default class KeyPairRepository extends DBClient {
  static findFirst = roDBClient.key_pair.findFirst;
  static findMany = roDBClient.key_pair.findMany;
}
