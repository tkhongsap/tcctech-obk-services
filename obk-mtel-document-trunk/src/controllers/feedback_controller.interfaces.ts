export interface FeedbackResult {
  id: string;
  account_id: string;
  document_id: string;
  like: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface CreateFeedbackBody {
  document_id: string;
  like: boolean;
}

export interface PutfeedbackBody {
  like: boolean;
}

export interface FeedbackIndexQuery {
  document_id?: string;
}
