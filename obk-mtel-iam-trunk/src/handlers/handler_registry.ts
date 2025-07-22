import { registerEventHandlers } from '../utils/kafka';
import { memberHandler } from './bms';

const memberHandlerInstance = new memberHandler();

export const eventHandlers = registerEventHandlers([memberHandlerInstance], {
  'ob-bms.member.created': memberHandlerInstance.created,
  'ob-bms.member_resident.created': memberHandlerInstance.createdResident,
  'ob-iam.member.deleted': memberHandlerInstance.deleted,
});
