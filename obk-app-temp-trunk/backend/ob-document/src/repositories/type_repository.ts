import { PrismaClient, type } from '../../db/client';
import { logging } from 'ob-common-lib/dist';
import { CustomError } from '../middlewares/error_middleware';

export class TypeRepository {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async findAll(): Promise<type[]> {
    logging.info('get type');
    let type: type[] = [];
    try {
      type = await this.prisma.type.findMany();
    } catch (e) {
      logging.error('type repository err');
      throw new CustomError(500, 'type was not exist');
    }

    return type;
  }

  public async findManyByName(name: string): Promise<type[]> {
    logging.info('get type');
    let type: type[] = [];
    try {
      type = await this.prisma.type.findMany({
        where: {
          type: name,
        },
      });
    } catch (e) {
      logging.error('type repository err');
      throw new CustomError(500, 'type was not exist');
    }

    return type;
  }
}
