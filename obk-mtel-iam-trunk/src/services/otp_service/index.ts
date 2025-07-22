import { smsSender, emailSender } from '../aws_service';
import logging from '../../utils/logging';
import { DateTimeUtils } from '../../utils/datetime';
import OtpRepository from '../../repositories/otp_repository';
import otpGenerator from 'otp-generator';
import { otp } from '../../../db/client';
import BaseRepository from '../../repositories/base_repository';
import { OtpWhereData } from './index.interface';
import { CustomError } from '../../midlewares/error';
import { OBError } from '../../utils/error_spec';
import { MAX_REQUEST_OTP, OTP_TEMPLATE } from '../../consts/otp';
import { EventProducer } from '../../utils/kafka';
export default class OtpService {
  private readonly baseRepository: BaseRepository;

  constructor(baseRepository?: BaseRepository) {
    this.baseRepository = baseRepository || new BaseRepository();
  }

  public async generate(identifier: string): Promise<otp> {
    let reference: string;

    const result = await this.validate(identifier);
    if (!result) {
      throw new CustomError(OBError.IAM_OTP_001);
    }

    for (;;) {
      reference = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: true,
        upperCaseAlphabets: true,
        specialChars: false,
      });
      const expiredAt = {
        gte: DateTimeUtils.getCurrentDateTime().toISOString(),
      };
      const otp = await OtpRepository.findFirst({
        where: {
          reference,
          identifier,
          expired_at: expiredAt,
        },
      });

      if (!otp) {
        break;
      }
    }

    const inputs = {
      code: otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      }),
      reference,
      identifier,
      expired_at: DateTimeUtils.addTime(new Date(), 5, 'minutes').toDate(),
    };

    const otp = (await this.baseRepository.transaction(async () => {
      const currentTimeStamp = DateTimeUtils.getCurrentDateTime().toDate();
      await OtpRepository.updateMany({
        where: {
          identifier,
          expired_at: {
            gte: currentTimeStamp,
          },
        },
        data: {
          expired_at: currentTimeStamp,
        },
      });
      return await OtpRepository.create({ data: inputs });
    }, [])) as otp;

    if (!otp) {
      throw new CustomError(OBError.IAM_OTP_002);
    }

    return otp;
  }

  public async verify(reference: string, code: string): Promise<otp> {
    if (process.env.ENABLE_MAGIC_OTP === 'true' && code === '000000') {
      const otp = await OtpRepository.findFirst({ where: { reference } });
      if (!otp) {
        throw new CustomError(OBError.IAM_OTP_003);
      }

      return otp;
    }

    const otp = await OtpRepository.findFirst({ where: { reference, code } });

    if (!otp) {
      throw new CustomError(OBError.IAM_OTP_003);
    }

    if (otp.expired_at < new Date()) {
      throw new CustomError(OBError.IAM_OTP_004);
    }

    return otp;
  }

  async sendSms(code: string, reference: string, phoneNumber: string): Promise<void> {
    const message = OTP_TEMPLATE.PHONE.replace('<<reference>>', reference).replace('<<code>>', code);
    const data = {
      Message: message,
      PhoneNumber: phoneNumber,
    };

    await smsSender.send(data);
  }

  async sendEmail(code: string, reference: string, recipient: string): Promise<void> {
    const message = OTP_TEMPLATE.EMAIL.replace('<<reference>>', reference).replace('<<code>>', code);
    const data = {
      Destination: {
        ToAddresses: [recipient],
      },
      Message: {
        Body: {
          Text: { Data: message },
        },
        Subject: { Data: 'One Bangkok OTP' },
      },
      Source: process.env.EMAIL_SOURCE,
    };

    await emailSender.send(data);
  }

  public async sendCode(
    code: string,
    reference: string,
    identity: { identifier: string; provider: string },
  ): Promise<void> {
    const { identifier, provider } = identity;

    if (provider === 'phone') {
      await this.sendSms(code, reference, identifier);
    }

    if (provider === 'email') {
      this.triggerEvent({ identifier, reference, code });
    }
  }
  private triggerEvent({ identifier, reference, code }: { identifier: string; reference: string; code: string }): void {
    logging.info('sending otp event to notification');
    EventProducer.send({
      name: 'ob-iam.otp_reference.created',
      payload: {
        identifier,
        reference,
        code,
      },
    });
  }

  public async validate(identifier: string): Promise<boolean> {
    const time = DateTimeUtils.subtractTime(DateTimeUtils.getCurrentDateTime().toISOString(), 1, 'hours').toISOString();
    const created_at = {
      gte: time,
    };
    const otps = await OtpRepository.findMany({ where: { identifier, created_at } });

    return otps.length < MAX_REQUEST_OTP;
  }

  public async bulkDelete(otpWhereData: OtpWhereData): Promise<boolean> {
    logging.info('start call otp service - bulk delete otps');

    await OtpRepository.deleteMany({ where: otpWhereData });

    logging.info('finish call otp service - bulk delete otps');

    return true;
  }
}
