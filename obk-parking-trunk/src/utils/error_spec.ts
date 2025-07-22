// please copy only from https://docs.google.com/spreadsheets/d/1Q1QVr8HmbGDgJGA84Vw7TtOmOWaGwqnVlR49nU1KpxI/edit?usp=sharing
// if you need add new error, please define in above link to copy the result from sheet

export const OBError = {
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
  /**
  /**
   * status: 400, message: 'an account-id is not found'
   */
  PK_ACC_001: {
    errorCode: 'PK_ACC_001',
    status: 400,
    message: 'an account-id is not found',
  },
  /**
  /**
   * status: 400, message: 'cannot create parking detail'
   */
  PK_PKD_001: {
    errorCode: 'PK_PKD_001',
    status: 400,
    message: 'cannot create parking detail',
  },
  /**
   * status: 400, message: 'Parking detail not found'
   */
  PK_PKD_002: {
    errorCode: 'PK_PKD_002',
    status: 400,
    message: 'Parking detail not found',
  },
  /**
   * status: 400, message: 'Redeem parking failed.'
   */
  PK_PKD_003: {
    errorCode: 'PK_PKD_003',
    status: 400,
    message: 'Redeem parking failed.',
  },
  /**
   * status: 400, message: 'Duplicate parking detail logId.'
   */
  PK_PKD_004: {
    errorCode: 'PK_PKD_004',
    status: 400,
    message: 'Duplicate parking detail logId.',
  },
  /**
   * status: 400, message: 'RedeemerId not found.'
   */
  PK_PKD_005: {
    errorCode: 'PK_PKD_005',
    status: 400,
    message: 'RedeemerId not found.',
  },
  /**
   * status: 400, message: 'cannot find parking ticket'
   */
  PK_FS_001: {
    errorCode: 'PK_FS_001',
    status: 400,
    message: 'cannot find parking ticket',
  },
  CF_SW_001: {
    errorCode: 'CF_SW_001',
    status: 404,
    message: 'Store whitelist not found',
  },
  CF_DT_001: {
    errorCode: 'CF_DT_001',
    status: 404,
    message: 'Document type not found',
  },
  CF_DT_002: {
    errorCode: 'CF_DT_002',
    status: 409,
    message: 'Document type already exist',
  },
  /**
   * status: 400, message: 'ocr failed'
   */
  PK_OCR_001: {
    errorCode: 'PK_OCR_001',
    status: 400,
    message: 'ocr failed',
  },
  /**
   * status: 400, message: 'cannot generate presigned url'
   */
  PK_OCR_002: {
    errorCode: 'PK_OCR_002',
    status: 400,
    message: 'cannot generate presigned url',
  },
  /**
   * status: 400, message: 'bucket not found'
   */
  PK_OCR_003: {
    errorCode: 'PK_OCR_003',
    status: 400,
    message: 'bucket not found',
  },
  /**
   * status: 400, message: 'validate body not found'
   */
  PK_OCR_004: {
    errorCode: 'PK_OCR_004',
    status: 400,
    message: 'validate body not found',
  },
  /**
   * status: 400, message: 'cannot find receipt'
   */
  PK_RX_001: {
    errorCode: 'PK_RX_001',
    status: 400,
    message: 'cannot find receipt',
  },
  /**
   * status: 400, message: 'update receipt failed'
   */
  PK_RX_002: {
    errorCode: 'PK_RX_002',
    status: 400,
    message: 'update receipt failed',
  },
  /**
   * status: 400, message: 'No redeemable receipts found.'
   */
  PK_RX_003: {
    errorCode: 'PK_RX_003',
    status: 400,
    message: 'No redeemable receipts found.',
  },
  CF_CP_001: {
    errorCode: 'CF_CP_001',
    status: 400,
    message: 'Invalid campaign body',
  },
  CF_CP_002: {
    errorCode: 'CF_CP_002',
    status: 400,
    message: 'Campaign not found',
  },
  /**
   * status: 400, message: 'RateCode not found'
   */
  CF_CP_003: {
    errorCode: 'CF_CP_003',
    status: 400,
    message: 'RateCode not found',
  },
  /**
   * status: 400, message: 'Parking ticket redeem failed'
   */
  PK_BMS_001: {
    errorCode: 'PK_BMS_001',
    status: 400,
    message: 'Parking ticket redeem failed',
  },
  /**
   * status: 400, message: 'Member not found'
   */
  PK_BMS_002: {
    errorCode: 'PK_BMS_002',
    status: 400,
    message: 'Member not found',
  },
  /**
   * status: 400, message: 'Account not found'
   */
  PK_IAM_001: {
    errorCode: 'PK_IAM_001',
    status: 400,
    message: 'Account not found',
  },
  CF_PP_001: {
    errorCode: 'CF_PP_001',
    status: 404,
    message: 'Property name not found',
  },
  CF_PP_002: {
    errorCode: 'CF_MN_002',
    status: 409,
    message: 'Property name already exist',
  },
};

type errorCode = keyof typeof OBError;
export type errorObject = (typeof OBError)[errorCode];
