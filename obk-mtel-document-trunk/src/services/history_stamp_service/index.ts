import HistoryCategoryRepository from '../../repositories/history_category_repository';
import HistoryDocumentRepository from '../../repositories/history_document_repository';
import CategoryRepository from '../../repositories/category_repository';
import { Prisma } from '../../../db/client';
import DocumentRepository from '../../repositories/document_repository';
import AccountDataService from '../account_data_service';
import cache from '../../libs/cache';

export default class HistoryStampService {
  private readonly accountDataService: AccountDataService;
  constructor(accountDataService?: AccountDataService) {
    this.accountDataService = accountDataService || new AccountDataService();
  }
  public async stampHistoryCategory(id: string, accountId?: string, isListChanged?: boolean): Promise<void> {
    try {
      const historyCategoryData = await CategoryRepository.findFirst({
        where: { id },
      }).catch((error) => {
        throw new Error(`Update category error: ${error}`);
      });

      if (historyCategoryData) {
        const newVersionNumber =
          isListChanged && historyCategoryData?.version
            ? Number(historyCategoryData.version) + 1
            : historyCategoryData?.version;
        let accountName;
        if (accountId) {
          accountName = await cache.getSet(`profile_${accountId}`, false, async () => {
            const accountDataService = new AccountDataService();
            const accountName = await accountDataService.getProfile(accountId);
            if (!accountName) {
              return '';
            }
            return JSON.stringify(accountName);
          });
        }
        await CategoryRepository.update({
          where: { id },
          data: {
            ...historyCategoryData,
            title: historyCategoryData.title as Prisma.InputJsonValue,
            type: undefined,
            list: undefined,
            history_document: undefined,
            version: newVersionNumber,
            updated_by: accountId,
            updated_by_name: historyCategoryData.updated_by_name,
            active: undefined,
          },
        }).catch((error) => {
          throw new Error(`Update category error: ${error}`);
        });

        const sanitizedHistoryCategoryData = {
          category_id: historyCategoryData.id,
          updated_by: historyCategoryData.updated_by,
          updated_by_name: historyCategoryData.updated_by_name,
          title: historyCategoryData.title as Prisma.InputJsonValue,
          active: historyCategoryData.active,
          image: historyCategoryData.image,
          type_id: historyCategoryData.type_id,
          created_at: historyCategoryData.created_at,
          updated_at: historyCategoryData.updated_at,
          version: historyCategoryData.version,
        };

        await HistoryCategoryRepository.create({ data: sanitizedHistoryCategoryData }).catch((error) => {
          throw new Error(`Create history category error: ${error}`);
        });
      }
    } catch (error) {
      console.error('Stamp history category error', error);
    }
  }

  public async stampHistoryDocument(id: string, accountId?: string): Promise<void> {
    try {
      const prevDocumentData = await DocumentRepository.findFirst({
        where: { id },
        include: { history_category: true },
      }).catch((error) => {
        throw new Error(`Find history document error: ${error}`);
      });

      const historyCategoryData = await HistoryCategoryRepository.findFirst({
        where: { category_id: prevDocumentData?.category_id },
        orderBy: { version: 'desc' },
      });

      if (prevDocumentData) {
        await DocumentRepository.update({
          where: { id },
          data: {
            ...prevDocumentData,
            title: prevDocumentData.title as Prisma.InputJsonValue,
            body: prevDocumentData.body as Prisma.InputJsonValue,
            history_category: undefined,
            version: prevDocumentData.version && Number(prevDocumentData.version) + 1,
          },
        });

        const sanitizedHistoryDocumentData = {
          document_id: prevDocumentData.id,
          updated_by: prevDocumentData.updated_by,
          title: prevDocumentData.title as Prisma.InputJsonValue,
          body: prevDocumentData.body as Prisma.InputJsonValue,
          category_id: prevDocumentData.category_id,
          published: prevDocumentData.published,
          created_at: prevDocumentData.created_at,
          updated_at: prevDocumentData.updated_at,
          version: prevDocumentData.version,
          slug: prevDocumentData.slug,
          history_category_id: historyCategoryData?.id,
        };

        await HistoryDocumentRepository.create({ data: sanitizedHistoryDocumentData }).catch((error) => {
          throw new Error(`Create history document error: ${error}`);
        });
      }
    } catch (error) {
      console.error('Stamp history document error', error);
    }
  }
}
