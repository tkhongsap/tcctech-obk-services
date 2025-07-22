import { tag } from '../../../db/client/';
import { TagData } from './index.interface';

export function tagSerializer(tag: tag): TagData {
  return {
    ...tag,
    created_at: tag.created_at.toISOString(),
    updated_at: tag.updated_at.toISOString(),
  };
}
