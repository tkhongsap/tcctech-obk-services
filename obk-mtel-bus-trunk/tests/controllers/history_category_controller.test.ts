import { resetDB } from '../helpers/db';
import request from 'supertest';
import app from '../../src/app';
import { Prisma } from '../../db/client';
import HistoryCategoryRepository from '../../src/repositories/history_category_repository';
import CategoryRepository from '../../src/repositories/category_repository';
import TypeRepository from '../../src/repositories/type_repository';

let history_category: Prisma.history_categoryGetPayload<true>;
let category: Prisma.categoryGetPayload<true>;
let type: Prisma.typeGetPayload<true>;

const accountId = '99f2c06e-d9a5-4565-ab0d-4702ebdbf0d2';

beforeEach(async () => {
  await resetDB();

  type = await TypeRepository.create({
    data: {
      type: 'Title',
    },
  });

  category = await CategoryRepository.create({
    data: {
      title: {
        en: 'Title',
        th: 'Title',
      },
      created_at: '2024-02-13T08:47:06.956Z',
      updated_at: '2024-02-13T08:47:06.956Z',
      version: 1,
      updated_by: '1',
      type_id: type.id,
    },
  });

  history_category = await HistoryCategoryRepository.create({
    data: {
      title: {
        en: 'Title',
        th: 'Title',
      },
      created_at: '2024-02-13T08:47:06.956Z',
      updated_at: '2024-02-13T08:47:06.956Z',
      version: 1,
      updated_by: '1',
      type_id: type.id,
      category_id: category.id,
    },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('HistoryCategoryController', () => {
  describe('GET /history-category', () => {
    it('should return data', async () => {
      const response = await request(app).get('/history-category').send();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /history-document/{id}', () => {
    describe('when history document exists', () => {
      it('should return data', async () => {
        const response = await request(app)
          .get(`/history-category/${history_category.id}`)
          .set('x-access-token', accountId)
          .send();
        expect(response.body).toStrictEqual({
          data: {
            active: false,
            category_id: category.id,
            created_at: '2024-02-13T08:47:06.956Z',
            history_document: [],
            id: history_category.id,
            image: null,
            title: { en: 'Title', th: 'Title' },
            type_id: type.id,
            updated_at: '2024-02-13T08:47:06.956Z',
            updated_by: {},
            version: 1,
          },
        });
      });
    });
    describe('when history document does not exist', () => {
      it('should return data null', async () => {
        const response = await request(app).get('/history-category/2').send();
        expect(response.body).toStrictEqual({
          data: null,
        });
      });
    });
  });
});
