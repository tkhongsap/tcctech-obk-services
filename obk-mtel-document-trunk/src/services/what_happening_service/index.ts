import { Prisma } from '../../../db/client';
import { UpdateWhatheppeningBody, WhathappeningShowQuery } from '../../controllers/whathappening_controller.interfaces';
import DocumentRepository from '../../repositories/document_repository';
import TypeRepository from '../../repositories/type_repository';
import CategoryRepository from '../../repositories/category_repository';
import { WhathappeningQueryBuilder, WhathappeningQueryResponse } from './index.interface';
import dbClient from '../../../db/client';
import { sortBy } from 'lodash';
import { PrismaPromise } from '@prisma/client/runtime/library';

export default class WhathappeningService {
  public async getCategory(): Promise<typeof category> {
    const types = await TypeRepository.findMany({ where: { type: 'whathappening' } });
    const category = await CategoryRepository.findFirst({ where: { type_id: types[0].id } });
    return category;
  }

  public async findAll(categoryid: string, query: WhathappeningShowQuery): Promise<typeof result> {
    const pagination = {
      limit: query.limit,
      page: query.page,
      order: query.order ?? 'desc',
      sort: query.sort ?? 'updated_at',
    };

    const { queriesString, values } = this.queryBuilder(categoryid, query);

    const getOrderType = (field: string): string => {
      switch (field) {
        case 'body.seq':
          return '::int';
      }
      return '';
    };

    if (pagination.sort.startsWith('body.')) {
      const fields = pagination.sort.split('.');
      fields.splice(0, 1);
      if (pagination.sort === 'body.eventStartDate') {
        const query = `ORDER BY (body#>>'{eventStartDate}') ${pagination.order}, (body#>>'{eventEndDate}') ${pagination.order}`;
        values.push(Prisma.empty);
        queriesString.push(query);
      } else {
        const query = `ORDER BY (body#>>'{${fields.join(', ')}}')${getOrderType(pagination.sort)} ${pagination.order}`;
        values.push(Prisma.empty);
        queriesString.push(query);
      }
    } else {
      const query = `ORDER BY ${pagination.sort} ${pagination.order}`;
      queriesString.push(query);
      values.push(Prisma.empty);
    }

    if (pagination.page !== undefined && pagination.limit !== undefined) {
      const skip = pagination.page * pagination.limit;
      const query = `LIMIT $${queriesString.length + 1} OFFSET $${queriesString.length + 2}`;
      queriesString.push(query);
      values.push(pagination.limit);
      values.push(skip);
    }

    const queryTemplate = Prisma.raw(queriesString.join(' '));
    queryTemplate.values.push(...values);
    const result = await dbClient.$queryRaw<WhathappeningQueryResponse[]>(queryTemplate);
    return result;
  }

  public async count(categoryid: string, query: WhathappeningShowQuery): Promise<typeof result> {
    const { queriesString, values } = this.queryBuilder(categoryid, query, true);
    const queryTemplate = Prisma.raw(queriesString.join(' '));
    queryTemplate.values.push(...values);
    const result = await dbClient.$queryRaw<{ count: number }[]>(queryTemplate);
    return result;
  }

  queryBuilder(categoryId: string, query: WhathappeningShowQuery, isCount: boolean = false): WhathappeningQueryBuilder {
    const {
      released,
      releaseDate,
      published,
      active,
      isCurrentDisplay,
      filter,
      location,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      showStartDateFrom,
      showStartDateTo,
      showEndDateFrom,
      showEndDateTo,
    } = query;
    let paramCounter = 0;
    let initailQuery = `
			SELECT id, category_id, active, release_date, created_at, published, updated_at, body, updated_by 
			from document 
			WHERE deleted_at IS NULL AND category_id = $${++paramCounter} 
	  	`;

    if (isCount) {
      initailQuery = `
		SELECT COUNT(id) AS count from document 
		WHERE deleted_at IS NULL AND category_id = $${paramCounter} 
	  `;
    }

    const queriesString = [initailQuery];
    const values: unknown[] = [categoryId];

    if (active !== undefined && active !== null) {
      const query = `AND active = $${++paramCounter}`;
      queriesString.push(query);
      values.push(active);
    }

    if (released) {
      paramCounter++;
      const query = `AND release_date IS NOT NULL`;
      queriesString.push(query);
      values.push(Prisma.empty);
    }

    if (releaseDate !== undefined && releaseDate !== null) {
      const query = `AND release_date >= $${++paramCounter}::DATE`;
      queriesString.push(query);
      values.push(releaseDate);
    }

    if (published !== undefined && published !== null) {
      const query = `AND published = $${++paramCounter}`;
      queriesString.push(query);
      values.push(published);
    }

    if (isCurrentDisplay !== undefined && isCurrentDisplay !== null) {
      const query = `AND (body#>>'{isCurrentDisplay}')::BOOLEAN = $${++paramCounter}`;
      queriesString.push(query);
      values.push(isCurrentDisplay);
    }

    if (filter) {
      const queryEn = `AND (body#>>'{content, en, title}' ILIKE $${++paramCounter}`;
      queriesString.push(queryEn);
      values.push('%' + filter + '%');
      const queryTh = `OR body#>>'{content, th, title}' ILIKE $${++paramCounter}`;
      queriesString.push(queryTh);
      values.push('%' + filter + '%');
      const queryZh = `OR body#>>'{content, zh, title}' ILIKE $${++paramCounter})`;
      queriesString.push(queryZh);
      values.push('%' + filter + '%');
    }

    if (location) {
      const query = `AND body#>>'{location}' ILIKE $${++paramCounter}`;
      queriesString.push(query);
      values.push('%' + location + '%');
    }

    if (startDateFrom) {
      const query = `AND body#>>'{eventStartDate}' <> '' AND body#>>'{eventStartDate}' IS NOT NULL AND (body#>>'{eventStartDate}')::DATE >= $${++paramCounter}::DATE`;
      queriesString.push(query);
      values.push(startDateFrom);
    }

    if (startDateTo) {
      const query = `AND body#>>'{eventStartDate}' <> '' AND body#>>'{eventStartDate}' IS NOT NULL AND (body#>>'{eventStartDate}')::DATE <= $${++paramCounter}::DATE`;
      queriesString.push(query);
      values.push(startDateTo);
    }

    if (endDateFrom) {
      const query = `AND body#>>'{eventEndDate}' <> '' AND body#>>'{eventEndDate}' IS NOT NULL AND (body#>>'{eventEndDate}')::DATE >= $${++paramCounter}::DATE`;
      queriesString.push(query);
      values.push(endDateFrom);
    }

    if (endDateTo) {
      const query = `AND body#>>'{eventEndDate}' <> '' AND body#>>'{eventEndDate}' IS NOT NULL AND (body#>>'{eventEndDate}')::DATE <= $${++paramCounter}::DATE`;
      queriesString.push(query);
      values.push(endDateTo);
    }

    if (showStartDateFrom) {
      const query = `AND body#>>'{showStartDate}' <> '' AND body#>>'{showStartDate}' IS NOT NULL AND (body#>>'{showStartDate}')::DATE >= $${++paramCounter}::DATE`;
      queriesString.push(query);
      values.push(showStartDateFrom);
    }

    if (showStartDateTo) {
      const query = `AND body#>>'{showStartDate}' <> '' AND body#>>'{showStartDate}' IS NOT NULL AND (body#>>'{showStartDate}')::DATE <= $${++paramCounter}::DATE`;
      queriesString.push(query);
      values.push(showStartDateTo);
    }

    if (showEndDateFrom) {
      const query = `AND body#>>'{showEndDate}' <> '' AND body#>>'{showEndDate}' IS NOT NULL AND (body#>>'{showEndDate}')::DATE >= $${++paramCounter}::DATE`;
      queriesString.push(query);
      values.push(showEndDateFrom);
    }

    if (showEndDateTo) {
      const query = `AND body#>>'{showEndDate}' <> '' AND body#>>'{showEndDate}' IS NOT NULL AND (body#>>'{showEndDate}')::DATE <= $${++paramCounter}::DATE`;
      queriesString.push(query);
      values.push(showEndDateTo);
    }

    return { queriesString, values };
  }

  public async getById(id: string): Promise<typeof result> {
    const criteria: Prisma.documentWhereInput = {
      id: id,
    };
    const result = await DocumentRepository.findFirst({ where: criteria });
    return result;
  }

  public async toggleCurrentDisplay(id: string): Promise<typeof result> {
    const result = await DocumentRepository.findFirst({ where: { id } });
    const currentDisplayDocuments = await this.getCurrentDisplays();
    const sortedCurrentDisplay = sortBy(currentDisplayDocuments, (x) => (x.body as Prisma.JsonObject)['seq']);

    const queries: PrismaPromise<unknown>[] = [];

    if (result && result?.body && typeof result.body === 'object') {
      const bodyObject = result.body as Prisma.JsonObject;
      if (sortedCurrentDisplay.find((x) => x.id === result.id)) {
        bodyObject['seq'] = 0;
        bodyObject['isCurrentDisplay'] = false;
        queries.push(DocumentRepository.update({ where: { id }, data: { body: bodyObject } }));
        sortedCurrentDisplay
          .filter((x) => x.id !== result.id)
          .forEach((x, i) => {
            (x.body as Prisma.JsonObject)['seq'] = i + 1;
            (x.body as Prisma.JsonObject)['isCurrentDisplay'] = true;
            queries.push(
              DocumentRepository.update({ where: { id: x.id }, data: { body: x.body as Prisma.JsonObject } }),
            );
          });
      } else {
        if (sortedCurrentDisplay.length >= 3) {
          throw new Error('MAXIMUM_EXCEED');
        }

        const eventEndDate = new Date((bodyObject['eventEndDate'] as string) ?? '');
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60000;
        if (now > new Date(eventEndDate.getTime() + timezoneOffset)) {
          throw new Error('INVALID_EVENT_DATE');
        }

        if (result.release_date && new Date(result.release_date.getTime() + timezoneOffset) > now) {
          throw new Error('INVALID_PUBLISH_DATE');
        }

        sortedCurrentDisplay.push(result);
        sortedCurrentDisplay.forEach((x, i) => {
          (x.body as Prisma.JsonObject)['seq'] = i + 1;
          (x.body as Prisma.JsonObject)['isCurrentDisplay'] = true;
          queries.push(DocumentRepository.update({ where: { id: x.id }, data: { body: x.body as Prisma.JsonObject } }));
        });
      }
    }
    if (queries.length > 0) {
      await dbClient.$transaction(queries);
    }

    return result;
  }

  public async getCurrentDisplays(): Promise<typeof result> {
    const category = await this.getCategory();
    const criteria: Prisma.documentWhereInput = {
      category_id: category?.id,
      body: { path: ['isCurrentDisplay'], equals: true },
      active: true,
      deleted_at: null,
      published: true,
    };

    const result = await DocumentRepository.findMany({ where: criteria });
    return result;
  }

  public async setOrderCurrentDisplay(id: string, seq: number): Promise<typeof result> {
    const currenSeqCriteria: Prisma.documentWhereInput = {
      AND: [{ body: { path: ['seq'], equals: seq } }, { body: { path: ['isCurrentDisplay'], equals: true } }],
      active: true,
      deleted_at: null,
    };
    const replaceDiplayCriteria: Prisma.documentWhereInput = {
      id: id,
      body: { path: ['isCurrentDisplay'], equals: true },
      active: true,
      deleted_at: null,
    };
    const currenSeq = await DocumentRepository.findFirst({ where: currenSeqCriteria });
    const replaceDiaplay = await DocumentRepository.findFirst({ where: replaceDiplayCriteria });

    if (!replaceDiaplay) {
      throw new Error('Data not found');
    }

    const replaceDiaplayBody = replaceDiaplay?.body as Prisma.JsonObject;

    if (currenSeq) {
      const currenSeqBody = currenSeq?.body as Prisma.JsonObject;
      currenSeqBody['seq'] = replaceDiaplayBody['seq'];
      await DocumentRepository.update({ where: { id: currenSeq.id }, data: { body: currenSeqBody } });
    }
    replaceDiaplayBody['seq'] = seq;
    const result = await DocumentRepository.update({
      where: { id: replaceDiaplay.id },
      data: { body: replaceDiaplayBody },
    });
    return result;
  }

  public async getReplaceCurrentDisplay(categoryId: string): Promise<typeof result> {
    const now = new Date();
    const queryCurrentDisplay: WhathappeningShowQuery = {
      isCurrentDisplay: true,
      active: true,
      published: true,
    };
    const currentDisplays = await this.findAll(categoryId, queryCurrentDisplay);
    const overdueCurrentDisplay = currentDisplays.filter((x) => {
      const bodyObject = x.body as Prisma.JsonObject;
      const showEndDate = new Date((bodyObject['showEndDate'] as string) ?? '');
      const timezoneOffset = now.getTimezoneOffset() * 60000;
      return now > new Date(showEndDate.getTime() + timezoneOffset);
    });

    if (overdueCurrentDisplay.length === 0) {
      return [];
    }

    overdueCurrentDisplay.forEach((x) => {
      x.active = false;
      (x.body as Prisma.JsonObject)['isCurrentDisplay'] = false;
      (x.body as Prisma.JsonObject)['seq'] = 0;
    });

    const query: WhathappeningShowQuery = {
      active: true,
      published: true,
      showEndDateFrom: now.toISOString(),
      isCurrentDisplay: false,
      limit: overdueCurrentDisplay.length,
      released: true,
      order: 'desc',
      sort: 'body.showStartDate',
      page: 0,
    };

    const replaceCurrentDisplay = await this.findAll(categoryId, query);

    const validCurretDisplay = currentDisplays.filter((x) => !overdueCurrentDisplay.find((o) => o.id === x.id));
    const result = sortBy(validCurretDisplay, (x) => (x.body as Prisma.JsonObject)['seq']);
    result.push(...(replaceCurrentDisplay as never[]));
    result.forEach((x, i) => {
      if (i < 3) {
        (x.body as Prisma.JsonObject)['isCurrentDisplay'] = true;
        (x.body as Prisma.JsonObject)['seq'] = i + 1;
      } else {
        (x.body as Prisma.JsonObject)['isCurrentDisplay'] = false;
        (x.body as Prisma.JsonObject)['seq'] = 0;
      }
    });

    result.push(...(overdueCurrentDisplay as never[]));

    return result;
  }

  public async getOverdue(categoryId: string): Promise<typeof overdueData> {
    const now = new Date();
    const query: WhathappeningShowQuery = {
      published: true,
      active: true,
      showEndDateTo: now.toISOString(),
      isCurrentDisplay: false,
    };

    const overdueData = await this.findAll(categoryId, query);
    overdueData.forEach((data) => {
      data.active = false;
    });
    return overdueData;
  }

  public async bulkUpdate(dataList: UpdateWhatheppeningBody[], userId: string): Promise<number> {
    const queries: PrismaPromise<unknown>[] = [];

    dataList.forEach((data) => {
      queries.push(
        DocumentRepository.update({
          where: { id: data.id as string },
          data: { active: data.active, body: data.body as Prisma.JsonObject, updated_by: userId },
        }),
      );
    });

    if (queries.length > 0) {
      await dbClient.$transaction(queries);
    }
    return queries.length;
  }

  public async delete(id: string): Promise<typeof result> {
    const result = await DocumentRepository.findFirst({ where: { id } });

    const queries: PrismaPromise<unknown>[] = [];

    if (result && result?.body && typeof result.body === 'object') {
      const currentDisplayDocuments = await this.getCurrentDisplays();
      const sortedCurrentDisplay = sortBy(currentDisplayDocuments, (x) => (x.body as Prisma.JsonObject)['seq']);
      const bodyObject = result.body as Prisma.JsonObject;
      bodyObject['seq'] = 0;
      bodyObject['isCurrentDisplay'] = false;
      if (sortedCurrentDisplay.find((x) => x.id === result.id)) {
        queries.push(DocumentRepository.update({ where: { id }, data: { body: bodyObject, active: false } }));
        sortedCurrentDisplay
          .filter((x) => x.id !== result.id)
          .forEach((x, i) => {
            (x.body as Prisma.JsonObject)['seq'] = i + 1;
            (x.body as Prisma.JsonObject)['isCurrentDisplay'] = true;
            queries.push(
              DocumentRepository.update({ where: { id: x.id }, data: { body: x.body as Prisma.JsonObject } }),
            );
          });
      } else {
        queries.push(DocumentRepository.update({ where: { id }, data: { body: bodyObject, active: false } }));
      }
    }
    if (queries.length > 0) {
      await dbClient.$transaction(queries);
    }

    return result;
  }

  public async deleteDraft(id: string): Promise<void> {
    const queries: PrismaPromise<unknown>[] = [];
    const result = await DocumentRepository.findFirst({ where: { id } });
    if (result) {
      if (result.published) {
        throw new Error(`Cannot delete published document`);
      }
      queries.push(DocumentRepository.delete({ where: { id } }));
    }
    if (queries.length > 0) {
      await dbClient.$transaction(queries);
    }
  }
}
