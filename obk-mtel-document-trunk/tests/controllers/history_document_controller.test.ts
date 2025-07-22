import { resetDB } from '../helpers/db';
import HistoryDocumentRepository from '../../src/repositories/history_document_repository';
import request from 'supertest';
import app from '../../src/app';
import { Prisma } from '../../db/client';
import HistoryCategoryRepository from '../../src/repositories/history_category_repository';
import CategoryRepository from '../../src/repositories/category_repository';
import TypeRepository from '../../src/repositories/type_repository';
import DocumentRepository from '../../src/repositories/document_repository';
import cache from '../../src/libs/cache';

let history_document: Prisma.history_documentGetPayload<true>;
let category: Prisma.categoryGetPayload<true>;
let type: Prisma.typeGetPayload<true>;
let document: Prisma.documentGetPayload<true>;

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

  document = await DocumentRepository.create({
    data: {
      title: {
        en: 'Title',
        th: 'Title',
      },
      body: {
        en: 'Body',
        th: 'Body',
      },
      category_id: category.id,
      published: true,
      created_at: '2024-02-13T08:47:06.956Z',
      updated_at: '2024-02-13T08:47:06.956Z',
      version: 1,
      slug: 'slug',
    },
  });

  await HistoryCategoryRepository.create({
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

  history_document = await HistoryDocumentRepository.create({
    data: {
      title: {
        en: 'Title',
        th: 'Title',
      },
      body: {
        en: 'Body',
        th: 'Body',
      },
      category_id: category.id,
      published: true,
      created_at: '2024-02-13T08:47:06.956Z',
      updated_at: '2024-02-13T08:47:06.956Z',
      version: 1,
      slug: 'slug',
      updated_by: '1',
      document_id: document.id,
    },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('HistoryDocumentController', () => {
  describe('GET /history-document', () => {
    it('should return data', async () => {
      jest.spyOn(cache, 'getSet').mockResolvedValueOnce('');
      const response = await request(app).get('/history-document').send();
      console.log('response.body', response.body);

      expect(response.body).toStrictEqual({
        data: [
          {
            active: false,
            body: {
              en: 'Body',
              th: 'Body',
            },
            category_id: category.id,
            created_at: history_document.created_at?.toISOString(),
            document_id: document.id,
            history_category_id: null,
            id: history_document.id,
            image: null,
            published: true,
            release_date: null,
            slug: 'slug',
            title: {
              en: 'Title',
              th: 'Title',
            },
            updated_at: history_document.updated_at?.toISOString(),
            updated_by: '1',
            updated_by_name: null,
            version: 1,
          },
        ],
      });
    });
  });

  describe('GET /history-document/{id}', () => {
    describe('when history document exists', () => {
      it('should return data', async () => {
        jest.spyOn(cache, 'getSet').mockResolvedValueOnce('');
        const response = await request(app).get(`/history-document/${history_document.id}`).send();
        expect(response.body).toStrictEqual({
          data: {
            active: false,
            body: {
              en: 'Body',
              th: 'Body',
            },
            category_id: category.id,
            created_at: history_document.created_at?.toISOString(),
            document_id: document.id,
            history_category_id: null,
            id: history_document.id,
            image: null,
            published: true,
            release_date: null,
            slug: 'slug',
            title: {
              en: 'Title',
              th: 'Title',
            },
            updated_at: history_document.updated_at?.toISOString(),
            updated_by: '1',
            updated_by_name: null,
            version: 1,
          },
        });
      });
    });
    describe('when history document does not exist', () => {
      it('should return data null', async () => {
        const response = await request(app).get('/history-document/2').send();
        expect(response.body).toStrictEqual({
          data: null,
        });
      });
    });
  });
});
