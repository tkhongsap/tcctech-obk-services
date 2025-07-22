import { Prisma } from '../../db/client';
import { DocumentResult, DocumentListResult } from './document_controller.interfaces';
import { languageSelector } from '../libs/language';
import { get } from 'lodash';
import { getAccountNameFromRedis } from '../utils/get_account_info';

async function documentSerealizer(
  data: Prisma.documentGetPayload<true>,
  language: string,
): Promise<DocumentListResult> {
  return {
    id: get(data, 'id', ''),
    title: languageSelector(get(data, 'title', '') as never, language) as any,
    category_id: data.category_id,
    body: languageSelector(get(data, 'body', '') as never, language) as any,
    published: data.published,
    created_at: data.created_at?.toISOString(),
    updated_at: data.updated_at.toISOString(),
    active: data.active,
    image: data.image,
    release_date: data.release_date?.toISOString(),
    slug: data.slug,
    updated_by: await getAccountNameFromRedis(data.updated_by || ''),
  };
}
async function documentListSerealizer(
  document: Prisma.documentGetPayload<true>[],
  language: string,
): Promise<DocumentListResult[]> {
  const response: DocumentListResult[] = [];
  await Promise.all(
    document.map(async (row) => {
      const res = await documentSerealizer(row, language);

      response.push({
        ...res,
      });
    }),
  );

  return response;
}
function documentDetailLanguageSerealizer(document: Prisma.documentGetPayload<true>, language: string): DocumentResult {
  const title = languageSelector(get(document, 'title', '') as never, language);
  const body = languageSelector(get(document, 'body', '') as never, language);

  return {
    id: get(document, 'id', ''),
    title: title instanceof Object ? JSON.stringify(title) : (title as string),
    body: body instanceof Object ? JSON.stringify(body) : (body as string),
    image: get(document, 'image', ''),
    category_id: document.category_id,
    published: document.published,
    created_at: document.created_at?.toISOString(),
    updated_at: document.updated_at.toISOString(),
    active: document.active,
    release_date: document.release_date?.toISOString(),
    slug: document.slug,
    history_document: get(document, 'history_document', []),
  };
}

function documentDetailSerealizer(document: Prisma.documentGetPayload<true>): DocumentResult {
  return {
    id: document.id,
    title: document.title,
    category_id: document.category_id,
    body: document.body,
    published: document.published,
    created_at: document.created_at?.toISOString(),
    updated_at: document.updated_at.toISOString(),
    active: document.active,
    image: document.image,
    release_date: document.release_date?.toISOString(),
    slug: document.slug,
    history_document: get(document, 'history_document', []),
  };
}
export { documentListSerealizer, documentDetailSerealizer, documentDetailLanguageSerealizer };
