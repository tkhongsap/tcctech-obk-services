import BaseRepository from '../../repositories/base_repository';
import BlacklistRepository from '../../repositories/blacklist_repository';
import DeviceRepository from '../../repositories/device_repository';
import TokenRepository from '../../repositories/token_repository';
import { EventProducer } from '../../utils/kafka';
import logging from '../../utils/logging';
import { BlacklistCreateData } from './index.interface';

export default class BlacklistService {
  private readonly baseRepository: BaseRepository;

  constructor(baseRepository?: BaseRepository) {
    this.baseRepository = baseRepository || new BaseRepository();
  }
  public async create(data: BlacklistCreateData): Promise<boolean> {
    logging.info(`start create new blacklist for ${data.account_ids}`);
    let dataAccounts;
    if (data.account_ids.length) {
      dataAccounts = data.account_ids.map((accountId) => {
        return {
          account_id: accountId,
        };
      });
    }
    if (dataAccounts) {
      await BlacklistRepository.createMany({
        data: dataAccounts,
      });
      await TokenRepository.updateMany({
        where: {
          account_id: { in: data.account_ids },
        },
        data: {
          active: false,
        },
      });
    }
    logging.info(`finish create new blacklist for ${data.account_ids}`);
    return true;
  }

  public async find(accountId: string): Promise<typeof blacklist> {
    const blacklist = await BlacklistRepository.findFirst({
      where: {
        account_id: accountId,
      },
    });
    return blacklist;
  }
}
