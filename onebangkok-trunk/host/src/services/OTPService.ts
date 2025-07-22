import {logWrapper} from '~/utils/logWrapper';
import * as OB_IAM_SDK from 'ob-iam-sdk';

type ServiceBaseData = {
  [key: string]: any;
};

type ServiceBaseError = {
  code: string;
  message: string;
  statusCode: string;
};

type ServiceBaseResult = {
  data: ServiceBaseData | undefined;
  error: ServiceBaseError | undefined;
};

export class OTPService {
  constructor() {}

  private _serializeResponse(result: any): ServiceBaseResult {
    let data, error;

    const resStatus = result.status;

    if (resStatus === 200) {
      data = result?.data?.data;
    } else {
      error = {
        statusCode: resStatus.toString(),
        code: result?.data?.error?.code,
        message: result?.data?.error?.message,
      };
    }
    const serializedResponse = {data, error};

    return serializedResponse;
  }

  static create() {
    return logWrapper(new OTPService());
  }

  async request(
    identifier: string,
    provider: string,
  ): Promise<ServiceBaseResult> {
    const result = await OB_IAM_SDK.client.otpRequest({
      identity: {
        identifier: identifier,
        provider: provider as any,
      },
    });

    return this._serializeResponse(result);
  }

  async verify(
    code: string,
    reference: string,
  ): Promise<ServiceBaseResult | undefined> {
    const result = await OB_IAM_SDK.client.otpVerify({
      otp: {
        code,
        reference,
      },
    });
    return this._serializeResponse(result);
  }
}
