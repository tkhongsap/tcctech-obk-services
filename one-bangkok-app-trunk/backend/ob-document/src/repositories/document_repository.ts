import { PrismaClient, document } from '../../db/client';
import { logging } from 'ob-common-lib/dist';
import { Prisma } from '../../db/client';
import { CustomError } from '../middlewares/error_middleware';

export class DocumentRepository {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async findMany(
    categoryId: string,
    isActive: boolean,
    isReleased: boolean,
  ): Promise<document[]> {
    logging.info(`get list by id : ${categoryId}`);
    let whereReleased = null;
    if (isReleased) {
      whereReleased = { not: null };
    }
    let documents: document[] = [];
    try {
      documents = await this.prisma.document.findMany({
        where: {
          category_id: categoryId,
          active: isActive,
          release_date: whereReleased,
        },
      });
    } catch (e) {
      logging.error('list repository err');
      throw new CustomError(500, 'list was not exist');
    }
  

    return documents;
  }

  public async findBy(where: Prisma.documentWhereInput): Promise<typeof list> {
    logging.info('Find document');
    const list = await this.prisma.document.findFirst({
      where,
    });
    return list;
  }
}
