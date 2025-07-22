export interface TypeIndexQuery {
  name?: string;
}
export interface TypeResult {
  id: string;
  type: string;
}

export interface CreateOrUpdateTypeBody {
  name: string;
}
