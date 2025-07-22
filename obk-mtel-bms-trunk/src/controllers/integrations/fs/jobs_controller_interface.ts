export interface SyncBody {
  name: string;
}

export interface SyncResult {
  sync: {
    result: boolean;
    jobError: {
      type: string;
      uid_name: string;
    }[];
  };
}

export interface SyncResponse {
  data: SyncResult;
}
