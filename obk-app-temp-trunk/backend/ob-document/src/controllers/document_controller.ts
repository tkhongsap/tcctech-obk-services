import { TypedRequestBody, TypedResponse } from '../libs/custom_express';
import { NextFunction } from 'express';
import DocumentService from '../services/document_service/service';
import { get } from 'lodash';
import { languageSelector, logging } from 'ob-common-lib/dist';
import BaseController from './base_controller';
import { schemas } from '../openapi/interfaces/schemas';
import { document } from '../../db/client';

export default class DocumentController extends BaseController {
  public async getAll(
    req: TypedRequestBody<never>,
    res: TypedResponse<schemas['DocumentListsResponse']>,
    next: NextFunction,
  ) {
    try {
      logging.info('start call get faqs lists.');
      const language = get(req.headers, 'accept-language', '*').toString();
      const documentService = new DocumentService();
      const category_id = get(get(req, 'query'), 'category_id', '').toString();
      const isActive = JSON.parse(
        get(get(req, 'query'), 'active', '').toString(),
      );
      const isReleased = JSON.parse(
        get(get(req, 'query'), 'released', '').toString(),
      );
      const result = await documentService.getFaqsLists(
        category_id,
        isActive,
        isReleased,
      );
      const response = await this.documentListSerealizer(result, language);
      logging.info('finish call get faqs list');
      res.json({ data: response });
    } catch (error) {
      next(error);
    }
  }

  public async getByIdOrSlug(
    req: TypedRequestBody<never>,
    res: TypedResponse<schemas['DocumentDetailResponse']>,
    next: NextFunction,
  ) {
    try {
      logging.info('start call get document detail');
      const language = get(req.headers, 'accept-language', '*').toString();
      const documentService = new DocumentService();
      const {
        params: { id },
      } = req;
      const result = await documentService.getDetail(id);
      logging.info('finish call get document detail');
      const response = await this.documentDetailSerealizer(result, language);
      res.json({
        data: {
          document: {
            ...response,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  private documentSerealizer(data: object, language: string) {
    return {
      id: get(data, 'id', ''),
      title: languageSelector(get(data, 'title', '') as never, language) as any,
    };
  }

  private documentDetailSerealizer(data: object, language: string) {
    const title = languageSelector(get(data, 'title', '') as never, language);
    const body = languageSelector(get(data, 'body', '') as never, language);
    return {
      id: get(data, 'id', ''),
      title:
        title instanceof Object ? JSON.stringify(title) : (title as string),
      body: body instanceof Object ? JSON.stringify(body) : (body as string),
      image: get(data, 'image', ''),
    };
  }

  private async documentListSerealizer(result: document[], language: string) {
    const response: schemas['DocumentListsResponseData'] = [];

    result.forEach(async (row) => {
      const res = await this.documentSerealizer(row, language);

      response.push({
        ...res,
      });
    });
    return response;
  }
}
