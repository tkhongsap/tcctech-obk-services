import { PrismaClient, feedback } from '../../db/client';
import { logging } from 'ob-common-lib/dist';
import { Prisma } from '../../db/client';

export class FeedbackRepository {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async findMany(
    where: Prisma.feedbackWhereInput,
  ): Promise<typeof list> {
    logging.info('Find feedback by');
    const list = await this.prisma.feedback.findMany({
      where,
    });
    return list;
  }

  public async findBy(where: Prisma.feedbackWhereInput): Promise<feedback> {
    logging.info('Find feedback by');
    return await this.prisma.feedback.findFirstOrThrow({
      where,
    });
  }

  public async create(
    documentId: string,
    accountId: string,
    like: boolean,
  ): Promise<feedback> {
    logging.info('Create feedback');
    return await this.prisma.feedback.create({
      data: { document_id: documentId, account_id: accountId, like },
    });
  }

  public async update(data: Prisma.feedbackUpdateArgs): Promise<feedback> {
    logging.info('Update feedback');
    return await this.prisma.feedback.update(data);
  }
}
