import logging from '../utils/logging';
import { sendMessageToSlackChannel } from '../utils/slack';

const OTP_CHANNEL_ID = process.env.OTP_SLACK_CHANNEL_ID || '';
export class MockAWSClient {
  private client;

  constructor() {
    this.client = 'mock-aws';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async send(data: any) {
    if ('PhoneNumber' in data.input) {
      await sendMessageToSlackChannel({
        channel: OTP_CHANNEL_ID ?? '',
        text: `:calling:* destination: ${data.input.PhoneNumber}*\`\`\`${data.input.Message}\`\`\`\n`,
      });
    } else if ('Destination' in data.input) {
      const message = data.input.Message.Body.Text.Data ?? '';
      await sendMessageToSlackChannel({
        channel: OTP_CHANNEL_ID ?? '',
        text: `:envelope_with_arrow:* destination: ${data.input.Destination?.ToAddresses}* \`\`\`${message}\`\`\``,
      });
    }
    logging.info(data.input);
  }
}
