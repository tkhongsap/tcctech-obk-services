import { registerEventHandlers } from 'ob-common-lib/dist';
import {
  accountHandler,
  profileHandler,
  identityHandler,
  deviceHandler,
  settingHandler,
} from './iam';
import visitorHandler from './bms/visitor_handler';

const accountHandlerInstance = new accountHandler();
const profileHandlerInstance = new profileHandler();
const identityHandlerInstance = new identityHandler();
const deviceHandlerInstance = new deviceHandler();
const settingHandlerInstance = new settingHandler();
const visitorHandlerInstance = new visitorHandler();

export const eventHandlers = registerEventHandlers(
  [
    accountHandlerInstance,
    profileHandlerInstance,
    identityHandlerInstance,
    deviceHandlerInstance,
    settingHandlerInstance,
    visitorHandlerInstance,
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
  },
);
