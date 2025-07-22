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
   * status: 500, message: 'Email template not found'
   */
  NOTI_MESG_001: { errorCode: 'NOTI_MESG_001', status: 500, message: 'Email template not found' },
  /**
   * status: 400, message: 'Cannot find recipient'
   */
  NOTI_MESG_002: { errorCode: 'NOTI_MESG_002', status: 400, message: 'Cannot find recipient' },
  /**
   * status: 500, message: 'Cannot update message'
   */
  NOTI_MESG_003: { errorCode: 'NOTI_MESG_003', status: 500, message: 'Cannot update message' },
  /**
   * status: 500, message: 'Cannot update all messages'
   */
  NOTI_MESG_004: { errorCode: 'NOTI_MESG_004', status: 500, message: 'Cannot update all messages' },
  /**
   * status: 500, message: 'Cannot find message'
   */
  NOTI_MESG_005: { errorCode: 'NOTI_MESG_005', status: 500, message: 'Cannot find message' },
  /**
   * status: 400, message: 'Data template is invalid'
   */
  NOTI_MESG_006: { errorCode: 'NOTI_MESG_006', status: 400, message: 'Data template is invalid' },
  /**
   * status: 404, message: 'Message category not found'
   */
  NOTI_CATETORY_001: { errorCode: 'NOTI_CATETORY_001', status: 404, message: 'Message category not found' },
  /**
   * status: 404, message: 'Message template not found'
   */
  NOTI_MESG_TEMPLATE_001: { errorCode: 'NOTI_MESG_TEMPLATE_001', status: 404, message: 'Message template not found' },
  /**
   * status: 404, message: 'Message template not found'
   */
  NOTI_MESG_TEMPLATE_002: {
    errorCode: 'NOTI_MESG_TEMPLATE_002',
    status: 500,
    message: 'Image base64 string is not valid',
  },
  /**
   * status: 404, message: 'Campaign not found'
   */
  NOTI_CAMPAIGN_001: { errorCode: 'NOTI_CAMPAIGN_001', status: 404, message: 'Campaign not found' },

  /**
   * status: 500, message: 'Cannot update recipient identity'
   */
  NOTI_RECPT_001: { errorCode: 'NOTI_RECPT_001', status: 500, message: 'Cannot update recipient identity' },

  /**
   * status: 500, message: 'Cannot create recipient'
   */
  NOTI_RECPT_002: { errorCode: 'NOTI_RECPT_002', status: 500, message: 'Cannot create recipient' },

  /**
   * status: 404, message: 'Recipient not found'
   */
  NOTI_RECPT_003: { errorCode: 'NOTI_RECPT_003', status: 404, message: 'Recipient not found' },

  /**
   * status: 500, message: 'Cannot upload image'
   */
  NOTI_IMG_001: { errorCode: 'NOTI_IMG_001', status: 500, message: 'Cannot upload image' },

  /**
   * status: 500, message: 'Image size over limit'
   */
  NOTI_IMG_002: { errorCode: 'NOTI_IMG_002', status: 500, message: 'Image size over limit' },
  /**
   * status: 500, message: 'Image size over limit'
   */
  NOTI_TARG_001: { errorCode: 'NOTI_TARG_001', status: 500, message: 'Cannot create target group' },

  /**
   * status: 500, message: 'Cannot sending message to websocket'
   */
  NOTI_WS_001: { errorCode: 'NOTI_WS_001', status: 500, message: 'Cannot sending message to websocket' },
};
type errorCode = keyof typeof OBError;
export type errorObject = (typeof OBError)[errorCode];
