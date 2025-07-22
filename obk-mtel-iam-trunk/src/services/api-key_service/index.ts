import cache from '../../libs/cache';
import { api_key } from '../../../db/client';
import ApiKeyRepository from '../../repositories/api_key_repository';
import { isEmpty } from 'lodash';

export default class ApiKeyService {
  public async getApiKeyByAccountId(XAccountId: string): Promise<api_key | null> {
    const apiKey = await cache.getSet(`APIKEY_ACCOUNT_ID:${XAccountId}`, async () => {
      const apiKeyData = await ApiKeyRepository.findFirst({ where: { account_id: XAccountId } });
      if (apiKeyData) {
        return JSON.stringify(apiKeyData);
      } else {
        return '';
      }
    });
    let res;
    if (!isEmpty(apiKey)) {
      res = JSON.parse(apiKey);
    }
    return res;
  }
}
