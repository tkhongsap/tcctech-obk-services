import { get } from 'lodash';
import { logging, JsonConvert } from 'ob-common-lib/dist';
import { CustomError } from '../middlewares/error_middleware';
import { MessageTemplateData } from '../services/interfaces/message_template_interface';
import { MessageService } from '../services/message_service';
import BaseController from './base_controller';
import { schemas } from '../openapi/interfaces/schemas';
import { TypedRequest, TypedResponse } from '../libs/custom_express';

export default class MessageTemplateController extends BaseController {
  public async create(
    req: TypedRequest<schemas['CreateMessageTemplateRequest']>,
    res: TypedResponse<schemas['CreateMessageTemplateResponse']>,
  ) {
    logging.info('start call create message template');

    // improve to check header in future
    const body = get(req, 'body');
    const template = get(body, 'template');

    if (!template) {
      throw new CustomError(400, 'Template cannot be null');
    }

    const payloadMessageTemplate: MessageTemplateData = {
      name: template.name,
      title: template.title,
      subTitle: template.sub_title,
      messageTypeId: template.message_category_id,
      thumbnail: template.thumbnail,
      deeplink: template.deeplink,
      data: JsonConvert.objectToJson(template.data),
    };

    const messageService = new MessageService();
    await messageService.createTemplate(payloadMessageTemplate);

    logging.info('finish call create message template');
    res.json({
      data: {
        result: true,
      },
    });
  }
}
