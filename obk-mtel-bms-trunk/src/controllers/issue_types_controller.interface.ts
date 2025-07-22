import { JsonValue } from '@prisma/client/runtime/library';

export type IssueTypeData = {
  id: string;
  name: string;
  display_name: JsonValue;
  internal_remark: string | null;
  created_at: string;
  updated_at: string;
};

export type IssueTypeRequest = {
  name: string;
  display_name: object;
  internal_remark?: string;
};
export type IssueTypeUpdate = {
  name?: string;
  display_name?: object;
  deleted_at?: string;
  internal_remark?: string;
};

export type IssueTypeResponse = IssueTypeData[];
