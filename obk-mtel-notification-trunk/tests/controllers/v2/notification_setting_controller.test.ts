import request from 'supertest';
import app from '../../../src/app';
import { resetDB } from '../../helpers/db';
import NotificationGroupRepository from '../../../src/repositories/notification_group_repository';
import RecipientRepository from '../../../src/repositories/recipient_repository';
import SettingRepository from '../../../src/repositories/setting_repository';

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks();
});

describe('NotificationSettingController', () => {
  describe('GET /notification_setting', () => {
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
          display_name: {},
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
      const settings = await SettingRepository.create({ data: settingsData, include: { notification_group: true } });

      const response = await request(app)
        .get('/notification_setting')
        .set('x-account-id', 'test-id')
        .set('X-Access-Token', 'test-token-value')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          {
            id: settings.id,
            sms_enabled: settings.sms_enabled,
            recipient_id: settings.recipient_id,
            email_enabled: settings.email_enabled,
            in_app_enabled: settings.in_app_enabled,
            notification_group: {
              created_at: settings.notification_group.created_at.toISOString(),
              deleted_at: settings.notification_group.deleted_at,
              display_name: settings.notification_group.display_name,
              id: settings.notification_group.id,
              name: settings.notification_group.name,
              setting_email_enabled: settings.notification_group.setting_email_enabled,
              setting_in_app_enabled: settings.notification_group.setting_in_app_enabled,
              setting_push_enabled: settings.notification_group.setting_push_enabled,
              setting_sms_enabled: settings.notification_group.setting_sms_enabled,
              updated_at: settings.notification_group.updated_at.toISOString(),
            },
            push_enabled: settings.push_enabled,
            notification_group_id: settings.notification_group_id,
            created_at: settings.created_at.toISOString(),
            updated_at: settings.updated_at.toISOString(),
            deleted_at: settings.deleted_at ? settings.deleted_at.toISOString() : null,
          },
        ],
      });
    });
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
          display_name: {},
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
      const settings = await SettingRepository.create({ data: settingsData, include: { notification_group: true } });

      const response = await request(app)
        .get('/notification_setting/' + notiGroup.id)
        .set('x-account-id', 'test-id')
        .set('X-Access-Token', 'test-token-value')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          {
            id: settings.id,
            sms_enabled: settings.sms_enabled,
            recipient_id: settings.recipient_id,
            email_enabled: settings.email_enabled,
            in_app_enabled: settings.in_app_enabled,
            notification_group: {
              created_at: settings.notification_group.created_at.toISOString(),
              deleted_at: settings.notification_group.deleted_at,
              display_name: settings.notification_group.display_name,
              id: settings.notification_group.id,
              name: settings.notification_group.name,
              setting_email_enabled: settings.notification_group.setting_email_enabled,
              setting_in_app_enabled: settings.notification_group.setting_in_app_enabled,
              setting_push_enabled: settings.notification_group.setting_push_enabled,
              setting_sms_enabled: settings.notification_group.setting_sms_enabled,
              updated_at: settings.notification_group.updated_at.toISOString(),
            },
            push_enabled: settings.push_enabled,
            notification_group_id: settings.notification_group_id,
            created_at: settings.created_at.toISOString(),
            updated_at: settings.updated_at.toISOString(),
            deleted_at: settings.deleted_at ? settings.deleted_at.toISOString() : null,
          },
        ],
      });
    });
    it('should return 500 if setting is not found', async () => {
      const response = await request(app)
        .get('/notification_setting')
        .set('x-account-id', 'invalid-account-id')
        .set('X-Access-Token', 'test-token-value')
        .query({ notification_group_id: 'notigroupid' })
        .send();
      expect(response.status).toStrictEqual(500);
    });
  });

  describe('PUT /notification_setting', () => {
    it('should return 200 if settings are updated', async () => {
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
          display_name: {},
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

      const updatedSettingsData = {
        id: settings.id,
        sms_enabled: false,
        email_enabled: false,
        in_app_enabled: false,
        push_enabled: false,
      };
      const response = await request(app)
        .put('/notification_setting')
        .set('x-account-id', 'test-id')
        .set('X-Access-Token', 'test-token-value')
        .send(updatedSettingsData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: { result: true } });
    });
    it('should return 500 if setting cannot be updated', async () => {
      const updatedSettingsData = {
        id: 'setting-id',
        sms_enabled: false,
        email_enabled: false,
        in_app_enabled: false,
        push_enabled: false,
      };

      const response = await request(app)
        .put('/notification_setting')
        .set('x-account-id', 'invalid-account-id')
        .set('X-Access-Token', 'test-token-value')
        .send(updatedSettingsData);

      expect(response.status).toBe(500);
    });
  });
  describe('PUT /notification_setting/deactivate', () => {
    it('should return 200 and deactivate all settings', async () => {
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
          name: 'test-group',
          display_name: {},
        },
      });

      const initialSettingsData = {
        recipient_id: recipient.id,
        notification_group_id: notiGroup.id,
        sms_enabled: true,
        email_enabled: true,
        in_app_enabled: true,
        push_enabled: true,
      };
      await SettingRepository.create({ data: initialSettingsData });

      const response = await request(app)
        .put('/notification_setting/activateordeactivate')
        .set('x-account-id', 'test-id')
        .set('X-Access-Token', 'test-token-value')
        .send({ isEnable: false });

      expect(response.status).toBe(200);

      const updatedSettings = await SettingRepository.findMany({
        where: { recipient_id: recipient.id },
      });

      updatedSettings.forEach((setting) => {
        expect(setting.sms_enabled).toBe(false);
        expect(setting.email_enabled).toBe(false);
        expect(setting.in_app_enabled).toBe(false);
        expect(setting.push_enabled).toBe(false);
      });
    });
    it('should return 404 if recipient is not found', async () => {
      const response = await request(app)
        .put('/notification_setting/activateordeactivate')
        .set('x-account-id', 'invalid-account-id')
        .set('X-Access-Token', 'test-token-value')
        .send({ isEnable: false });
      expect(response.status).toBe(404);
    });
  });
});
