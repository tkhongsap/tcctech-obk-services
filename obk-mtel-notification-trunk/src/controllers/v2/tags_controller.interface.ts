import { tag } from '../../../db/client/';

export interface TagData extends Omit<tag, 'created_at' | 'updated_at'> {
  created_at: string;
  updated_at: string;
}

export type TagsIndexResponseData = TagData[];
