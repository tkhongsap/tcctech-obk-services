import { logging } from 'ob-common-lib/dist';
import { DBClient } from '../utils/prisma/client';
export default class ApiKeyRepository extends DBClient {
  constructor() {
    super();
  }

  public async findActive(id: string, secret: string): Promise<typeof apiKey> {
    logging.info('Find api_key');
    const apiKey = await this.prisma.api_key.findFirst({
      where: {
        id,
        secret,
        OR: [
          { expired_at: null },
          { expired_at: { gt: new Date() } },
        ],
      },
      include: { account: true },
    });

    return apiKey;
  }
}
