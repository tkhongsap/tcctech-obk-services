import { EventName } from '../../utils/kafka';
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

export interface OtpReferencePayload {
  identifier: string;
  valueMessage?: object;
}

export interface OtpReferenceCreatedData {
  payload: OtpReferencePayload;
  name: EventName;
}

export interface EmailTemplatePayload {
  account_id: string;
  valueMessage?: object;
}
export interface EmailTemplateAdminPayload {
  payload: EmailTemplatePayload;
  name: EventName;
}

export interface VisitorPassPayload {
  account_id: string;
  visitor_email: string;
  valueMessage?: object;
}

export interface VisitorPassEmailPayload {
  payload: VisitorPassPayload;
  name: EventName;
}

export interface ResidentVisitorPassPayload {
  account_id: string;
  visitor_email: string;
  valueMessage?: object;
  invite_name: string;
  invite_house_number: string;
  project_id?: number;
}

export interface ResidentVisitorPassEmailPayload {
  payload: ResidentVisitorPassPayload;
  name: EventName;
}
export interface MessageObject {
  [key: string]: string;
}
