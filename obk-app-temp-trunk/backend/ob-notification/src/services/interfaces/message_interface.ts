import { EventName } from 'ob-common-lib/dist';
import { Prisma } from '../../../db/client';

export type MessageWhereData = Prisma.messageWhereInput;

export type MessageUpdateData = Prisma.messageUpdateInput;
export type MessageWhereUpdateUniqueData = Prisma.messageWhereUniqueInput;
export type MesssageWhereUpdateData = Prisma.messageWhereInput;
export type MessageOrderByInput = Prisma.messageOrderByWithRelationInput;
export type MessageWhereInput = Prisma.messageWhereInput;
export interface PaginationQuery {
  limit: number;
  page: number;
  order: 'asc' | 'desc';
  sort: string;
  count: boolean;
}

export interface AutoMessagePayload {
  account_id: string;
  valueMessage?: object;
}
export interface AutoMessageCreatedData {
  payload: AutoMessagePayload;
  name: EventName;
}

export interface MessageObject {
  [key: string]: string;
}
