import { Prisma } from 'ob-iam/db/client';
import { DBClient } from '../utils/prisma/client';

export default class DeviceRepository extends DBClient {
  constructor() {
    super();
  }

  public async create(data: Prisma.deviceCreateInput): Promise<typeof device> {
    const device = await this.prisma.device.create({
      data,
    });
    return device;
  }

  public async find(where: Prisma.deviceWhereInput): Promise<typeof device> {
    const device = await this.prisma.device.findFirst({
      where,
    });

    return device;
  }

  public async findAll(where: Prisma.deviceWhereInput): Promise<typeof device> {
    const device = await this.prisma.device.findMany({
      where,
    });
    return device;
  }

  public async update(
    where: Prisma.deviceWhereUniqueInput,
    data: Prisma.deviceUpdateInput,
  ): Promise<typeof device> {
    const device = await this.prisma.device.update({ where, data });

    return device;
  }

  public async updateMany(
    where: Prisma.deviceWhereInput,
    data: Prisma.deviceUpdateInput,
  ): Promise<typeof device> {
    const device = await this.prisma.device.updateMany({
      where,
      data,
    });

    return device;
  }
}
