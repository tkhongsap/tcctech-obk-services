import KeyPairRepository from '../../repositories/key_pair_repository';
import cache from '../../libs/cache';
import { key_pair } from '../../../db/client';
import { CustomError } from '../../midlewares/error';
import { OBError } from '../../utils/error_spec';

export default class KeyPairService {
  public async getKeypairsByNames(keys: string[]): Promise<key_pair[] | []> {
    const keyPairs = await cache.getSet(
      `keypair_names_${keys.toString()}`,
      async () => {
        const keyPairData = await KeyPairRepository.findMany({ where: { name: { in: keys } } });
        if (keyPairData) {
          return JSON.stringify(keyPairData);
        } else {
          return '[]';
        }
      },
      86400,
    );
    const res = JSON.parse(keyPairs);
    return res;
  }

  public async getKeypairNameById(apiKeyId: string): Promise<string> {
    const keyPair = await cache.getSet(
      `keypair_id_${apiKeyId}`,
      async () => {
        const keyPairData = await KeyPairRepository.findFirst({ where: { api_key_id: apiKeyId as string } });
        if (keyPairData) {
          return JSON.stringify(keyPairData);
        } else {
          return '';
        }
      },
      86400,
    );

    if (!keyPair) {
      throw new CustomError(OBError.IAM_AUTH_004);
    }
    const res: key_pair = JSON.parse(keyPair);
    return res.name;
  }
}
