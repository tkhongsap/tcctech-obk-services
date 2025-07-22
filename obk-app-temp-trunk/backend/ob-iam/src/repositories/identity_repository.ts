import { logging } from 'ob-common-lib/dist';
import { IdentityProvider, Prisma } from 'ob-iam/db/client';
import { DBClient } from '../utils/prisma/client';
export default class IdentityRepository extends DBClient {
  public async findBy(
    where: Prisma.identityWhereInput,
  ): Promise<typeof identity> {
    logging.info('Find identity');
    const identity = await this.prisma.identity.findFirst({
      where,
      include: { account: true },
    });

    return identity;
  }

  public async findIdentity(
    identity: string,
    identityType: IdentityProvider,
  ): Promise<typeof identityResult> {
    const identityResult = await this.prisma.identity.findFirst({
      where: {
        identifier: identity,
        provider: identityType,
      },
    });

    return identityResult;
  }

  public async findAll(
    where: Prisma.identityWhereInput,
    select?: Prisma.identitySelect,
  ): Promise<typeof identity> {
    logging.info('Find identity');
    const condition: Prisma.identityFindManyArgs = { where, select };
    const identity = await this.prisma.identity.findMany(condition);

    return identity;
  }

  public async createIdentity(
    identifier: string,
    provider: IdentityProvider,
    accountId: string,
    defaultIdentity: boolean,
    meta: object,
  ): Promise<typeof identity> {
    // Create a new user in the authentication table
    logging.info(`create user identity :${identifier}`);

    const identity = await this.prisma.identity.create({
      data: {
        identifier: identifier,
        provider: provider,
        account_id: accountId,
        default: defaultIdentity,
        meta,
      },
    });
    return identity;
  }

  public async update(
    updateData: Prisma.identityUpdateArgs,
  ): Promise<typeof identity> {
    logging.info('update identity');
    const identity = await this.prisma.identity.update(updateData);

    return identity;
  }

  public async delete(
    where: Prisma.identityWhereUniqueInput,
  ): Promise<typeof identity> {
    logging.info('delete identity');
    const identity = await this.prisma.identity.delete({ where });
    return identity;
  }
}
