import app from '../../src/app';
import { resetDB } from '../helpers/db';
import RecipientRepository from '../../src/repositories/recipient_repository';
import { newErrorHandler } from '../../src/middlewares/error';
import { TargetGroupService } from '../../src/services/target_group_service';

let recipient: any;
beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
  recipient = await RecipientRepository.create({
    data: {
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

describe('TargetGroupService', () => {
  const targetGroupService = new TargetGroupService();

  describe('create target group', () => {
    it('should create success', async () => {
      const payload = {
        name: 'test',
        account_id_group: [recipient.id],
      };
      const result = await targetGroupService.create(payload);

      expect(result?.name).toEqual('test');
    });
  });
});
