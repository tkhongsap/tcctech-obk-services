import { DateTimeUtils, logging } from 'ob-common-lib/dist';
import { Prisma, token } from 'ob-iam/db/client';
import { DBClient } from '../utils/prisma/client';
export default class TokenRepository extends DBClient {
  constructor() {
    super();
  }

  public async createToken(data: Prisma.tokenCreateInput): Promise<token> {
    const token = await this.prisma.token.create({ data });
    return token;
  }

  public async updateMany(
    where: Prisma.tokenWhereInput,
    data: Prisma.tokenUpdateManyMutationInput,
  ): Promise<typeof token> {
    const token = await this.prisma.token.updateMany({ where, data });

    return token;
  }

  public async update(
    where: Prisma.tokenWhereUniqueInput,
    data: Prisma.tokenUpdateInput,
  ): Promise<typeof token> {
    const token = await this.prisma.token.update({ where, data });

    return token;
  }

  public async findBy(where: Prisma.tokenWhereInput): Promise<typeof token> {
    logging.info('Find token');
    const token = await this.prisma.token.findFirst({
      where,
      include: { account: true },
    });

    return token;
  }

  public async findActiveBy(where: Prisma.tokenWhereInput): Promise<typeof token> {
    const token = await this.prisma.token.findFirst({
      where: {
        ...where, expired_date: {
          gt: DateTimeUtils.getCurrentDateTime().toISOString(),
        },
        active: true,
      },
      include: { account: true },
    });

    return token;
  }
}
