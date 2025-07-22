import { SESClient, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { MockAWSClient } from './mock_aws_client';
import { CustomError } from '../middlewares/error';
import { OBError } from '../libs/error_spec';

export const smsClient = {
  MOCK: new MockAWSClient(),
  SNS: new SNSClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  }),
};
export const emailClient = {
  MOCK: new MockAWSClient(),
  SES: new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  }),
};

type SMSClientType = keyof typeof smsClient;
type EmailClientType = keyof typeof emailClient;

class SMSSender {
  private client;

  constructor(provider: SMSClientType) {
    this.client = smsClient[provider];
  }

  public async send(data: PublishCommandInput) {
    if (this.client instanceof MockAWSClient || this.client instanceof SNSClient) {
      await this.client.send(new PublishCommand(data));
    } else {
      throw new CustomError(OBError.OB_009);
    }
  }
}

class EmailSender {
  private client;

  constructor(provider: EmailClientType) {
    this.client = emailClient[provider];
  }

  public async send(data: SendEmailCommandInput) {
    if (this.client instanceof MockAWSClient || this.client instanceof SESClient) {
      await this.client.send(new SendEmailCommand(data));
    } else {
      throw new CustomError(OBError.OB_009);
    }
  }
}

export const emailSender = new EmailSender(process.env.EMAIL_SENDER_PROVIDER?.toUpperCase() as EmailClientType);
export const smsSender = new SMSSender(process.env.SMS_SENDER_PROVIDER?.toUpperCase() as SMSClientType);
