import { Prisma } from '../../../db/client';
import Enumerable = Prisma.Enumerable;
import categoryWhereInput = Prisma.categoryWhereInput;
import { logging } from 'ob-common-lib/dist';
import { CustomError } from '../../middlewares/error_middleware';
import { CategoryRepository } from '../../repositories/category_repository';
export default class CategoryService {
  private readonly categoryRepository: CategoryRepository;
  constructor(categoryRepository?: CategoryRepository) {
    this.categoryRepository = categoryRepository || new CategoryRepository();
  }
  public async getCategory(documentTypeId: string, id: string) {
    logging.info('start call document service - get category');
    let AND: Enumerable<categoryWhereInput> = {};
    if (id) {
      AND = { id };
    }
    if (documentTypeId) {
      AND = { ...AND, type_id: documentTypeId };
    }

    const result = await this.categoryRepository.findManyBy({ AND });
    if (result == null) {
      throw new CustomError(404, 'Category not found');
    }

    return result;
  }
}
