import { Prisma } from '../../db/client';
import { CategoryResult } from './category_controller.interfaces';
import { languageSelector } from '../libs/language';

async function categorySerealizer(data: CategoryResult, language: string): Promise<CategoryResult> {
  const title = languageSelector(data.title as Record<string, never>, language);
  return {
    id: data.id,
    title: title instanceof Object ? JSON.stringify(title) : (title as string),
    image: data.image === null ? '' : data.image,
    type_id: data.type_id,
    list: data.list?.filter((item: any) => item.deleted_at === null) || [],
    version: data.version,
    updated_by: data.updated_by,
    updated_by_name: data.updated_by_name,
    active: data.active,
    type: data.type,
    updated_at: data.updated_at instanceof Date ? data.updated_at.toISOString() : data.updated_at,
  };
}
async function categorysSerializer(
  category: Prisma.categoryGetPayload<true>[],
  language: string,
): Promise<CategoryResult[]> {
  const response: CategoryResult[] = [];
  await Promise.all(
    category.map(async (item: CategoryResult) => {
      const res = await categorySerealizer(item, language);
      response.push({
        ...res,
      });
    }),
  );
  return response;
}
function categorySerializer(category: Prisma.categoryGetPayload<true>): CategoryResult {
  return {
    id: category.id,
    title: category.title,
    created_at: category.created_at.toISOString(),
    updated_at: category.updated_at.toISOString(),
    active: category.active,
    image: category.image,
    type_id: category.type_id,
  };
}

export { categorySerializer, categorysSerializer };
