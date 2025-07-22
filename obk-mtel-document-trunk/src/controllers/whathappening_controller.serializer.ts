import { Prisma } from '../../db/client';
import { languageSelector } from '../libs/language';
import { get } from 'lodash';
import { getAccountNameFromRedis } from '../utils/get_account_info';
import { WhatheppeningListResult, WhatheppeningResult } from './whathappening_controller.interfaces';

async function whathappeningSerealizer(
  data: Prisma.documentGetPayload<true>,
  language: string,
): Promise<WhatheppeningListResult> {
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
    updated_by: data.updated_by || '',
  };
}
async function whathappeningListSerealizer(
  document: Prisma.documentGetPayload<true>[],
  language: string,
): Promise<WhatheppeningListResult[]> {
  const response: WhatheppeningListResult[] = [];
  await Promise.all(
    document.map(async (row) => {
      const res = await whathappeningSerealizer(row, language);

      response.push({
        ...res,
      });
    }),
  );

  return response;
}

function whathappeningDetailSerealizer(document: Prisma.documentGetPayload<true>): WhatheppeningResult {
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
    updated_by: document.updated_by,
  };
}
export { whathappeningListSerealizer, whathappeningDetailSerealizer };
