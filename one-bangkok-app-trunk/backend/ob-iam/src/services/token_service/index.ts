import { DateTimeUtils } from 'ob-common-lib/dist';
import { TokenRepository } from '../../repositories';

export default class TokenService {
  private readonly tokenRepository: TokenRepository;

  constructor(tokenRepository?: TokenRepository) {
    this.tokenRepository = tokenRepository || new TokenRepository();
  }

  public async find(accountId: string, type = 'qr'): Promise<typeof token> {
    const token = await this.tokenRepository.findBy({
      account_id: accountId,
      type,
      expired_date: {
        gt: DateTimeUtils.getCurrentDateTime().toISOString(),
      },
      active: true,
    });

    return token;
  }
}
