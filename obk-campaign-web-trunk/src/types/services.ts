export interface AuthLoginPostBody {
  email: string;
  password: string;
}

export interface AuthLoginPostResponse {
  authToken: string;
}

export interface AuthMeGetResponse {
  id: string;
  created_at: string;
  name: string;
  email: string;
}

export interface SurveyGetResponse {
  id: number;
  survey_code: string;
  allow_multiple_responses: boolean;
  expire_date: string;
  title: string;
  description: null | string;
  question: Question;
  btn_submit: string;
  created_at: number;
  last_update_at: null | number;
  message?: string;
}

export interface Question {
  questions: QuestionItem[];
}

export interface QuestionItem {
  id: number;
  type: string;
  options: string[];
  question: string;
}

export interface SurveyPostBody {
  account_id: string;
  answer: Answer[];
  start_time?: string;
}

export interface SurveyPostResponse {
  id: number;
  survey_code: string;
  account_id: string;
  answer: Answer[];
  created_at: number;
}

export interface Answer {
  questionId: number;
  answer: string;
}

export interface QrInfoPostBody {
  ref_code: string;
}

export interface QrInfoPostResponse {
  id: number;
  account_id: string;
  ref_code: string;
  coupon_code: string;
  coupon_use: boolean;
  use_date: string | null;
  expire_date: number;
  created_at: number;
  last_update_at: number;
  message?: string;
}

export interface CouponGetBody {
  ref_code: string;
}

export interface CouponGetResponse {
  id: number;
  account_id: string;
  ref_code: string;
  coupon_code: string;
  coupon_use: boolean;
  use_date: string | null;
  expire_date: number;
  created_at: number;
  last_update_at: number;
  message?: string;
}

export interface CouponPostBody {
  ref_code: string;
}
export interface CouponPostResponse {
  id: number;
  account_id: string;
  ref_code: string;
  coupon_code: string;
  coupon_use: boolean;
  use_date: number;
  expire_date: number;
  created_at: number;
  last_update_at: number;
  message?: string;
}

export interface ActivityPostBody {
  name: string;
  data: {
    language?: string;
    account_id: string;
  };
}

export interface ActivityPostResponse {
  id: number;
  api_name: string;
  method: string;
  parameter: string;
  result_value: string;
  created_at: number;
}

export interface DynamicContentGetResponse {
  id: string;
  name: string;
  language: string;
  header: Header;
  description: Description;
  footer: Footer;
  button: Button;
  created_at: number;
}
export interface Header {
  header: HeaderOrFooter;
}
export interface HeaderOrFooter {
  title: string;
  subtitle: string;
  description: string;
}
export interface Description {
  sessions: Sessions;
}
export interface Sessions {
  session1: SessionsItem;
  session2: SessionsItem;
  session3: SessionsItem;
}
export interface SessionsItem {
  description: string;
}
export interface Footer {
  footer: HeaderOrFooter;
}
export interface Button {
  footer: Footer1;
}
export interface Footer1 {
  button1: string;
  button2: string;
  button3: string;
}
