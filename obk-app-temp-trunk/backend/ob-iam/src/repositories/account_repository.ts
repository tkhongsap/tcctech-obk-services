import { logging } from 'ob-common-lib/dist';
import { Prisma } from 'ob-iam/db/client';
import { CustomError } from '../middlewares/error_middleware';
import { DBClient } from '../utils/prisma/client';

export default class AccountRepository extends DBClient {
  constructor() {
    super();
  }

  public async createAccount(
    data: Prisma.accountCreateInput,
  ): Promise<typeof account> {
    // Create a new user account
    logging.info('create user account');
    let account = {};
    try {
      account = await this.prisma.account.create({
        data,
      });
      return account;
    } catch (error) {
      throw new CustomError(500, 'Cannot create account');
    }
  }

  public async update(
    data: Prisma.accountUpdateInput,
    where: Prisma.accountWhereUniqueInput,
  ): Promise<void> {
    logging.info('update user account');
    try {
      await this.prisma.account.update({
        data,
        where,
      });
    } catch (error) {
      throw new CustomError(500, 'Cannot update account');
    }
  }

  public async bulkDelete(where: Prisma.accountWhereInput): Promise<void> {
    logging.info('delete user account');
    try {
      await this.prisma.account.deleteMany({
        where,
      });
    } catch (error) {
      throw new CustomError(500, 'Cannot update account');
    }
  }

  public async find(where: Prisma.accountWhereInput): Promise<typeof account> {
    logging.info('find account');
    const account = await this.prisma.account.findFirst({ where });
    return account;
  }
}
