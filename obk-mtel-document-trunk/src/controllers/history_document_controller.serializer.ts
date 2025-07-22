import { Prisma } from '../../db/client';
import { getAccountNameFromRedis } from '../utils/get_account_info';
import { HistoryDocumentResult } from './history_document_controller.interfaces';

async function historyDocumentsSerializer(
  history_documents: Prisma.history_documentGetPayload<true>[],
): Promise<HistoryDocumentResult[]> {
  const response: HistoryDocumentResult[] = [];
  await Promise.all(
    history_documents.map(async (item: Prisma.history_documentGetPayload<true>) => {
      const res = await historyDocumentDetailSerializer(item);
      response.push({
        ...res,
      });
    }),
  );
  return response;
}

async function historyDocumentDetailSerializer(
  history_document: Prisma.history_documentGetPayload<true>,
): Promise<HistoryDocumentResult> {
  return {
    id: history_document.id,
    category_id: history_document.category_id,
    title: history_document.title,
    body: history_document.body,
    image: history_document.image,
    active: history_document.active,
    created_at: history_document.created_at,
    updated_at: history_document.updated_at,
    published: history_document.published,
    release_date: history_document.release_date,
    slug: history_document.slug,
    version: history_document.version,
    updated_by: history_document.updated_by,
    history_category_id: history_document.history_category_id,
    updated_by_name: await getAccountNameFromRedis(history_document.updated_by ?? ''),
    document_id: history_document.document_id,
  };
}

export { historyDocumentsSerializer, historyDocumentDetailSerializer };
