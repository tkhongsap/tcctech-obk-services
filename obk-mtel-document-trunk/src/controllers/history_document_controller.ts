import { Get, OperationId, Route, Queries, Path } from 'tsoa';

import { QueriesController, WrappedResponse } from './base_controller.interfaces';
import { HistoryDocumentIndexQuery, HistoryDocumentResult } from './history_document_controller.interfaces';
import { historyDocumentsSerializer, historyDocumentDetailSerializer } from './history_document_controller.serializer';
import HistoryDocumentRepository from '../repositories/history_document_repository';

@Route('history-document')
export class HistoryDocument extends QueriesController {
  @Get('')
  @OperationId('historyDocument.index')
  public async index(@Queries() query: HistoryDocumentIndexQuery): Promise<WrappedResponse<HistoryDocumentResult[]>> {
    const _query = this.buildQuery({ ...query }) as object;
    const historyDocumentData = await HistoryDocumentRepository.findMany({
      ..._query,
      include: { history_category: true },
    });
    const data = await historyDocumentsSerializer(historyDocumentData);

    return { data };
  }

  @Get('{id}')
  @OperationId('historyDocument.detail')
  public async detail(@Path() id: string): Promise<WrappedResponse<HistoryDocumentResult>> {
    const historyCategoryData = await HistoryDocumentRepository.findFirst({
      where: { id },
    });

    let data;

    if (historyCategoryData) data = await historyDocumentDetailSerializer(historyCategoryData);

    return { data: data || null };
  }
}
