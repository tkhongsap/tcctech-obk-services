import { TypedRequestBody, TypedResponse } from '../libs/custom_express';
import { logging } from 'ob-common-lib/dist';
import BaseController from './base_controller';
import { schemas } from '../openapi/interfaces/schemas';
import FeedbackService from '../services/feedback_service/service';
import { assign } from 'lodash';

export default class FeedbackController extends BaseController {
  public async find(
    req: TypedRequestBody<never>,
    res: TypedResponse<schemas['GetFeedbackResponseData']>,
  ) {
    logging.info('start call get feedback lists');
    const {
      headers: { 'x-account-id': accountId },
      query: { document_id: documentId },
    } = req;
    const data = {};
    assign(
      data,
      accountId && { account_id: accountId },
      documentId && { document_id: documentId },
    );
    const feedbackService = new FeedbackService();

    const feedbacks = await feedbackService.findAll(data);
    const result = await feedbackService.serealizeFeedbacks(feedbacks);
    logging.info('finish call get feedback list');
    res.json({ data: result });
  }
  public async create(
    req: TypedRequestBody<schemas['CreateFeedbackData']>,
    res: TypedResponse<schemas['FeedbackResponseData']>,
  ) {
    logging.info('start call create feedback');
    const { document_id: documentId, like } = req.body;
    const {
      headers: { 'x-account-id': accountId },
    } = req;
    const feedbackService = new FeedbackService();
    const feedback = await feedbackService.create(
      documentId,
      like,
      accountId as string,
    );
    const result = await feedbackService.serealizeFeedback(feedback);
    logging.info('finish call create feedback');
    res.json({ data: result });
  }

  public async update(
    req: TypedRequestBody<schemas['UpdateFeedbackData']>,
    res: TypedResponse<schemas['FeedbackResponseData']>,
  ) {
    logging.info('start call update feedback');
    const { like } = req.body;
    const { id } = req.params;
    const feedbackService = new FeedbackService();
    const feedback = await feedbackService.update(id, like);
    const result = await feedbackService.serealizeFeedback(feedback);
    logging.info('finish call update feedback');
    res.json({ data: result });
  }
}
