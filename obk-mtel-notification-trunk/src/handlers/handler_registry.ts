import { accountHandler, profileHandler, identityHandler, deviceHandler, settingHandler } from './iam';
import visitorHandler from './bms/visitor_handler';
import { registerEventHandlers } from '../utils/kafka';
import serviceRequestHandler from './bms/service_request.handler';
import otacHandler from './bms/otac_handler';
import otpHandler from './iam/otp_handler';
import fcmTokenHandler from './iam/fcm_token_handler';
import deviceAndFCMTokenHandler from './iam/device_fcm_token_handler';

const accountHandlerInstance = new accountHandler();
const profileHandlerInstance = new profileHandler();
const identityHandlerInstance = new identityHandler();
const deviceHandlerInstance = new deviceHandler();
const settingHandlerInstance = new settingHandler();
const visitorHandlerInstance = new visitorHandler();
const serviceRequestHandlerInstance = new serviceRequestHandler();
const otacHandlerInstance = new otacHandler();
const otpHandlerInstance = new otpHandler();
const fcmTokenHandlerInstance = new fcmTokenHandler();
const deviceAndFCMTokenHandlerInstance = new deviceAndFCMTokenHandler();

export const eventHandlers = registerEventHandlers(
  [
    accountHandlerInstance,
    profileHandlerInstance,
    identityHandlerInstance,
    deviceHandlerInstance,
    settingHandlerInstance,
    visitorHandlerInstance,
    serviceRequestHandlerInstance,
    otacHandlerInstance,
    otpHandlerInstance,
    fcmTokenHandlerInstance,
    deviceAndFCMTokenHandlerInstance,
  ],
  {
    'ob-iam.account.created': accountHandlerInstance.created,
    'ob-iam.account.deleted': accountHandlerInstance.deleted,
    'ob-iam.account.password_reset': accountHandlerInstance.password_reset,
    'ob-iam.account.password_set': accountHandlerInstance.password_set,
    'ob-iam.account.reactivated': accountHandlerInstance.reactivated,
    'ob-iam.profile.updated': profileHandlerInstance.updated,
    'ob-iam.device.added': deviceHandlerInstance.added,
    'ob-iam.identity.email_added': identityHandlerInstance.addIdentity,
    'ob-iam.identity.email_default_set': identityHandlerInstance.updateIdentity,
    'ob-iam.identity.phone_added': identityHandlerInstance.addIdentity,
    'ob-iam.identity.phone_default_set': identityHandlerInstance.updateIdentity,
    'ob-iam.setting.2fa_activated': settingHandlerInstance.set2fa,
    'ob-iam.setting.2fa_deactivated': settingHandlerInstance.set2fa,
    'ob-bms.visitor.visited': visitorHandlerInstance.visitorVisited,
    'ob-bms.service_request_status.updated': serviceRequestHandlerInstance.serviceRequestUpdated,
    'ob-bms.air_condition_status.updated': otacHandlerInstance.otacRequestUpdated,
    'ob-bms.service_request.created': serviceRequestHandlerInstance.serviceRequestCreated,
    'ob-bms.air_condition_request.created': otacHandlerInstance.otacRequestCreated,
    'ob-iam.otp_reference.created': otpHandlerInstance.otpReferenceCreated,
    'ob-bms.visitor_pass.created': visitorHandlerInstance.visitorPassCreated,
    'ob-iam.identity.deleted': identityHandlerInstance.deleteIdentity,
    'ob-iam.fcm_token.updated': fcmTokenHandlerInstance.update,
    'ob-iam.setting.updated': settingHandlerInstance.updated,
    'ob-iam.device_and_fcm_token.added': deviceAndFCMTokenHandlerInstance.update,
    'ob-bms.visitor_resident_pass.created': visitorHandlerInstance.residentVisitorPassCreated,
  },
);
