import { Get, OperationId, Route, Queries, Path } from 'tsoa';

import { Pagination, WrappedResponse } from './base_controller.interfaces';
import { QueriesController } from './history_category_controller.interfaces';
import { HistoryCategoryIndexQuery, HistoryCategoryResult } from './history_category_controller.interfaces';
import {
  currentCategorySerializer,
  historyCategoriesSerializer,
  historyCategoryDetailSerializer,
} from './history_category_controller.serializer';
import HistoryCategoryRepository from '../repositories/history_category_repository';
import CategoryRepository from '../repositories/category_repository';
import { CategoryResult } from './category_controller.interfaces';

import { Prisma } from '../../db/client';
import Enumerable = Prisma.Enumerable;
import historyCategoryWhereInput = Prisma.history_categoryWhereInput;

@Route('history-category')
export class HistoryCategory extends QueriesController {
  @Get('')
  @OperationId('historyCategory.index')
  public async index(@Queries() query: HistoryCategoryIndexQuery): Promise<WrappedResponse<HistoryCategoryResult[]>> {
    const _query = this.buildQuery({ ...query }) as { where?: object };

    let AND: Enumerable<historyCategoryWhereInput> = { ..._query.where, category: { deleted_at: null } };

    const { type } = query;

    if (type) {
      AND = { ...AND, type: { type } };
    }

    const historyCategoryData = await HistoryCategoryRepository.findMany({
      ..._query,
      include: { history_document: true, category: true, type: true },
      where: { AND },
    });
    const data = await historyCategoriesSerializer(historyCategoryData);

    const totalData = await HistoryCategoryRepository.count({
      where: { ..._query.where, AND },
    });

    const pagination = this.paginationBuilder(
      totalData,
      query.page_size || this.DEFAULT_PAGE_SIZE,
      query.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;

    return { data, pagination };
  }

  @Get('/current')
  @OperationId('historyCategory.current')
  public async current(@Queries() query: HistoryCategoryIndexQuery): Promise<WrappedResponse<HistoryCategoryResult[]>> {
    const { type } = query;

    let AND: Enumerable<historyCategoryWhereInput> = { category: { deleted_at: null } };

    if (type) {
      AND = { ...AND, type: { type } };
    }
    const historyCategoryData = await HistoryCategoryRepository.findMany({ where: { AND } });

    const allId = historyCategoryData.reduce((acc: string[], prev) => {
      if (!acc.includes(prev.category_id)) acc.push(prev.category_id);
      return acc;
    }, []);
    const AllCurrentVersionData = await Promise.all(
      allId.map(async (versionId) => {
        const categoryData = await CategoryRepository.findFirst({
          where: { id: versionId, deleted_at: null },
          include: { list: true },
        });
        return {
          ...categoryData,
          category_id: versionId,
          id: '-',
          type_id: categoryData?.type_id || '',
          list: categoryData?.list.filter((item) => item.deleted_at === null) || [],
          title: categoryData?.title || {},
          active: categoryData?.active || false,
          image: categoryData?.image || null,
          version: categoryData?.version || 0,
          created_at: categoryData?.created_at || new Date(),
          updated_at: categoryData?.updated_at || new Date(),
          deleted_at: categoryData?.updated_by || null,
        } as CategoryResult;
      }),
    );

    const data = await currentCategorySerializer(AllCurrentVersionData);

    return { data };
  }

  @Get('{id}')
  @OperationId('historyCategory.detail')
  public async detail(@Path() id: string): Promise<WrappedResponse<HistoryCategoryResult>> {
    const historyCategoryData = await HistoryCategoryRepository.findFirst({
      where: { id },
      include: { history_document: true },
    });

    let data;

    if (historyCategoryData) data = await historyCategoryDetailSerializer(historyCategoryData);

    return { data: data || null };
  }
}
