import { errorObject, OBError } from '../libs/error_spec';

export function isOpenAPIError(errorCode: string): boolean {
  return errorCode !== undefined && errorCode.includes('.openapi');
}

export function getErrorCodeOpenAPI(errorCode: string, error: number): errorObject {
  if (errorCode.includes('.validation')) {
    switch (error) {
      case 400:
        return OBError.OB_007;
      case 401:
        return OBError.OB_006;
      case 404:
        return OBError.OB_004;
      case 405:
        return OBError.OB_003;
      default:
        break;
    }
  }
  return OBError.OB_001;
}
