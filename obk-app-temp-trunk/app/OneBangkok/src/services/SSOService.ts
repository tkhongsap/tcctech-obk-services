import {logWrapper} from '~/utils/logWrapper';
import * as OB_IAM_SDK from 'ob-iam-sdk';

type ServiceBaseData = {
  [key: string]: any;
};

type ServiceBaseError = {
  statusCode: string;
};

type ServiceBaseResult = {
  data: ServiceBaseData | undefined;
  error: ServiceBaseError | undefined;
};

export class SSOService {
  constructor() {}

  private _serializeResponse(result: any): ServiceBaseResult {
    let data, error;

    const resStatus = result.status;
    if (resStatus === 200) {
      data = result?.data?.data;
    } else {
      error = {
        statusCode: resStatus.toString(),
      };
    }
    const serializedResponse = {data, error};

    return serializedResponse;
  }

  static create() {
    return logWrapper(new SSOService());
  }

  async link(
    identifier: string,
    uid: string,
    provider_type: 'google' | 'apple' | 'microsoft',
    meta: {},
  ): Promise<ServiceBaseResult> {
    const result = await OB_IAM_SDK.client.externalIdentityLink({
      identifier,
      uid,
      provider_type,
      meta,
    });

    return this._serializeResponse(result);
  }
}
