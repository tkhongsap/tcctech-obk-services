import { Prisma } from '../../db/client';
import { OtpResult } from './otp_controller.interface';

export function OtpSerializer(Otp: Prisma.otpGetPayload<true>): OtpResult {
  return {
    otp: {
      reference: Otp.reference,
    },
  };
}
