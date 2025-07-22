import { Controller, Get, OperationId, Route, Queries, Header, Path, Delete, Post, Put, Body } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { Prisma } from '../../db/client';
import {
  DocumentResult,
  DocumentIndexQuery,
  CreateDocumentBody,
  UpdateDocumentBody,
  DocumentListResult,
} from './document_controller.interfaces';
import Enumerable = Prisma.Enumerable;
import documentWhereInput = Prisma.documentWhereInput;
import DocumentRepository from '../repositories/document_repository';
import {
  documentListSerealizer,
  documentDetailSerealizer,
  documentDetailLanguageSerealizer,
} from './document_controller.serializer';
import HistoryStampService from '../services/history_stamp_service';
import CategoryRepository from '../repositories/category_repository';

@Route('documents')
export class Document extends Controller {
  @Get('')
  @OperationId('documents.show')
  public async show(
    @Header('accept-language') language: string,
    @Queries() query: DocumentIndexQuery,
  ): Promise<WrappedResponse<DocumentListResult>> {
    const { category_id, released, active } = query;
    let AND: Enumerable<documentWhereInput> = { release_date: null };
    const isActive = active;
    const isReleased = released;
    if (isActive) {
      AND = { active: isActive };
    }
    if (isReleased) {
      AND = { ...AND, release_date: { not: null } };
    }
    if (category_id) {
      AND = { ...AND, category_id };
    }

    AND = { ...AND, deleted_at: null };

    const documentData = await DocumentRepository.findMany({ where: AND });
    return { data: await documentListSerealizer(documentData, language) };
  }

  @OperationId('documents.index')
  @Get('{id}')
  public async index(
    @Header('accept-language') language: string,
    @Path() id: string,
  ): Promise<WrappedResponse<DocumentResult>> {
    const OR: Enumerable<documentWhereInput> = [{ id: id }, { slug: id }];
    const AND: Enumerable<documentWhereInput> = { deleted_at: null, published: true };

    const documentData = await DocumentRepository.findFirst({ where: { OR, AND } });
    return documentData ? { data: documentDetailLanguageSerealizer(documentData, language) } : { data: null };
  }

  @Delete('{id}')
  @OperationId('documents.destroy')
  public async destroy(@Path() id: string): Promise<WrappedResponse<true>> {
    try {
      await DocumentRepository.update({
        where: {
          id,
        },
        data: {
          active: false,
          deleted_at: new Date(),
        },
      });

      this.setStatus(200);
      return { data: true };
    } catch (error) {
      console.error('Delete document error', error);
      return { data: null };
    }
  }

  @Post()
  @OperationId('documents.create')
  public async create(
    @Body() body: CreateDocumentBody,
    @Header('x-account-id') accountId: string,
  ): Promise<WrappedResponse<DocumentResult>> {
    try {
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
      return { data: documentDetailSerealizer(documentData) };
    } catch (error) {
      console.error('Create document error', error);
      return { data: null };
    }
  }

  @Put('{id}')
  @OperationId('documents.update')
  public async update(
    @Path() id: string,
    @Body() body: UpdateDocumentBody,
    @Header('x-account-id') accountId?: string,
  ): Promise<WrappedResponse<DocumentResult>> {
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
      return { data: documentDetailSerealizer(documentData) };
    } catch (error) {
      console.error('Update document error', error);
      return { data: null };
    }
  }
}
