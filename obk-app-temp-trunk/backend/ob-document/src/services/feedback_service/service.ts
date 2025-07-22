import { logging } from 'ob-common-lib/dist';
import { FeedbackRepository } from '../../repositories/feedback_repository';
import { Prisma, feedback } from '../../../db/client';
import {
  feedbackData,
  feedback as resFeedBack,
} from '../../openapi/interfaces/schemas';
export default class FeedbackService {
  private readonly feedbackRepository: FeedbackRepository;
  constructor(listRepository?: FeedbackRepository) {
    this.feedbackRepository = listRepository || new FeedbackRepository();
  }
  public async findAll(data: Prisma.feedbackWhereInput) {
    logging.info('start call feedback service - get feedback lists');
    const result = await this.feedbackRepository.findMany(data);
    return result;
  }

  public async serealizeFeedback(feedback: feedback): Promise<resFeedBack> {
    return {
      id: feedback.id,
      account_id: feedback.account_id,
      document_id: feedback.document_id,
      like: feedback.like,
      created_at: feedback.created_at?.toISOString(),
      updated_at: feedback.updated_at?.toISOString(),
    };
  }

  public async serealizeFeedbacks(
    feedbacks: feedback[],
  ): Promise<feedbackData> {
    return Promise.all(
      feedbacks.map(async (feedback) => {
        return await this.serealizeFeedback(feedback);
      }),
    );
  }
  public async create(
    documentId: string,
    like: boolean,
    accountId: string,
  ): Promise<feedback> {
    logging.info('start call feedback service - create feedback');
    const result: feedback = await this.feedbackRepository.create(
      documentId,
      accountId,
      like,
    );
    return result;
  }
  public async update(id: string, like: boolean): Promise<feedback> {
    logging.info('start call feedback service - update feedback');
    const result: feedback = await this.feedbackRepository.update({
      where: { id },
      data: { like },
    });
    return result;
  }
}
