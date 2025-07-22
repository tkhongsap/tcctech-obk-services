import { Prisma, PrismaClient } from 'ob-notification/db/client';
import { logging } from 'ob-common-lib/dist';

export class MessageTransactionRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async create(
    inputs: Prisma.message_transactionCreateInput,
  ): Promise<typeof messageTemplate> {
    logging.info('create message transaction');
    const messageTemplate = await this.prisma.message_transaction.create({
      data: inputs,
    });
    return messageTemplate;
  }
}
