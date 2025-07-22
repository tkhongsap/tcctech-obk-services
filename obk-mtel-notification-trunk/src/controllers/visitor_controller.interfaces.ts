export interface VisitorVehicleCheckoutBody {
  visitor_email: string;
  account_id?: string;
  checkout_time: Date | string;
  project_id?: number;
}

export interface VisitorVehicleCheckoutResult {
  result: boolean;
}
