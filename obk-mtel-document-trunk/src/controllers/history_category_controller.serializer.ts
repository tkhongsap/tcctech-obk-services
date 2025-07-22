import { Prisma } from '../../db/client';
import { getAccountNameFromRedis } from '../utils/get_account_info';
import { CategoryResult } from './category_controller.interfaces';
import { HistoryCategoryResult } from './history_category_controller.interfaces';

async function historyCategoriesSerializer(
  history_categories: Prisma.history_categoryGetPayload<true>[],
): Promise<HistoryCategoryResult[]> {
  const result = await Promise.all(
    history_categories.map(async (history_category) => {
      return { ...history_category, updated_by_name: await getAccountNameFromRedis(history_category.updated_by ?? '') };
    }),
  );
  return result;
}

async function historyCategoryDetailSerializer(
  history_category: Prisma.history_categoryGetPayload<true>,
): Promise<HistoryCategoryResult> {
  return history_category;
}

async function currentCategorySerializer(categories: CategoryResult[]): Promise<HistoryCategoryResult[]> {
  const result = await Promise.all(
    categories.map(async (category) => {
      return {
        ...category,
        type_id: category.type_id || '',
        type: category.type || {},
        updated_by_name: await getAccountNameFromRedis((category.updated_by as string) ?? ''),
      };
    }),
  );
  return result;
}

export { historyCategoriesSerializer, historyCategoryDetailSerializer, currentCategorySerializer };
