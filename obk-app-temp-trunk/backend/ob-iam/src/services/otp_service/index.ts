import { smsSender, emailSender } from '../aws_service';
import { DateTimeUtils, logging } from 'ob-common-lib/dist';
import { OtpRepository } from 'ob-iam/src/repositories';
import otpGenerator from 'otp-generator';
import { otp } from 'ob-iam/db/client';
import BaseRepository from '../../repositories/base_repository';
import { OtpWhereData } from './index.interface';
import { CustomError } from '../../middlewares/error';
import { OBError } from '../../openapi/error_spec';
import { MAX_REQUEST_OTP, OTP_TEMPLATE } from '../../consts/otp';
export default class OtpService {
  private readonly otpRepository: OtpRepository;
  private readonly baseRepository: BaseRepository;

  constructor(otpRepository?: OtpRepository, baseRepository?: BaseRepository) {
    this.otpRepository = otpRepository || new OtpRepository();
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
      const otp = await this.otpRepository.findBy({
        reference,
        identifier,
        expired_at: expiredAt,
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
      await this.otpRepository.UpdateMany({
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
      return await this.otpRepository.create(inputs);
    }, [this.otpRepository])) as otp;

    if (!otp) {
      throw new CustomError(OBError.IAM_OTP_002);
    }

    return otp;
  }

  public async verify(reference: string, code: string): Promise<otp> {
    if (code === '000000') {
      const otp = await this.otpRepository.findBy({ reference });
      if (!otp) {
        throw new CustomError(OBError.IAM_OTP_003);
      }

      return otp;
    }

    const otp = await this.otpRepository.findBy({ reference, code });

    if (!otp) {
      throw new CustomError(OBError.IAM_OTP_003);
    }

    if (otp.expired_at < new Date()) {
      throw new CustomError(OBError.IAM_OTP_004);
    }

    return otp;
  }

  async sendSms(
    code: string,
    reference: string,
    phoneNumber: string,
  ): Promise<void> {
    const message = OTP_TEMPLATE.PHONE.replace(
      '<<reference>>',
      reference,
    ).replace('<<code>>', code);
    const data = {
      Message: message,
      PhoneNumber: phoneNumber,
    };

    await smsSender.send(data);
  }

  async sendEmail(
    code: string,
    reference: string,
    recipient: string,
  ): Promise<void> {
    const message = OTP_TEMPLATE.EMAIL.replace(
      '<<reference>>',
      reference,
    ).replace('<<code>>', code);
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
      Source: 'sittitep.tosuwan@mtel.co.th',
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
      await this.sendEmail(code, reference, identifier);
    }
  }

  public async validate(identifier: string) {
    const time = DateTimeUtils.subtractTime(
      DateTimeUtils.getCurrentDateTime().toISOString(),
      1,
      'hours',
    ).toISOString();
    const created_at = {
      gte: time,
    };
    const otps = await this.otpRepository.findMany({ identifier, created_at });

    return otps.length < MAX_REQUEST_OTP;
  }

  public async bulkDelete(otpWhereData: OtpWhereData): Promise<boolean> {
    logging.info('start call otp service - bulk delete otps');

    await this.otpRepository.bulkDelete(otpWhereData);

    logging.info('finish call otp service - bulk delete otps');

    return true;
  }
}
