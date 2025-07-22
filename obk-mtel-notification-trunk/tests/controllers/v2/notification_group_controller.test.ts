import request from 'supertest';
import app from '../../../src/app';
import { resetDB } from '../../helpers/db';
import NotificationGroupRepository from '../../../src/repositories/notification_group_repository';
import RecipientRepository from '../../../src/repositories/recipient_repository';
import SettingRepository from '../../../src/repositories/setting_repository';
import { newErrorHandler } from '../../../src/middlewares/error';

beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
  jest.restoreAllMocks();
});

describe('NotificationGroupController', () => {
  describe('GET /notification_group', () => {
    it('should return 200', async () => {
      const recipient = await RecipientRepository.create({
        data: {
          account_id: 'test-id',
          data: {
            push_token: {
              value: 'test-token-value',
              type: 'FCM',
            },
          },
        },
      });

      const notiGroup = await NotificationGroupRepository.create({
        data: {
          name: 'test1',
        },
      });

      const settingsData = {
        recipient_id: recipient.id,
        notification_group_id: notiGroup.id,
        sms_enabled: true,
        email_enabled: true,
        in_app_enabled: true,
        push_enabled: true,
      };
      const settings = await SettingRepository.create({ data: settingsData });

      const response = await request(app)
        .get('/notification_group')
        .set('x-account-id', 'test-id')
        .set('X-Access-Token', 'test-token-value')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          {
            groupId: notiGroup.id,
            groupName: 'test1',
            settings: {
              sms_enabled: settings.sms_enabled,
              email_enabled: settings.email_enabled,
              in_app_enabled: settings.in_app_enabled,
              push_enabled: settings.push_enabled,
            },
          },
        ],
      });
    });
    it('should return 400 if recipient is not found', async () => {
      const response = await request(app)
        .get('/notification_group')
        .set('x-account-id', 'invalid-account-id')
        .set('X-Access-Token', 'test-token-value')
        .send();

      expect(response.status).toStrictEqual(400);
    });
  });
});
