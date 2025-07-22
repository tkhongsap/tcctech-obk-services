import AccountService from '../account_service';
import { DateTimeUtils } from '../../utils/datetime';
import OtpService from '../otp_service';
export default class TaskService {
  public async bulkDeleteAccount(): Promise<boolean> {
    const accountService = new AccountService();
    const deletedDate = DateTimeUtils.getCurrentDateTime().subtract(1, 'months');

    const result = await accountService.bulkDelete({
      deleted_at: {
        lte: deletedDate.toISOString(),
      },
    });
    return result;
  }

  public async bulkDeleteExpiredOtp(): Promise<boolean> {
    const otpService = new OtpService();
    const deletedDate = DateTimeUtils.getCurrentDateTime();

    const result = await otpService.bulkDelete({
      expired_at: {
        lte: deletedDate.toISOString(),
      },
    });
    return result;
  }
}
