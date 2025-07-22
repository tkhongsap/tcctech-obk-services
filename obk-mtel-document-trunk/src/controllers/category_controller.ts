import { Controller, Get, OperationId, Route, Queries, Delete, Path, Post, Body, Put, Header } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import {
  CategoryIndexQuery,
  CategoryResult,
  UpdateCMSCategoryBody,
  CreateCMSCategoryBody,
  CreateCategoryBody,
  UpdateCategoryBody,
} from './category_controller.interfaces';
import CategoryRepository from '../repositories/category_repository';
import { Prisma } from '../../db/client';
import Enumerable = Prisma.Enumerable;
import categoryWhereInput = Prisma.categoryWhereInput;
import { categorySerializer, categorysSerializer } from './category_controller.serializer';
import HistoryStampService from '../services/history_stamp_service';
import DocumentRepository from '../repositories/document_repository';
import CMSService from '../services/cms_service';
import dayjs from 'dayjs';
import { DocumentResult } from './document_controller.interfaces';

@Route('category')
export class Category extends Controller {
  @Get('')
  @OperationId('category.show')
  public async show(
    @Queries() query: CategoryIndexQuery,
    @Header('accept-language') language: string,
  ): Promise<WrappedResponse<CategoryResult>> {
    let AND: Enumerable<categoryWhereInput> = {};
    const { id, type, released } = query;
    if (id) {
      AND = { id };
    }
    if (!id) {
      AND = { ...AND, active: true };
    }
    if (type) {
      AND = { ...AND, type_id: type };
    }
    AND = { ...AND, deleted_at: null };

    const where = { release_date: { not: null } };
    const CategoryData = await CategoryRepository.findMany({
      where: AND,
      include: { list: released ? { where } : true, type: true },
    });
    const FilteredData = released
      ? CategoryData.map((category: any) => {
          const list = category.list?.filter((item: DocumentResult) => {
            const releaseDate = item.release_date;
            return dayjs().isSame(dayjs(releaseDate), 'day') || dayjs().isAfter(dayjs(releaseDate), 'day');
          });
          return { ...category, list };
        })
      : CategoryData;
    this.setStatus(200);
    if (CategoryData.length > 0) {
      return { data: await categorysSerializer(FilteredData, language) };
    }
    return { data: null };
  }

  @Delete('{id}')
  @OperationId('category.destroy')
  public async destroy(@Path() id: string): Promise<WrappedResponse<true>> {
    try {
      await CategoryRepository.update({
        where: { id },
        data: { deleted_at: new Date() },
      });

      this.setStatus(200);
      return { data: true };
    } catch (error) {
      console.log('Delete category error', error);
      return { data: null };
    }
  }

  @Get('cms')
  @OperationId('category.cms.show')
  public async showCms(
    @Queries() query: CategoryIndexQuery,
    @Header('accept-language') language: string,
  ): Promise<WrappedResponse<CategoryResult>> {
    let AND: Enumerable<categoryWhereInput> = {};
    const { id, type } = query;
    if (id) {
      AND = { id };
    }
    if (type) {
      AND = { ...AND, type_id: type };
    }
    AND = { ...AND, deleted_at: null };
    const CategoryData = await CategoryRepository.findMany({ where: AND, include: { list: true, type: true } });
    this.setStatus(200);
    if (CategoryData.length > 0) {
      return { data: await categorysSerializer(CategoryData, language) };
    }
    return { data: null };
  }

  @Post('cms')
  @OperationId('category.cms.create')
  public async create(
    @Body() body: CreateCMSCategoryBody,
    @Header('x-account-id') accountId?: string,
  ): Promise<WrappedResponse<CategoryResult>> {
    try {
      const categoryData = await CategoryRepository.create({
        data: {
          title: body.title,
          type_id: body.type_id,
          active: body.active || true,
          updated_by: accountId,
        },
      });
      await Promise.all(
        body.document.map(async (document) => {
          await DocumentRepository.create({
            data: {
              ...document,
              category_id: categoryData.id,
              category: undefined,
              history_category: undefined,
              slug: document.slug || '',
              published: document.published || true,
              active: true,
              release_date: new Date(),
            },
          });
        }),
      );
      this.setStatus(200);
      return { data: categorySerializer(categoryData) };
    } catch (error) {
      console.log('Create category cms error', error);
      return { data: null };
    }
  }

  @Put('cms/{id}')
  @OperationId('category.cms.update')
  public async cmsUpdate(
    @Path() id: string,
    @Body() body: UpdateCMSCategoryBody,
    @Header('x-account-id') accountId?: string,
  ): Promise<WrappedResponse<CategoryResult>> {
    const cmsService = new CMSService();
    try {
      await cmsService.UpdateCategoryDocuments(id, body, accountId);
      const categoryData = await CategoryRepository.update({
        where: {
          id,
        },
        data: {
          title: body.title,
          active: body.active,
          updated_by: accountId,
          updated_by_name: body.updated_by_name,
        },
      });
      this.setStatus(200);
      return { data: categorySerializer(categoryData) };
    } catch (error) {
      console.log('Update category cms error', error);
      return { data: null };
    }
  }

  @Post()
  @OperationId('category.create')
  public async cmsCreate(@Body() body: CreateCategoryBody): Promise<WrappedResponse<CategoryResult>> {
    try {
      const documentData = await CategoryRepository.create({
        data: body,
      });
      this.setStatus(200);
      return { data: categorySerializer(documentData) };
    } catch (error) {
      return { data: null };
    }
  }

  @Put('{id}')
  @OperationId('category.update')
  public async update(
    @Path() id: string,
    @Header('x-account-id') accountid: string,
    @Body() body: UpdateCategoryBody,
  ): Promise<WrappedResponse<CategoryResult>> {
    try {
      const historyStampService = new HistoryStampService();
      await historyStampService.stampHistoryCategory(id, accountid, true);
      const documentData = await CategoryRepository.update({
        where: {
          id,
        },
        data: body,
      });

      this.setStatus(200);
      return { data: categorySerializer(documentData) };
    } catch (error) {
      return { data: null };
    }
  }
}
