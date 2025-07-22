import { Prisma } from '../../db/client';
import { FeedbackResult } from './feedback_controller.interfaces';
function FeedbacksSerializer(feedback: Prisma.feedbackGetPayload<true>[]): FeedbackResult[] {
  return feedback.map((item) => {
    return {
      id: item.id,
      account_id: item.account_id,
      document_id: item.document_id,
      like: item.like,
      created_at: item.created_at?.toISOString(),
      updated_at: item.updated_at?.toISOString(),
    };
  });
}
function FeedbackSerializer(feedback: Prisma.feedbackGetPayload<true>): FeedbackResult {
  return {
    id: feedback.id,
    account_id: feedback.account_id,
    document_id: feedback.document_id,
    like: feedback.like,
    created_at: feedback.created_at?.toISOString(),
    updated_at: feedback.updated_at?.toISOString(),
  };
}
export { FeedbackSerializer, FeedbacksSerializer };
