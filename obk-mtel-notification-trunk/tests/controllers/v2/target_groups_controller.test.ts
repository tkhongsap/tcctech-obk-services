/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import app from '../../../src/app';
import { resetDB } from '../../helpers/db';
import TargetGroupRepository from '../../../src/repositories/target_group_repository';

describe('TargetGroupsController', () => {
  beforeEach(async () => {
    await resetDB();
    for (let n = 0; n < 3; n++) {
      await TargetGroupRepository.create({
        data: {
          name: 'test' + n,
        },
      });
    }
  });

  describe('GET /target_groups', () => {
    it('return 200', async () => {
      const response = await request(app).get('/target_groups').send();

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(3);
    });
  });
});
