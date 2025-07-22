import { Controller, Get, OperationId, Route, Queries, Header, Path, Delete, Post, Put, Body } from 'tsoa';
import { Pagination, WrappedResponse } from './base_controller.interfaces';
import { Prisma } from '../../db/client';
import {
  WhatheppeningResult,
  CreateWhatheppeningBody,
  UpdateWhatheppeningBody,
  WhatheppeningListResult,
  WhathappeningShowQuery,
  SetOrderCurrentDisplayBody,
} from './whathappening_controller.interfaces';
import DocumentRepository from '../repositories/document_repository';
import HistoryStampService from '../services/history_stamp_service';
import CategoryRepository from '../repositories/category_repository';
import WhathappeningService from '../services/what_happening_service';
import { WhathappeningQueryResponse } from '../services/what_happening_service/index.interface';
import { whathappeningDetailSerealizer, whathappeningListSerealizer } from './whathappening_controller.serializer';

@Route('whathappening')
export class Whatheppening extends Controller {
  @Get()
  @OperationId('whathappening.show')
  public async whathappeningShow(
    @Queries() query: WhathappeningShowQuery,
  ): Promise<WrappedResponse<WhathappeningQueryResponse[]>> {
    const { limit, page } = query;
    const whathappeningService = new WhathappeningService();
    const category = await whathappeningService.getCategory();
    if (!category) {
      return { data: [] };
    }
    const result = await whathappeningService.findAll(category.id, query);

    if (limit !== undefined && page !== undefined) {
      const countResult = await whathappeningService.count(category.id, query);
      const count = Number(countResult[0]?.count);
      const totalPages = Math.ceil(count / limit);
      const pagination: Pagination = {
        page_number: page,
        total: count,
        total_page: totalPages,
        page_size: limit,
      };
      return { data: result, pagination: pagination };
    }

    return {
      data: result,
      pagination: { page_number: 0, total: result.length, total_page: 1, page_size: result.length },
    };
  }

  @Get('{id}')
  @OperationId('whathappening.index')
  public async whathappeningIndex(@Path() id: string): Promise<WrappedResponse<WhatheppeningResult>> {
    const whathappeningService = new WhathappeningService();
    const result = await whathappeningService.getById(id);

    return {
      data: result ? whathappeningDetailSerealizer(result) : null,
    };
  }

  @Get('current/display')
  @OperationId('whathappening.currentDisplay')
  public async whathappeningCurrentDisplay(
    @Header('accept-language') language: string,
  ): Promise<WrappedResponse<WhatheppeningListResult[]>> {
    const whathappeningService = new WhathappeningService();
    const result = await whathappeningService.getCurrentDisplays();

    return {
      data: await whathappeningListSerealizer(result, language),
    };
  }

  @OperationId('whathappening.toggleCurrentDisplay')
  @Post('toggleCurrentDisplay/{id}')
  public async whathappeningToggleCurrentDisplay(
    @Path() id: string,
    @Header('x-account-id') accountId?: string,
  ): Promise<WrappedResponse<WhatheppeningResult | string>> {
    const whathappeningService = new WhathappeningService();
    try {
      const historyStampService = new HistoryStampService();
      await historyStampService.stampHistoryCategory(id, accountId, true);
      await historyStampService.stampHistoryDocument(id, accountId);
      const documentData = await whathappeningService.toggleCurrentDisplay(id);
      return documentData ? { data: whathappeningDetailSerealizer(documentData) } : { data: null };
    } catch (e) {
      if (e instanceof Error && e.message) {
        this.setStatus(400);
        return { data: e.message };
      }
      this.setStatus(500);
      return { data: null };
    }
  }

  @OperationId('whathappening.reorderCurrentDisplay')
  @Post('reorderCurrentDisplay/{id}')
  public async reorderCurrentDisplay(
    @Path() id: string,
    @Body() body: SetOrderCurrentDisplayBody,
    @Header('x-account-id') accountId?: string,
  ): Promise<WrappedResponse<WhatheppeningResult | string>> {
    const { seq } = body;
    const whathappeningService = new WhathappeningService();
    try {
      const historyStampService = new HistoryStampService();
      await historyStampService.stampHistoryCategory(id, accountId, true);
      await historyStampService.stampHistoryDocument(id, accountId);
      const documentData = await whathappeningService.setOrderCurrentDisplay(id, seq);
      return documentData ? { data: whathappeningDetailSerealizer(documentData) } : { data: null };
    } catch (e) {
      if (e instanceof Error && e.message) {
        this.setStatus(400);
        return { data: e.message };
      }
      this.setStatus(500);
      return { data: null };
    }
  }

  @Delete('{id}')
  @OperationId('whathappening.inactive')
  public async destroy(@Path() id: string): Promise<WrappedResponse<WhatheppeningResult | null>> {
    try {
      const whathappeningService = new WhathappeningService();
      const result = await whathappeningService.delete(id);
      this.setStatus(200);
      return result ? { data: whathappeningDetailSerealizer(result) } : { data: null };
    } catch (error) {
      console.error('Inactive whathappening error', error);
      return { data: null };
    }
  }

  @Post()
  @OperationId('whathappening.create')
  public async create(
    @Body() body: CreateWhatheppeningBody,
    @Header('x-account-id') accountId: string,
  ): Promise<WrappedResponse<WhatheppeningResult>> {
    try {
      if (body.published === false) {
        body.active = false;
      }
      const documentData = await DocumentRepository.create({
        data: body,
      });
      const categoryData = await CategoryRepository.findFirst({
        where: { id: body.category_id },
      });
      if (categoryData) {
        await CategoryRepository.update({
          where: { id: body.category_id },
          data: {
            ...categoryData,
            title: categoryData.title as Prisma.InputJsonValue,
            updated_by: accountId,
          },
        });
        const historyStampService = new HistoryStampService();
        await historyStampService.stampHistoryCategory(body.category_id, accountId, true);
      }
      this.setStatus(200);
      return { data: whathappeningDetailSerealizer(documentData) };
    } catch (error) {
      console.error('Create document error', error);
      return { data: null };
    }
  }

  @Put('{id}')
  @OperationId('whathappening.update')
  public async update(
    @Path() id: string,
    @Body() body: UpdateWhatheppeningBody,
    @Header('x-account-id') accountId?: string,
  ): Promise<WrappedResponse<WhatheppeningResult>> {
    try {
      const historyStampService = new HistoryStampService();
      await historyStampService.stampHistoryCategory(id, accountId, true);
      await historyStampService.stampHistoryDocument(id, accountId);
      const documentData = await DocumentRepository.update({
        where: {
          id,
        },
        data: { ...body, updated_by: accountId },
      });
      const categoryData = await CategoryRepository.findFirst({
        where: { id: body.category_id },
      });
      if (categoryData) {
        await CategoryRepository.update({
          where: { id: body.category_id },
          data: {
            ...categoryData,
            title: categoryData.title as Prisma.InputJsonValue,
            updated_by: accountId,
          },
        });
      }
      this.setStatus(200);
      return { data: whathappeningDetailSerealizer(documentData) };
    } catch (error) {
      console.error('Update whathappening error', error);
      return { data: null };
    }
  }

  @Post('processDisableOverdue')
  @OperationId('whathappening.processDisableOverdue')
  public async bulkUpdate(@Header('x-account-id') accountId?: string): Promise<WrappedResponse<string>> {
    const historyStampService = new HistoryStampService();
    const whathappeningService = new WhathappeningService();
    const category = await whathappeningService.getCategory();
    if (!category) {
      return { data: [] };
    }
    const replaceCurrentDisplays = await whathappeningService.getReplaceCurrentDisplay(category.id);
    const overdue = await whathappeningService.getOverdue(category.id);
    const data = [...replaceCurrentDisplays, ...overdue] as UpdateWhatheppeningBody[];
    for (let i = 0; i < data.length; i++) {
      await historyStampService.stampHistoryCategory(data[i].id as string, accountId, true);
      await historyStampService.stampHistoryDocument(data[i].id as string, accountId);
    }
    const result = await whathappeningService.bulkUpdate(data, accountId ?? '');
    return { data: `Success update ${result} items.` };
  }

  @Delete('deleteDraft/{id}')
  @OperationId('whathappening.deleteDraft')
  public async deleteDraft(@Path() id: string): Promise<WrappedResponse<string | null>> {
    try {
      const whathappeningService = new WhathappeningService();
      await whathappeningService.deleteDraft(id);
      this.setStatus(200);
      return { data: null };
    } catch (error) {
      if (error instanceof Error && error.message) {
        this.setStatus(400);
        return { data: error.message };
      }
      this.setStatus(500);
      return { data: null };
    }
  }
}
