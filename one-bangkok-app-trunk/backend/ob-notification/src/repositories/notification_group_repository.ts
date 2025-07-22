import { Prisma, PrismaClient } from 'ob-notification/db/client';

export class NotificationGroupRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async findAll(
    include?: Prisma.notification_groupInclude,
  ): Promise<typeof notificationGroup> {
    const notificationGroup = await this.prisma.notification_group.findMany({
      include,
    });
    return notificationGroup;
  }
}
