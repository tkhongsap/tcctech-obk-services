import { PrismaClient } from '@prisma/client';
import { logging } from 'ob-common-lib/dist';

export class HealthRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async checkHelth(): Promise<void> {
  //   // Create a new user account
    logging.info('check health');

  //   const account = await this.prisma.account.create({
  //     data: {},
  //   });
  //   return account;
  }
}
