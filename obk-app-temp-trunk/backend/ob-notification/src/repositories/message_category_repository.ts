import { Prisma, PrismaClient } from 'ob-notification/db/client';

export class MessageCategoryRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async findAll(
    orderBy?: Prisma.message_categoryOrderByWithRelationInput,
  ): Promise<typeof messageCategory> {
    const messageCategory = await this.prisma.message_category.findMany({
      orderBy,
    });
    return messageCategory;
  }
  public async find(
    where: Prisma.message_categoryWhereInput,
  ): Promise<typeof messageCategory> {
    const messageCategory = await this.prisma.message_category.findFirst({
      where,
    });
    return messageCategory;
  }
}
