import { logging } from 'ob-common-lib/dist';
import { sendMessageToSlackChannel } from '../utils/slack';

const CHANNEL_ID = process.env.SLACK_CHANNEL_ID || '';
export class MockAWSClient {
  private client;

  constructor() {
    this.client = 'mock-aws';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async send(data: any) {
    if ('PhoneNumber' in data.input) {
      await sendMessageToSlackChannel({
        channel: CHANNEL_ID ?? '',
        text: `:calling:* destination: ${data.input.PhoneNumber}*\`\`\`${data.input.Message}\`\`\`\n`,
      });
    } else if ('Destination' in data.input) {
      const message = data.input.Message.Body.Text.Data ?? '';
      await sendMessageToSlackChannel({
        channel: CHANNEL_ID ?? '',
        text: `:envelope_with_arrow:* destination: ${data.input.Destination?.ToAddresses}* \`\`\`${message}\`\`\``,
      });
    }
    logging.info(data.input);
  }
}
