import app from '../../src/app';
import { resetDB } from '../helpers/db';
import RecipientRepository from '../../src/repositories/recipient_repository';
import { RecipientService } from '../../src/services/recipient_service';
import { OBError } from '../../src/libs/error_spec';
import { CustomError, newErrorHandler } from '../../src/middlewares/error';
import logging from '../../src/libs/logging';

beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
  await RecipientRepository.create({
    data: {
      id: 'testID',
      account_id: 'test',
      data: {
        account_id: 'test',
        profile: {
          first_name: 'test',
          last_name: 'test',
          gender: 'female',
          dob: '2000-06-30T00:00:00.000Z',
        },
        identities: [
          {
            identifier: 'test@mtel.co.th',
            provider: 'email',
            default: true,
          },
        ],
        push_token: {
          value: '',
          type: 'FCM',
        },
        device: {
          device_id: 'test',
          device_os: 'ios',
          device_unique_id: 'test',
        },
      },
    },
  });
});

describe('RecipientService', () => {
  const recipientService = new RecipientService();

  describe('updateRecipientFCMToken', () => {
    it('should update success', async () => {
      const payload = {
        account_id: 'test',
        push_token: { value: 'testToken', type: 'FCM' },
      };

      const mockLogging = jest.fn();
      logging.info = mockLogging;

      await recipientService.updateRecipientFCMToken(payload);

      expect(mockLogging).toHaveBeenCalledWith(`Update push_token complete : recipientId = (testID)`);
    });

    it('should throw an error if account ID is empty', async () => {
      const payload = {
        account_id: 'wrongAccountID',
        push_token: { value: 'testToken', type: 'FCM' },
      };
      await expect(recipientService.updateRecipientFCMToken(payload)).rejects.toThrow(
        new CustomError(OBError.NOTI_MESG_002),
      );
    });
  });
});
