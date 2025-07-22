export interface WhathappeningQueryBuilder {
  queriesString: string[];
  values: unknown[];
}
export interface WhathappeningQueryResponse {
  id: string;
  active: boolean;
  release_date: string;
  created_at: string;
  published: boolean;
  updated_at: string;
  body: unknown;
  updated_by: string;
}
