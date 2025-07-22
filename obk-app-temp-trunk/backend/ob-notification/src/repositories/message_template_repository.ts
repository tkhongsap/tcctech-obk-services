import { Prisma, PrismaClient } from 'ob-notification/db/client';
import { logging } from 'ob-common-lib/dist';

export class MessageTemplateRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async create(
    inputs: Prisma.message_templateCreateInput,
  ): Promise<typeof messageTemplate> {
    logging.info('create message template');
    const messageTemplate = await this.prisma.message_template.create({
      data: inputs,
    });
    return messageTemplate;
  }

  public async findBy(
    where: Prisma.message_templateWhereInput,
  ): Promise<typeof messageTemplate> {
    const messageTemplate = await this.prisma.message_template.findFirst({
      where,
    });
    return messageTemplate;
  }
}
