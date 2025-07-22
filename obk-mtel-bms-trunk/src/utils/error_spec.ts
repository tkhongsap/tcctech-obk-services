// please copy only from https://docs.google.com/spreadsheets/d/1Q1QVr8HmbGDgJGA84Vw7TtOmOWaGwqnVlR49nU1KpxI/edit?usp=sharing
// if you need add new error, please define in above link to copy the result from sheet

export const OBError = {
  // TODO: errorCode format {service_name}_{sub_service_name}_{order} ex. IAM_IDT_001 and will move this to util

  /**
   * status: 500, message: 'internal server error'
   */
  OB_001: { errorCode: 'OB_001', status: 500, message: 'internal server error' },
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
  OB_007: { errorCode: 'OB_007', status: 400, message: 'invalid parameters, %s' },
  /**
   * status: 403, message: 'Permssion denied'
   */
  OB_008: { errorCode: 'OB_008', status: 403, message: 'Permssion denied' },
  /**
   * status: 500, message: 'AWS client not found'
   */
  OB_009: { errorCode: 'OB_009', status: 500, message: 'AWS client not found' },
  /**
   * status: 400, message: 'command not found'
   */
  BMS_CMD_001: { errorCode: 'BMS_CMD_001', status: 400, message: 'command not found' },
  /**
   * status: 400, message: 'floor does not exist'
   */
  BMS_LCT_001: { errorCode: 'BMS_LCT_001', status: 400, message: 'floor does not exist' },
  /**
   * status: 400, message: 'an account-id is not found'
   */
  BMS_MEMB_001: { errorCode: 'BMS_MEMB_001', status: 400, message: 'an account-id is not found' },
  /**
   * status: 404, message: 'Device id not found'
   */
  BMS_MEMB_002: { errorCode: 'BMS_MEMB_002', status: 404, message: 'Device id not found' },
  /**
   * status: 400, message: 'Cannot create command'
   */
  BMS_CMD_002: { errorCode: 'BMS_CMD_002', status: 400, message: 'Cannot create command' },
  /**
   * status: 400, message: 'Cannot update pass'
   */
  BMS_PASS_001: { errorCode: 'BMS_PASS_001', status: 400, message: 'Cannot update pass' },
  /**
   * status: 404, message: 'Cannot found pass'
   */
  BMS_PASS_002: { errorCode: 'BMS_PASS_002', status: 404, message: 'Cannot found pass' },
  /**
   * status: 400, message: 'Cannot create pass'
   */
  BMS_PASS_003: { errorCode: 'BMS_PASS_003', status: 400, message: 'Cannot create pass' },
  /**
   * status: 400, message: 'FS_CREDENTIALS_MISSING'
   */
  BMS_FS_001: { errorCode: 'BMS_FS_001', status: 400, message: 'FS_CREDENTIALS_MISSING' },
  /**
   * status: 401, message: 'FS_AUTHENTICATION_FAILED'
   */
  BMS_FS_002: { errorCode: 'BMS_FS_002', status: 401, message: 'FS_AUTHENTICATION_FAILED' },
  /**
   * status: 404, message: 'File not found in S3'
   */
  BMS_FS_003: { errorCode: 'BMS_FS_003', status: 404, message: 'File not found in S3' },
  /**
   * status: 400, message: 'Cannot delete visitor pass'
   */
  BMS_FS_005: { errorCode: 'BMS_FS_005', status: 400, message: 'Cannot delete visitor pass' },
  /**
   * status: 400, message: 'type mismatch'
   */
  BMS_WEBH_001: { errorCode: 'BMS_WEBH_001', status: 400, message: 'type mismatch' },
  /**
   * status: 400, message: 'Member not found'
   */
  BMS_MEMB_003: { errorCode: 'BMS_MEMB_003', status: 400, message: 'Member not found' },
  /**
   * status: 400, message: 'cannot find visitor'
   */
  BMS_VIST_001: { errorCode: 'BMS_VIST_001', status: 400, message: 'cannot find visitor' },
  /**
   * status: 400, message: 'Cannot create and update Floor'
   */
  BMS_LCT_002: { errorCode: 'BMS_LCT_002', status: 400, message: 'Cannot create and update Floor' },
  /**
   * status: 400, message: 'cannot create Visitor'
   */
  BMS_VIST_002: { errorCode: 'BMS_VIST_002', status: 400, message: 'cannot create Visitor' },
  /**
   * status: 400, message: 'cannot delete Visitor'
   */
  BMS_VIST_003: { errorCode: 'BMS_VIST_003', status: 400, message: 'cannot delete Visitor' },
  /**
   * status: 400, message: 'cannot find parking ticket'
   */
  BMS_PKT_001: { errorCode: 'BMS_PKT_001', status: 400, message: 'cannot find parking ticket' },
  /**
   * status: 404, message: 'cannot found location'
   */
  BMS_LCT_003: { errorCode: 'BMS_LCT_003', status: 404, message: 'cannot found location' },
  /**
   * status: 400, message: 'Cannot create and update Project'
   */
  BMS_JOB_001: { errorCode: 'BMS_JOB_001', status: 400, message: 'Cannot create and update Project' },
  /**
   * status: 400, message: 'Cannot create and update Tower'
   */
  BMS_JOB_002: { errorCode: 'BMS_JOB_002', status: 400, message: 'Cannot create and update Tower' },
  /**
   * status: 400, message: 'Cannot create and update Zone'
   */
  BMS_JOB_003: { errorCode: 'BMS_JOB_003', status: 400, message: 'Cannot create and update Zone' },
  /**
   * status: 400, message: 'Cannot create and update Location'
   */
  BMS_LCT_004: { errorCode: 'BMS_LCT_004', status: 400, message: 'Cannot create and update Location' },
  /**
   * status: 400, message: 'cannot update visitor'
   */
  BMS_VIST_004: { errorCode: 'BMS_VIST_004', status: 400, message: 'cannot update visitor' },
  /**
   * status: 400, message: 'cannot update default floor'
   */
  BMS_FS_004: { errorCode: 'BMS_FS_004', status: 400, message: 'cannot update default floor' },
  /**
   * status: 404, message: 'service request does not exist'
   */
  BMS_SR_001: { errorCode: 'BMS_SR_001', status: 404, message: 'service request does not exist' },
  /**
   * status: 400, message: 'air conditioner request does not exist'
   */
  BMS_ACR_001: { errorCode: 'BMS_ACR_001', status: 400, message: 'air conditioner request does not exist' },
  /**
   * status: 400, message: 'cannot create air conditioner request'
   */
  BMS_ACR_002: { errorCode: 'BMS_ACR_002', status: 400, message: 'cannot create air conditioner request' },
  /**
   * status: 400, message: 'cannot delete Visitor Schedule'
   */
  BMS_VS_001: { errorCode: 'BMS_VS_001', status: 400, message: 'cannot update visitor schedule' },
  /**
   * status: 404, message: ' does not exist'
   */
  BMS_IST_001: { errorCode: 'BMS_IST_001', status: 404, message: 'issue type does not exist' },
  /**
   * status: 400, message: 'request body is empty'
   */
  BMS_HOLIDAY_001: { errorCode: 'BMS_HOLIDAY_001', status: 400, message: 'request body is empty' },
  /**
   * status: 400, message: 'request body is empty'
   */
  BMS_HOLIDAY_002: { errorCode: 'BMS_HOLIDAY_002', status: 400, message: 'failed to parse date' },
  /**
   * status: 404, message: 'cannot found building access log'
   */
  BMS_BAL_001: { errorCode: 'BMS_BAL_001', status: 404, message: 'cannot found building access log' },
  /**
   * status: 400, message: 'unhandled accessortype'
   */
  BMS_BAL_002: { errorCode: 'BMS_BAL_002', status: 400, message: 'unhandled accessortype' },
  /**
   * status: 404, message: 'tenant does not exist'
   */
  BMS_TEN_001: { errorCode: 'BMS_TEN_001', status: 404, message: 'tenant does not exist' },
  /**
   * status: 500, message: 'fail to get parking space detail'
   */
  BMS_PKT_002: { errorCode: 'BMS_PKT_002', status: 500, message: 'fail to get parking space detail' },
  /**
   * status: 500, message: 'fail to get space detail by space no'
   */
  BMS_PKT_003: { errorCode: 'BMS_PKT_003', status: 500, message: 'fail to get space detail by space no' },
  /**
   * status: 500, message: 'plate number is not found'
   */
  BMS_PKT_004: { errorCode: 'BMS_PKT_004', status: 500, message: 'plate number is not found' },
  /**
   * status: 500, message: 'space number is not found'
   */
  BMS_PKT_005: { errorCode: 'BMS_PKT_005', status: 500, message: 'space number is not found' },
  /**
   * status: 400, message: 'cannot import parking ticket'
   */
  BMS_PKR_006: { errorCode: 'BMS_PKR_006', status: 400, message: 'cannot import parking ticket' },
  /**
   * status: 400, message: 'account id not found'
   */
  BMS_VAL_001: { errorCode: 'BMS_VAL_001', status: 400, message: 'account id not found' },
  /**
   * status: 400, message: 'valet parking not found'
   */
  BMS_VAL_002: { errorCode: 'BMS_VAL_002', status: 400, message: 'valet parking not found' },
  /**
   * status: 400, message: 'valet parking detail not found'
   */
  BMS_VAL_003: { errorCode: 'BMS_VAL_003', status: 400, message: 'valet parking detail not found' },
  /**
   * status: 400, message: 'space not available'
   */
  BMS_PKR_001: { errorCode: 'BMS_PKR_001', status: 400, message: 'parking space not available' },
  /**
   * status: 400, message: 'parking reservation not available'
   */
  BMS_PKR_002: { errorCode: 'BMS_PKR_002', status: 400, message: 'parking reservation not found' },
  /**
   * status: 400, message: 'cannot get resident id'
   */
  BMS_PRK_RESI_001: { errorCode: 'BMS_PRK_RESI_001', status: 400, message: 'cannot get resident id' },
  /**
   * status: 400, message: 'Cannot update tenant to shopper'
   */
  BMS_FSP_001: { errorCode: 'BMS_FSP_001', status: 400, message: 'Cannot update tenant to shopper' },
  /**
   * status: 400, message: 'Cannot update shopper to tenant'
   */
  BMS_FSP_002: { errorCode: 'BMS_FSP_002', status: 400, message: 'Cannot update shopper to tenant' },
  /**
   * status: 400, message: 'Cannot update visitor to app'
   */
  BMS_FSP_003: { errorCode: 'BMS_FSP_003', status: 400, message: 'Cannot update visitor to app' },
  /**
   * status: 400, message: 'Parking Ticket already imported'
   */
  BMS_FSP_004: { errorCode: 'BMS_FSP_004', status: 400, message: 'Parking Ticket already imported' },
};
type errorCode = keyof typeof OBError;
export type errorObject = (typeof OBError)[errorCode];
