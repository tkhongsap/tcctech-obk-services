import { Controller, Get, OperationId, Route, Post, Body, Header, Put, Path, Delete, Queries } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import FeedbackRepository from '../repositories/feedback_repository';
import { FeedbackSerializer, FeedbacksSerializer } from './feedback_controller.serializer';
import {
  FeedbackResult,
  CreateFeedbackBody,
  PutfeedbackBody,
  FeedbackIndexQuery,
} from './feedback_controller.interfaces';

import { Prisma } from '../../db/client';
import Enumerable = Prisma.Enumerable;
import feedbackWhereInput = Prisma.feedbackWhereInput;
@Route('feedback')
export class Feedback extends Controller {
  @Get('')
  @OperationId('feedback.show')
  public async show(
    @Header('x-account-id') accountid: string,
    @Queries() query: FeedbackIndexQuery,
  ): Promise<WrappedResponse<FeedbackResult>> {
    const { document_id } = query;
    let AND: Enumerable<feedbackWhereInput> = {};
    if (document_id) {
      AND = { ...AND, document_id };
    }
    const feedbackData = await FeedbackRepository.findMany({ where: AND });
    this.setStatus(200);
    return { data: feedbackData.length > 0 ? FeedbacksSerializer(feedbackData) : null };
  }
  @OperationId('feedback.create')
  @Post()
  public async create(
    @Body() body: CreateFeedbackBody,
    @Header('x-account-id') accountid: string,
  ): Promise<WrappedResponse<FeedbackResult>> {
    try {
      const { document_id, like } = body;
      const feedbackData = await FeedbackRepository.create({
        data: {
          account_id: accountid,
          document_id: document_id,
          like: like,
        },
      });
      this.setStatus(200);
      return { data: FeedbackSerializer(feedbackData) };
    } catch (error) {
      return { data: null };
    }
  }

  @OperationId('feedback.update')
  @Put('{id}')
  public async Update(@Path() id: string, @Body() body: PutfeedbackBody): Promise<WrappedResponse<FeedbackResult>> {
    try {
      const { like } = body;
      const feedbackData = await FeedbackRepository.update({
        where: {
          id: id,
        },
        data: {
          like: like,
        },
      });

      this.setStatus(200);
      return { data: FeedbackSerializer(feedbackData) };
    } catch (error) {
      return { data: null };
    }
  }
  @Delete('{id}')
  @OperationId('feedback.destroy')
  public async destroy(@Path() id: string): Promise<WrappedResponse<true>> {
    try {
      await FeedbackRepository.delete({
        where: {
          id,
        },
      });

      this.setStatus(200);
      return { data: true };
    } catch (error) {
      return { data: null };
    }
  }
}
