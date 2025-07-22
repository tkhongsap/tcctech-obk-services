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
   * status: 404, message: 'Token not found'
   */
  IAM_IDT_001: {
    errorCode: 'IAM_IDT_001',
    status: 404,
    message: 'Token not found',
  },
  /**
   * status: 500, message: 'Identity already exists'
   */
  IAM_IDT_002: {
    errorCode: 'IAM_IDT_002',
    status: 500,
    message: 'Identity already exists',
  },
  /**
   * status: 500, message: 'Account not found'
   */
  IAM_IDT_003: {
    errorCode: 'IAM_IDT_003',
    status: 500,
    message: 'Account not found',
  },
  /**
   * status: 401, message: 'OTP is not validated'
   */
  IAM_IDT_004: {
    errorCode: 'IAM_IDT_004',
    status: 401,
    message: 'OTP is not validated',
  },
  /**
   * status: 402, message: '%s Identity does not exist'
   */
  IAM_STT_001: {
    errorCode: 'IAM_STT_001',
    status: 402,
    message: '%s Identity does not exist',
  },
  /**
   * status: 404, message: 'Token not found'
   */
  IAM_AUTH_001: {
    errorCode: 'IAM_AUTH_001',
    status: 404,
    message: 'Token not found',
  },
  /**
   * status: 500, message: 'Cannot update account'
   */
  IAM_ACC_001: {
    errorCode: 'IAM_ACC_001',
    status: 500,
    message: 'Cannot update account',
  },
  /**
   * status: 400, message: 'an account-id is not found'
   */
  IAM_ACC_002: {
    errorCode: 'IAM_ACC_002',
    status: 400,
    message: 'an account-id is not found',
  },
  /**
   * status: 400, message: 'Invalid input: %s is not required'
   */
  IAM_ACC_003: {
    errorCode: 'IAM_ACC_003',
    status: 400,
    message: 'Invalid input: %s is not required',
  },
  /**
   * status: 500, message: 'identity does not exist!'
   */
  IAM_IDT_005: {
    errorCode: 'IAM_IDT_005',
    status: 500,
    message: 'identity does not exist!',
  },
  /**
   * status: 500, message: 'Identity can not be empty'
   */
  IAM_IDT_006: {
    errorCode: 'IAM_IDT_006',
    status: 500,
    message: 'Identity can not be empty',
  },
  /**
   * status: 500, message: 'Password cannot be null'
   */
  IAM_ACC_004: {
    errorCode: 'IAM_ACC_004',
    status: 500,
    message: 'Password cannot be null',
  },
  /**
   * status: 500, message: 'Password can not found'
   */
  IAM_ACC_005: {
    errorCode: 'IAM_ACC_005',
    status: 500,
    message: 'Password can not found',
  },
  /**
   * status: 500, message: 'Cannot link external identity'
   */
  IAM_IDT_007: {
    errorCode: 'IAM_IDT_007',
    status: 500,
    message: 'Cannot link external identity',
  },
  /**
   * status: 401, message: 'Login failed'
   */
  IAM_AUTH_002: {
    errorCode: 'IAM_AUTH_002',
    status: 401,
    message: 'Login failed',
  },
  /**
   * status: 500, message: 'Account was deleted'
   */
  IAM_AUTH_003: {
    errorCode: 'IAM_AUTH_003',
    status: 500,
    message: 'Account was deleted',
  },
  /**
   * status: 500, message: 'Cannot reset password'
   */
  IAM_ACC_006: {
    errorCode: 'IAM_ACC_006',
    status: 500,
    message: 'Cannot reset password',
  },
  /**
   * status: 429, message: 'OTP reach requested limited'
   */
  IAM_OTP_001: {
    errorCode: 'IAM_OTP_001',
    status: 429,
    message: 'OTP reach requested limited',
  },
  /**
   * status: 500, message: 'Generating otp failed'
   */
  IAM_OTP_002: {
    errorCode: 'IAM_OTP_002',
    status: 500,
    message: 'Generating otp failed',
  },
  /**
   * status: 500, message: 'Invalid OTP'
   */
  IAM_OTP_003: {
    errorCode: 'IAM_OTP_003',
    status: 500,
    message: 'Invalid OTP',
  },
  /**
   * status: 500, message: 'OTP Expired'
   */
  IAM_OTP_004: {
    errorCode: 'IAM_OTP_004',
    status: 500,
    message: 'OTP Expired',
  },
  /**
   * status: 500, message: 'Failed to generate token'
   */
  IAM_AUTH_004: {
    errorCode: 'IAM_AUTH_004',
    status: 500,
    message: 'Failed to generate token',
  },
  /**
   * status: 500, message: 'Cannot delete Identity default'
   */
  IAM_IDT_008: {
    errorCode: 'IAM_IDT_008',
    status: 500,
    message: 'Cannot delete Identity default',
  },
  /**
   * status: 500, message: 'Identity limit reached'
   */
  IAM_IDT_009: {
    errorCode: 'IAM_IDT_009',
    status: 500,
    message: 'Identity limit reached',
  },
  /**
   * status: 404, message: 'device not found'
   */
  IAM_ACC_007: {
    errorCode: 'IAM_ACC_007',
    status: 404,
    message: 'device not found',
  },
};
type errorCode = keyof typeof OBError;
export type errorObject = (typeof OBError)[errorCode];
