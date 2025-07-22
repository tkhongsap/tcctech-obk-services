/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import app from '../../../src/app';
import { resetDB } from '../../helpers/db';
import CampaignRepository from '../../../src/repositories/campaign_repository';
import { Prisma } from '../../../db/client';
import dayjs from 'dayjs';

let campaign1: Prisma.campaignGetPayload<{ include: { message_template: { include: { message_category: true } } } }>;
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
      },
      include: {
        message_template: {
          include: {
            message_category: true,
          },
        },
      },
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
  });

  describe('GET /message_categories', () => {
    it('return 200', async () => {
      const response = await request(app).get('/message_categories').send();

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(2);
    });
  });
});
