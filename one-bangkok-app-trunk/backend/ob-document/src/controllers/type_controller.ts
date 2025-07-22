import { TypedRequestBody, TypedResponse } from '../libs/custom_express';
import { NextFunction } from 'express';
import { get } from 'lodash';
import { logging } from 'ob-common-lib/dist';
import { type } from '../../db/client';
import BaseController from './base_controller';
import { schemas } from '../openapi/interfaces/schemas';
import TypeService from '../services/type_service/service';

export default class TypeController extends BaseController {
  public async get(
    req: TypedRequestBody<never>,
    res: TypedResponse<schemas['DocumentTypeResponse']>,
    next: NextFunction,
  ){
    try {
      logging.info('start call get type');
      const typeService = new TypeService();
      const query = get(req, 'query');
      const name = get(query, 'name', '').toString();
      let result: type[] = [];
      if (name) {
        result = await typeService.getTypeByName(name);
      } else {
        result = await typeService.getTypeAll();
      }
      logging.info('finish call get type');
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
