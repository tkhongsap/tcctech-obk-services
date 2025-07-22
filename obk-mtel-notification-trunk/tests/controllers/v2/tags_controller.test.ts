/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import app from '../../../src/app';
import { resetDB } from '../../helpers/db';
import TagRepository from '../../../src/repositories/tag_repository';

describe('TagsController', () => {
  beforeEach(async () => {
    await resetDB();
    for (let n = 0; n < 3; n++) {
      await TagRepository.create({
        data: {
          name: 'test' + n,
        },
      });
    }
  });

  describe('GET /tags', () => {
    it('return 200', async () => {
      const response = await request(app).get('/tags').send();

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(3);
    });
  });
});
