import { Prisma, PrismaClient } from 'ob-notification/db/client';
import { logging } from 'ob-common-lib/dist';
import { CustomError } from '../middlewares/error_middleware';

export class RecipientRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  // receive data, create recipient data with setting
  public async create(
    data: Prisma.recipientCreateInput,
  ): Promise<typeof recipient> {
    let recipient = {};
    logging.info('Creating recipient');
    try {
      recipient = await this.prisma.recipient.create({
        data,
      });
      return recipient;
    } catch (error) {
      throw new CustomError(400, 'Cannot create recipient');
    }
  }

  public async findAll(): Promise<typeof recipient> {
    const recipient = await this.prisma.recipient.findMany();
    return recipient;
  }

  public async find(
    where: Prisma.recipientWhereInput,
    include?: Prisma.recipientInclude,
  ): Promise<typeof recipient> {
    const recipient = await this.prisma.recipient.findFirst({
      where,
      include,
    });
    return recipient;
  }

  public async update(
    where: Prisma.recipientWhereUniqueInput,
    data: Prisma.recipientUpdateInput,
  ): Promise<typeof recipient> {
    const recipient = await this.prisma.recipient.update({
      where,
      data,
    });

    return recipient;
  }
}
