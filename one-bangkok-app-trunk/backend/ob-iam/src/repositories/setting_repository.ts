import { Prisma } from 'ob-iam/db/client';
import { DBClient } from '../utils/prisma/client';

export default class SettingRepository extends DBClient {
  constructor() {
    super();
  }

  public async create(
    data: Prisma.settingCreateInput,
  ): Promise<typeof setting> {
    const setting = await this.prisma.setting.create({
      data,
    });
    return setting;
  }

  public async find(where: Prisma.settingWhereInput): Promise<typeof setting> {
    const setting = await this.prisma.setting.findFirstOrThrow({
      where,
    });

    return setting;
  }

  public async update(
    where: Prisma.settingWhereUniqueInput,
    data: Prisma.settingUpdateInput,
  ): Promise<typeof setting> {
    const setting = await this.prisma.setting.update({ where, data });

    return setting;
  }
}
