import { template, templateSettings } from 'lodash';
import { CustomError } from '../middlewares/error_middleware';

export async function messageBuilder(
  originalMessage: string,
  replaceKey: object,
  replaceValue: object,
): Promise<string> {
  try {
    templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    const message = template(originalMessage, replaceKey)(replaceValue);
    return message;
  } catch (error) {
    throw new CustomError(400, `Cannot build message`);
  }
}
