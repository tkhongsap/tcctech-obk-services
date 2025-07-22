import BaseController from './base_controller';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas } from '../openapi/interfaces/schemas';

export default class RecipientController extends BaseController {
  public async create(
    req: TypedRequest<schemas['CreateRecipientRequest']>,
    res: TypedResponse<schemas['CreateRecipientResponse']>,
  ) {
    res.json({
      data: {
        result: true,
      },
    });
  }
}
