import { Prisma, PrismaClient } from 'ob-notification/db/client';
import { logging } from 'ob-common-lib/dist';

export class MessageDataTemplateRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async find(
    where: Prisma.message_data_templateWhereInput,
  ): Promise<typeof message_data_template> {
    logging.info('bulk create message');
    const message_data_template =
      await this.prisma.message_data_template.findFirst({
        where,
      });

    return message_data_template;
  }
}
