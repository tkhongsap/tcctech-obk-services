import { PrismaClient, category, Prisma } from '../../db/client';
import { CustomError } from '../middlewares/error_middleware';
import { logging } from 'ob-common-lib/dist';
import { CategoryData } from './category_repository.interface';
export class CategoryRepository {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async create(
    categoryId: string,
    payload: CategoryData,
  ): Promise<typeof category> {
    logging.info('create category');
    let category = {};
    try {
      category = await this.prisma.category.create({
        data: {
          id: categoryId,
          title: payload.title,
          active: payload.active,
          image: payload.image,
          type_id: payload.type_id,
        },
      });
    } catch (e) {
      logging.error('category repository err');
      throw new CustomError(500, 'category was not exist');
    }
    return category;
  }

  public async findMany(id: string): Promise<category[]> {
    logging.info(`get category by id : ${id}`);
    let category: category[] = [];
    try {
      category = await this.prisma.category.findMany({
        where: {
          AND: [
            {
              type_id: id,
            },
            {
              active: true,
            },
          ],
        },
      });
    } catch (e) {
      logging.error('category repository err');
      throw new CustomError(500, 'category was not exist');
    }
    return category;
  }

  public async findManyBy(
    where: Prisma.categoryWhereInput,
  ): Promise<typeof categories> {
    logging.info('Find categories');
    const categories = await this.prisma.category.findMany({
      where,
    });
    return categories;
  }
}
