import { Prisma } from '../../../db/client';

export type ServiceRequestWhereData = Prisma.ServiceRequestWhereInput;

export interface PaginationQuery {
  limit: number;
  page: number;
  order: 'asc' | 'desc';
  sort: string;
  count: boolean;
}
