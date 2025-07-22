
import { type } from '../../../db/client';
import { logging } from 'ob-common-lib/dist';
import { CustomError } from '../../middlewares/error_middleware';
import { DocumentRepository } from '../../repositories/document_repository';
import { TypeRepository } from '../../repositories/type_repository';

export default class TypeService {
  private readonly documentRepository: DocumentRepository;
  private readonly typeRepository: TypeRepository;
  constructor(
    listRepository?: DocumentRepository,
    typeRepository?: TypeRepository,
  ) {
    this.documentRepository = listRepository || new DocumentRepository();
    this.typeRepository = typeRepository || new TypeRepository();
  }
  public async getTypeAll(): Promise<type[]> {
    logging.info('start call document service - get category');
    const result = await this.typeRepository.findAll();
    if (result == null) {
      throw new CustomError(404, 'Type not found');
    }
    return result;
  }

  public async getTypeByName(name: string): Promise<type[]> {
    logging.info('start call document service - get category');
    const result = await this.typeRepository.findManyByName(name);
    if (result == null) {
      throw new CustomError(404, 'Type not found');
    }
    return result;
  }
}

