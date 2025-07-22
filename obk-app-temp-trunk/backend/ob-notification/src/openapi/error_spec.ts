// please copy only from https://docs.google.com/spreadsheets/d/1Q1QVr8HmbGDgJGA84Vw7TtOmOWaGwqnVlR49nU1KpxI/edit?usp=sharing
// if you need add new error, please define in above link to copy the result from sheet

export const OBError = {
  // TODO: errorCode format {service_name}_{sub_service_name}_{order} ex. IAM_IDT_001 and will move this to util

  /**
   * status: 500, message: 'internal server error'
   */
  OB_001: {
    errorCode: 'OB_001',
    status: 500,
    message: 'internal server error',
  },
  /**
   * status: 408, message: 'request timeout'
   */
  OB_002: { errorCode: 'OB_002', status: 408, message: 'request timeout' },
  /**
   * status: 405, message: 'method not allowed'
   */
  OB_003: { errorCode: 'OB_003', status: 405, message: 'method not allowed' },
  /**
   * status: 404, message: 'API not found'
   */
  OB_004: { errorCode: 'OB_004', status: 404, message: 'API not found' },
  /**
   * status: 403, message: 'forbidden'
   */
  OB_005: { errorCode: 'OB_005', status: 403, message: 'forbidden' },
  /**
   * status: 401, message: 'unauthorized'
   */
  OB_006: { errorCode: 'OB_006', status: 401, message: 'unauthorized' },
  /**
   * status: 400, message: 'invalid parameters, %s'
   */
  OB_007: {
    errorCode: 'OB_007',
    status: 400,
    message: 'invalid parameters, %s',
  },
  /**
   * status: 403, message: 'Permssion denied'
   */
  OB_008: { errorCode: 'OB_008', status: 403, message: 'Permssion denied' },
  /**
   * status: 500, message: 'AWS client not found'
   */
  OB_009: { errorCode: 'OB_009', status: 500, message: 'AWS client not found' },
};
type errorCode = keyof typeof OBError;
export type errorObject = (typeof OBError)[errorCode];
