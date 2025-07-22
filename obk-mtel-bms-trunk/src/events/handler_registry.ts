import { registerEventHandlers } from '../utils/kafka';
import { externalIdentityHandler, profileHandler } from './iam';
import { serviceRequestHandler, acRequestHandler } from './bms';

const externalIdentityInstance = new externalIdentityHandler();
const serviceRequestInstance = new serviceRequestHandler();
const acRequestInstance = new acRequestHandler();
const profileInstance = new profileHandler();

export const eventHandlers = registerEventHandlers([externalIdentityInstance], {
  'ob-iam.external_identity.created': externalIdentityInstance.created,
  'ob-bms.service_request.created': serviceRequestInstance.create,
  'ob-bms.air_condition_request.created': acRequestInstance.create,
  'ob-iam.profile.updated': profileInstance.update,
});
