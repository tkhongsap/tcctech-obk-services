import { Prisma, PrismaClient } from 'ob-notification/db/client';
import { logging } from 'ob-common-lib/dist';

export class SettingRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async find(
    where: Prisma.settingWhereInput,
  ): Promise<typeof message_template> {
    logging.info('find auto message by event name');
    const message_template = await this.prisma.setting.findFirst({
      where,
    });

    return message_template;
  }
}
