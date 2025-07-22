export interface FetchParkingResult {
  result: boolean;
  error: {
    type: string;
    uid_name: string;
  }[];
}
