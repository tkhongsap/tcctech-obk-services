import { Provider } from './index.interface';

export interface identityObject {
  provider: Provider;
  identifier: string;
  country_code?: string;
}
export interface OtpBody {
  identity: identityObject;
}

interface OtpObjectResult {
  reference: string;
}
export interface OtpResult {
  otp: OtpObjectResult;
}
interface verifyOtpObject {
  reference: string;
  code: string;
}

export interface verifyOtpBody {
  otp: verifyOtpObject;
}
export interface verifyOtpResult {
  otp: { id: string };
}
