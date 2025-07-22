import {logWrapper} from '~/utils/logWrapper';
import authenState from '~/states/authen/authenState';
import * as OB_IAM_SDK from 'ob-iam-sdk';
import {headerAccessToken} from '~/helpers/api';

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

class QRTokenService {
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
    return logWrapper(new QRTokenService());
  }

  async get(): Promise<ServiceBaseResult> {
    const result = await OB_IAM_SDK.client.qrTokenShow(headerAccessToken());

    return this._serializeResponse(result);
  }

  async generate(): Promise<ServiceBaseResult> {
    const token = authenState.token.get();
    const result = await OB_IAM_SDK.client.qrTokenGetEncryptedData(
      headerAccessToken(),
    );

    return this._serializeResponse(result);
  }
}

const qrTokenService = new QRTokenService();
export default qrTokenService;
