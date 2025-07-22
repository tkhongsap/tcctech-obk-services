import { registerEventHandlers } from 'ob-common-lib/dist';
import { memberHandler } from './bms';

const memberHandlerInstance = new memberHandler();

export const eventHandlers = registerEventHandlers([memberHandlerInstance], {
  'ob-bms.member.created': memberHandlerInstance.created,
});
