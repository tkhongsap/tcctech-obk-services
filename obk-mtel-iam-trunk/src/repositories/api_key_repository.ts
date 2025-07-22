import { roDBClient } from '../../db';

export default class ApiKeyRepository {
  static findFirst = roDBClient.api_key.findFirst;
}
