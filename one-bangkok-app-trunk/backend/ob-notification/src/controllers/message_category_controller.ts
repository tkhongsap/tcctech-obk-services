import { logging } from 'ob-common-lib/dist';
import BaseController from './base_controller';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas } from '../openapi/interfaces/schemas';
import { MessageCategoryService } from '../services/message_category_service';
import { message_category } from '../../db/client';
import { get } from 'lodash';

export default class MessageCategoryController extends BaseController {
  public async findAll(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['GetMessageCategoryResponse']>,
  ) {
    logging.info('start call find all message category');

    const messageCategoryService = new MessageCategoryService();
    const result = await messageCategoryService.findAll({
      sequence: 'asc',
    });
    let response: schemas['GetMessageCategoryData'] = [];

    if (result !== null) {
      response = await this.messageCategoryListSerilizer(result);
    }
    logging.info('finish call find all message');
    res.json({
      data: response,
    });
  }

  public async countMessage(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['CountMessageCategoryResponse']>,
  ) {
    logging.info('start call find all message');

    const header = get(req, 'headers');
    const category = get(req.query, 'category') as string;
    const read = get(req.query, 'read') as boolean | undefined;
    const accountId = get(header, 'x-account-id', '').toString();
    const messageCategoryService = new MessageCategoryService();

    logging.info('start call count all message');
    const response = await messageCategoryService.countMessage(
      category,
      accountId,
      read,
    );
    logging.info('finish call count all message category');

    res.json({
      data: response,
    });
  }

  private async messageCategoryListSerilizer(result: message_category[]) {
    const response: schemas['GetMessageCategoryData'] = [];
    result.forEach(async (row) => {
      const res = await this.messageCategoryDataSerilizer(row);
      response.push({
        ...res,
      });
    });
    return response;
  }

  private async messageCategoryDataSerilizer(data: message_category) {
    const id = get(data, 'id', '') as string;
    const name = get(data, 'name', {}) as string;
    const sequence = get(data, 'sequence') as number;
    return { id: id, name: name, sequence };
  }
}
