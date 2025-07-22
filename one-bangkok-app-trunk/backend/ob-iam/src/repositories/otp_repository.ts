import { otp } from 'ob-iam/db/client';
import { DBClient } from '../utils/prisma/client';
import { CustomError } from '../middlewares/error_middleware';
import logging from 'ob-common-lib/dist/utils/logging';
import {
  OtpCreateData,
  OtpUpdateMany,
  OtpWhereData,
} from '../services/otp_service/index.interface';

export default class OtpRepository extends DBClient {
  constructor() {
    super();
  }

  public async create(inputs: OtpCreateData): Promise<otp> {
    const otp = await this.prisma.otp.create({
      data: inputs,
    });

    return otp;
  }

  public async findBy(where: OtpWhereData): Promise<otp | null> {
    const otp = await this.prisma.otp.findFirst({
      where,
    });

    return otp;
  }

  public async findMany(where: OtpWhereData): Promise<otp[]> {
    const otp = await this.prisma.otp.findMany({
      where,
    });

    return otp;
  }

  public async UpdateMany(updateManyArgs: OtpUpdateMany): Promise<void> {
    try {
      await this.prisma.otp.updateMany(updateManyArgs);
    } catch (error) {
      throw new CustomError(500, 'Cannot update otps');
    }
  }

  public async bulkDelete(where: OtpWhereData): Promise<void> {
    logging.info('delete otps');
    try {
      await this.prisma.otp.deleteMany({
        where,
      });
    } catch (error) {
      throw new CustomError(500, 'Cannot delete otps');
    }
  }
}
