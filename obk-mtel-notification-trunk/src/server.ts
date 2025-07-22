import app from './app';
import { EventConsumer } from './utils/kafka';
import { EventName } from './utils/kafka';
import { eventHandlers } from './handlers/handler_registry';
import logging from './libs/logging';

const port = process.env.SERVER_PORT ?? 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
EventConsumer.start(
  [
    'ob-iam.account.created',
    'ob-iam.account.deleted',
    'ob-iam.account.password_reset',
    'ob-iam.account.password_set',
    'ob-iam.account.reactivated',
    'ob-iam.profile.updated',
    'ob-iam.device.added',
    'ob-iam.identity.email_added',
    'ob-iam.identity.email_default_set',
    'ob-iam.identity.phone_added',
    'ob-iam.identity.phone_default_set',
    'ob-iam.setting.2fa_activated',
    'ob-iam.setting.2fa_deactivated',
    'ob-bms.visitor.visited',
    'ob-bms.service_request_status.updated',
    'ob-bms.air_condition_status.updated',
    'ob-bms.air_condition_request.created',
    'ob-bms.service_request.created',
    'ob-iam.otp_reference.created',
    'ob-bms.visitor_pass.created',
    'ob-iam.identity.deleted',
    'ob-iam.fcm_token.updated',
    'ob-iam.setting.updated',
    'ob-iam.device_and_fcm_token.added',
    'ob-bms.visitor_resident_pass.created',
  ],
  'ob-notification',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (event: { name: EventName; payload: any }, raw: any) => {
    const eventName = event.name;
    logging.info(`Consuming event for event: ${eventName}`);
    const handler = eventHandlers[eventName];
    try {
      if (handler) {
        handler(event, raw);
      } else {
        logging.info(`No handler found for event: ${eventName}`);
      }
    } catch (error) {
      logging.error(`${error}`);
    }
  },
);
export default server;
