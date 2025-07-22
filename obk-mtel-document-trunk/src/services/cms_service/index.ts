import { isEqual } from 'lodash';
import { UpdateCMSCategoryBody } from '../../controllers/category_controller.interfaces';
import BaseRepository from '../../repositories/base_repository';
import CategoryRepository from '../../repositories/category_repository';
import DocumentRepository from '../../repositories/document_repository';
import HistoryStampService from '../history_stamp_service';

export default class CMSService {
  private readonly baseRepository: BaseRepository;
  constructor(baseRepository?: BaseRepository) {
    this.baseRepository = baseRepository || new BaseRepository();
  }
  public async UpdateCategoryDocuments(id: string, body: UpdateCMSCategoryBody, accountId?: string): Promise<void> {
    const historyStampService = new HistoryStampService();
    try {
      const prevVersionCategory = await CategoryRepository.findFirst({
        include: { list: true, type: true },
        where: { id, deleted_at: null },
      });
      const deletedDocuments = prevVersionCategory?.list?.filter(
        (prevDocument) => !body.document?.find((document) => document.id === prevDocument.id),
      );

      const updatedDocuments = prevVersionCategory?.list?.filter(
        (prevDocument) =>
          body.document?.find(
            (document) =>
              document.id === prevDocument.id &&
              !isEqual(document.body, prevDocument.body) &&
              !isEqual(document.body, prevDocument.body),
          ),
      );
      const createdDocuments = body.document?.filter((document) => !document.id);

      this.baseRepository.transaction(async () => {
        // stamp history category
        await historyStampService.stampHistoryCategory(
          id,
          accountId,
          Boolean(
            (deletedDocuments?.length ?? 0 > 0) ||
              (createdDocuments?.length ?? 0 > 0) ||
              (updatedDocuments?.length ?? 0 > 0),
          ),
        );

        const avalaibleDocuments = prevVersionCategory?.list?.filter((document) => document.deleted_at === null);
        await Promise.all(
          (avalaibleDocuments ?? []).map(async (prevDocument) => {
            await historyStampService.stampHistoryDocument(prevDocument.id, accountId);
          }),
        );

        // set status deleted documents to be inactive and add deleted_at
        if (deletedDocuments) {
          await Promise.all(
            deletedDocuments.map(async (deletedDocument) => {
              await DocumentRepository.update({
                where: { id: deletedDocument.id },
                data: { active: false, deleted_at: new Date() },
              });
            }),
          );
        }
        // update the updated documents
        if (updatedDocuments) {
          await Promise.all(
            updatedDocuments.map(async (updatedDocument) => {
              const newDocument = body.document?.find((document) => document.id === updatedDocument.id);
              if (newDocument) {
                await DocumentRepository.update({
                  where: { id: updatedDocument.id },
                  data: {
                    title: newDocument.title,
                    body: newDocument.body,
                    id: newDocument.id,
                    active: true,
                    published: newDocument.published,
                  },
                });
              }
            }),
          );
        }
        // create new documents
        if (createdDocuments) {
          await Promise.all(
            createdDocuments.map(async (createdDocument) => {
              await DocumentRepository.create({
                data: {
                  category_id: id,
                  title: createdDocument?.title || {},
                  body: createdDocument?.body || {},
                  slug: '',
                  active: true,
                  published: true,
                  release_date: new Date(),
                },
              });
            }),
          );
        }
      }, []);
    } catch (error) {
      console.error('Update category documents error', error);
    }
  }
}
