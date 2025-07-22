import { Prisma } from '../../../db/client';
import Enumerable = Prisma.Enumerable;
import documentWhereInput = Prisma.documentWhereInput;
import { logging } from 'ob-common-lib/dist';
import { CustomError } from '../../middlewares/error_middleware';
import { DocumentRepository } from '../../repositories/document_repository';
export default class DocumentService {
  private readonly documentRepository: DocumentRepository;
  constructor(listRepository?: DocumentRepository) {
    this.documentRepository = listRepository || new DocumentRepository();
  }
  public async getFaqsLists(
    categoryId: string,
    isActive: boolean,
    isReleased: boolean,
  ) {
    logging.info('start call document service - get faqs lists');
    const result = await this.documentRepository.findMany(
      categoryId,
      isActive,
      isReleased,
    );
    if (result == null) {
      throw new CustomError(404, 'list not found');
    }
    return result;
  }

  public async getDetail(id: string) {
    logging.info('start call document service - get detail');
    const OR: Enumerable<documentWhereInput> = [{ id: id }, { slug: id }];
    const result = await this.documentRepository.findBy({ OR });
    if (result == null) {
      throw new CustomError(404, 'Detail not found');
    }
    return result;
  }
}
