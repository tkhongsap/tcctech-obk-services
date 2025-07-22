import { TypedRequestBody, TypedResponse } from '../libs/custom_express';
import { NextFunction } from 'express';
import { languageSelector, logging } from 'ob-common-lib/dist';
import BaseController from './base_controller';
import { schemas } from '../openapi/interfaces/schemas';
import CategoryService from '../services/category_service/service';
import { get } from 'lodash';
import { category } from '../../db/client';

type getCategory = {
  id?: string;
  type?: string;
};
export default class CategoryController extends BaseController {
  public async get(
    req: TypedRequestBody<''>,
    res: TypedResponse<schemas['DocumentResponse']>,
    next: NextFunction,
  ) {
    try {
      logging.info('start call get category');
      const categoryService = new CategoryService();
      const language = get(req.headers, 'accept-language', '*').toString();
      const { type, id }: getCategory = req.query;
      const result = await categoryService.getCategory(type || '', id || '');
      logging.info('finish call get category');
      const response = await this.categoryListSerealizer(result, language);
      res.json({ data: response });
    } catch (error) {
      next(error);
    }
  }
  private async categoryListSerealizer(result: category[], language: string) {
    const response: schemas['DocumentResponseData'] = [];

    result.forEach(async (row) => {
      const res = await this.categorySerealizer(row, language);

      response.push({
        ...res,
      });
    });
    return response;
  }

  private categorySerealizer(data: category, language: string) {
    const title = languageSelector(
      data.title as Record<string, never>,
      language,
    );

    return {
      id: data.id,
      title:
        title instanceof Object ? JSON.stringify(title) : (title as string),
      image: data.image === null ? '' : data.image,
    };
  }
}
