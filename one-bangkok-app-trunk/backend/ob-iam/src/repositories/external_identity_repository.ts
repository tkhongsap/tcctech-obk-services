import { logging } from 'ob-common-lib/dist';
import { DBClient } from '../utils/prisma/client';
import { Prisma } from 'ob-iam/db/client';

export default class ExternalIdentityRepository extends DBClient {
  constructor() {
    super();
  }

  public async create(
    data: Prisma.external_identityCreateInput,
  ): Promise<typeof externalIdentity> {
    // Create a new external identity in the external_identity table
    logging.info(`create user external identity`);

    const externalIdentity = await this.prisma.external_identity.create({
      data,
    });
    return externalIdentity;
  }

  public async find(
    where: Prisma.external_identityWhereInput,
  ): Promise<typeof externalIdentity> {
    const externalIdentity = await this.prisma.external_identity.findFirst({
      where,
      include: { account: true },
    });

    return externalIdentity;
  }

  public async findAll(
    where: Prisma.external_identityWhereInput,
    select?: Prisma.external_identitySelect,
  ): Promise<typeof identity> {
    logging.info('Find all external identity');
    const identity = await this.prisma.external_identity.findMany({
      where,
      select,
    });

    return identity;
  }

  public async deleteMany(
    where: Prisma.external_identityWhereInput,
  ): Promise<typeof externalIdentity> {
    logging.info('delete external identity');
    const externalIdentity = await this.prisma.external_identity.deleteMany({
      where,
    });
    return externalIdentity;
  }
}
