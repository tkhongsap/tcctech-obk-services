export interface MessageCategoryResult {
  id?: string;
  name?: string;
  sequence?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  icon_id?: string;
}

export interface MessageCountQuery {
  category?: string;
  read?: boolean;
}
export interface MessageCategoryBody {
  name: string;
  icon_id?: string | null;
  sequence: number;
}

export interface MessageCategoryUpdateBody {
  name?: string;
  icon_id?: string;
  sequence?: number;
}

export interface MessageCategoryCountResult {
  id: string;
  name: string;
  total: number;
}
