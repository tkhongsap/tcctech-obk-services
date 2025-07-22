import request from 'supertest';
import app from '../../../src/app';
import { resetDB } from '../../helpers/db';
import CampaignRepository from '../../../src/repositories/campaign_repository';
import { Prisma } from '../../../db/client';
import { TranslateableContentData } from '../../../src/controllers/v2/index.interface';
import dayjs from 'dayjs';
import { CampaignsCreateRequestBody } from '../../../src/controllers/v2/index.interface';
import MessageCategoryRepository from '../../../src/repositories/message_category_repository';
import TargetGroupRepository from '../../../src/repositories/target_group_repository';
import TagRepository from '../../../src/repositories/tag_repository';
import RecipientRepository from '../../../src/repositories/recipient_repository';

let campaign1: Prisma.campaignGetPayload<{
  include: {
    message_template: { include: { message_category: true } };
    tag_on_campaigns: {
      include: {
        tag: true;
      };
    };
    campaign_target_groups: {
      include: {
        target_group: true;
      };
    };
    transaction_status_campaign: true;
  };
}>;
let campaign2: Prisma.campaignGetPayload<{ include: { message_template: { include: { message_category: true } } } }>;

describe('CampaignsController', () => {
  beforeEach(async () => {
    await resetDB();
    campaign1 = await CampaignRepository.create({
      data: {
        name: 'awesome-campaign',
        scheduled_at: dayjs().toISOString(),
        message_template: {
          create: {
            name: 'test',
            data: [],
            message_category: {
              create: {
                name: 'test',
                sequence: 1,
                icon: {
                  create: {
                    name: 'test',
                    url: 'test',
                  },
                },
              },
            },
          },
        },
        tag_on_campaigns: {
          create: {
            tag: {
              create: {
                name: 'test-tag',
              },
            },
          },
        },
        campaign_target_groups: {
          create: {
            target_group: {
              create: {
                name: 'all',
              },
            },
          },
        },
      },
      include: CampaignRepository.defaultInclude,
    });

    campaign2 = await CampaignRepository.create({
      data: {
        name: 'cool-campaign',
        scheduled_at: dayjs().toISOString(),
        message_template: {
          create: {
            name: 'test',
            data: [],
            message_category: {
              create: {
                name: 'test',
                sequence: 1,
                icon: {
                  create: {
                    name: 'test',
                    url: 'test',
                  },
                },
              },
            },
          },
        },
      },
      include: {
        message_template: {
          include: {
            message_category: true,
          },
        },
      },
    });

    await RecipientRepository.create({
      data: {
        id: 'testID',
        account_id: 'test_accountId',
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

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('GET /campaigns', () => {
    it('return 200', async () => {
      const messageTemplate = campaign1.message_template;
      const messageCategory = campaign1.message_template?.message_category;

      const response = await request(app).get('/campaigns').send();

      const expectedCampaign = {
        id: campaign1.id,
        name: campaign1.name,
        push_notification_data: campaign1.push_notification_data,
        status: campaign1.status,
        message_template_id: campaign1.message_template_id,
        scheduled_at: campaign1.scheduled_at?.toISOString(),
        created_at: campaign1.created_at.toISOString(),
        updated_at: campaign1.updated_at.toISOString(),
        submitted_by: campaign1.submitted_by,
        updated_by_name: campaign1.updated_by_name,
        updated_by: campaign1.updated_by,
        created_by: campaign1.created_by,
        created_by_name: campaign1.created_by_name,
        submitted_by_name: campaign1.submitted_by_name,
        message_template: {
          ...messageTemplate,
          title: messageTemplate!.title as object as TranslateableContentData,
          sub_title: messageTemplate!.sub_title as object as TranslateableContentData,
          created_at: messageTemplate!.created_at.toISOString(),
          updated_at: messageTemplate!.updated_at.toISOString(),
          message_category: {
            ...messageCategory,
            id: messageCategory!.id,
            name: messageCategory!.name,
            sequence: messageCategory!.sequence,
            created_at: messageCategory!.created_at.toISOString(),
            updated_at: messageCategory!.updated_at.toISOString(),
          },
        },
        target_groups: [
          {
            id: campaign1.campaign_target_groups[0].target_group_id,
            name: campaign1.campaign_target_groups[0].target_group.name,
          },
        ],
        tags: [
          {
            id: campaign1.tag_on_campaigns[0].tag_id,
            name: campaign1.tag_on_campaigns[0].tag.name,
          },
        ],
        transaction_status: campaign1.transaction_status_campaign,
        note: campaign1.note,
      };

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(2);
      expect(response.body.data[0]).toEqual(expectedCampaign);
    });

    describe('with with query', () => {
      it('return filtered campaigns', async () => {
        const response = await request(app).get('/campaigns').query({ 'name.contains': campaign2.name }).send();
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].name).toEqual(campaign2.name);
      });
    });
  });

  describe('POST / campaigns', () => {
    describe('with data', () => {
      it('return 200', async () => {
        const messageCategory = await MessageCategoryRepository.create({
          data: {
            name: 'test',
            sequence: 0,
            icon: {
              create: {
                name: 'test',
                url: 'test',
              },
            },
          },
        });

        const targetGroup = await TargetGroupRepository.create({
          data: {
            name: 'all',
          },
        });

        const requestBody: CampaignsCreateRequestBody = {
          name: 'test-campaign',
          scheduled_at: dayjs().toISOString(),
          message_template: {
            title: { en: 'test' },
            sub_title: { en: 'test' },
            thumbnail: 'https://test',
            data: [
              {
                data: {
                  en: 'textEN',
                  th: 'textTH',
                  zh: 'textZH',
                },
              },
              {
                type: 'text',
                data: {
                  en: 'textEN',
                  th: 'textTH',
                  zh: 'textZH',
                },
              },
            ],
            deeplink_display_name: {
              en: 'test-deeplink-display-name',
            },
            deeplink: '',
          },
          message_category_id: messageCategory.id,
          target_group_id: targetGroup.id,
          tags: ['new-tag', 'test-tag'],
        };

        const response = await request(app).post('/campaigns').send(requestBody);

        expect(response.status).toEqual(200);
        expect(response.body.data.name).toEqual('test-campaign');
        expect(response.body.data.message_template.deeplink_display_name).toEqual({ en: 'test-deeplink-display-name' });

        const tagCount = await TagRepository.count();

        expect(tagCount).toEqual(2);
      });
    });

    describe('with only category', () => {
      it('return 200', async () => {
        const messageCategory = await MessageCategoryRepository.create({
          data: {
            name: 'test',
            sequence: 0,
            icon: {
              create: {
                name: 'test',
                url: 'test',
              },
            },
          },
        });

        const requestBody: CampaignsCreateRequestBody = {
          message_category_id: messageCategory.id,
        };

        const response = await request(app).post('/campaigns').send(requestBody);

        expect(response.status).toEqual(200);
      });
    });

    describe('with create new target group', () => {
      it('return 200', async () => {
        const messageCategory = await MessageCategoryRepository.create({
          data: {
            name: 'test',
            sequence: 0,
            icon: {
              create: {
                name: 'test',
                url: 'test',
              },
            },
          },
        });

        const requestBody: CampaignsCreateRequestBody = {
          name: 'test-campaign',
          scheduled_at: dayjs().toISOString(),
          message_template: {
            title: { en: 'test' },
            sub_title: { en: 'test' },
            thumbnail: 'https://test',
            data: [
              {
                data: {
                  en: 'textEN',
                  th: 'textTH',
                  zh: 'textZH',
                },
              },
              {
                type: 'text',
                data: {
                  en: 'textEN',
                  th: 'textTH',
                  zh: 'textZH',
                },
              },
            ],
            deeplink_display_name: {
              en: 'test-deeplink-display-name',
            },
            deeplink: '',
          },
          message_category_id: messageCategory.id,
          target_group_id: '',
          tags: ['new-tag', 'test-tag'],
          targetGroupDetails: {
            name: 'namefile',
            account_id_group: ['test_accountId'],
          },
        };

        const response = await request(app).post('/campaigns').send(requestBody);

        expect(response.status).toEqual(200);
        expect(response.body.data.target_groups[0].name).toEqual('namefile');
      });
    });
  });
  describe('GET /campaigns/{id}/duplicate', () => {
    it('return 200', async () => {
      const response = await request(app).post(`/campaigns/${campaign1.id}/duplicate`).send();
      expect(response.status).toEqual(200);
      expect(response.body.data.name).toEqual(`${campaign1.name} - copy`);
    });
    it('throw error if campaign not found', async () => {
      const response = await request(app).post(`/campaigns/123/duplicate`).send();

      expect(response.status).toEqual(500);
    });
  });

  describe('POST /campaigns/sent', () => {
    it('return 200', async () => {
      const response = await request(app).post(`/campaigns/sent`).send();
      expect(response.status).toEqual(200);
    });
  });

  describe('POST /campaigns/{id}/submit', () => {
    it('return 200', async () => {
      const fakeTime = new Date('2020-01-01');
      jest.useFakeTimers().setSystemTime(fakeTime);
      const response = await request(app).post(`/campaigns/${campaign1.id}/submit`).send();

      expect(response.status).toEqual(200);
      expect(response.body.data.status).toEqual('WATING_FOR_APPROVAL');
      expect(response.body.data.submitted_at).toEqual(fakeTime.toISOString());
    });
  });

  describe('PUT /campaigns/{id}', () => {
    it('return 200', async () => {
      const body: CampaignsCreateRequestBody = {
        message_template: {
          adhoc: true,
          data: [],
          deeplink_with_account_id: false,
          name: 'update title test',
          personalized: true,
          sub_title: {
            en: '<p>update title test</p>',
          },
        },
      };

      const response = await request(app).put(`/campaigns/${campaign1.id}`).send(body);

      expect(response.status).toEqual(200);
      expect(response.body.data.id).toEqual(campaign1.id);
    });

    it('return 200 update target group campaigns', async () => {
      const body: CampaignsCreateRequestBody = {
        targetGroupDetails: {
          name: 'namefile',
          account_id_group: ['test_accountId'],
        },
      };
      const response = await request(app).put(`/campaigns/${campaign1.id}`).send(body);

      expect(response.status).toEqual(200);
      expect(response.body.data.id).toEqual(campaign1.id);
    });
  });
});
