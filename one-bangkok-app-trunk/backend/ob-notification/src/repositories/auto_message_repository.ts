import { Prisma, PrismaClient } from 'ob-notification/db/client';
import { logging } from 'ob-common-lib/dist';

export class AutoMessageRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async find(
    where: Prisma.auto_messageWhereInput,
  ): Promise<typeof message_template> {
    logging.info('find auto message by event name');
    const message_template = await this.prisma.auto_message.findFirst({
      where,
      include: { message_template: true },
    });

    return message_template;
  }
}
