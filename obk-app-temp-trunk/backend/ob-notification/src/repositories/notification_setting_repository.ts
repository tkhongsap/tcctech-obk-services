import { logging } from 'ob-common-lib/dist';
import { Prisma, PrismaClient, setting } from '../../db/client';
import { CustomError } from '../middlewares/error_middleware';

export class NotificationSettingRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async findBy(
    where: Prisma.settingWhereInput,
  ): Promise<setting | null> {
    const setting = await this.prisma.setting.findFirst({
      where,
    });

    return setting;
  }

  public async findAll(where: Prisma.settingWhereInput) {
    const notificationSetting = await this.prisma.setting.findMany({
      where,
    });
    return notificationSetting;
  }
  // function update
  // -------- receive param: notif setting id, account id, update value

  public async update(
    where: Prisma.settingWhereUniqueInput,
    data: Prisma.settingUpdateInput,
  ): Promise<typeof result> {
    let result = {};
    try {
      logging.info('start update setting - repository');
      result = await this.prisma.setting.update({
        where: where,
        data: data,
      });
    } catch (error) {
      logging.info('error message here:                          ' + error);
      throw new CustomError(500, 'Cannot update message');
    }
    return result;
  }

  public async updateAll(
    where: Prisma.settingWhereInput,
    data: Prisma.settingUpdateInput,
  ): Promise<typeof result> {
    let result = {};
    try {
      logging.info('start update all setting - repository ');
      result = await this.prisma.setting.updateMany({
        where: where,
        data: data,
      });
    } catch (error) {
      logging.info('error message here:                          ' + error);
      throw new CustomError(500, 'Cannot update message');
    }
    return result;
  }
}
