export interface GetParkingDetailResponse {
  status: string;
  message: string;
  exeption: string;
  logId: string;
  ticketNo: string;
  ticketUid: string;
  plateNo: string;
  exitStatus: number;
  terminalInId: number;
  terminalInName: string;
  memberTypeId: number;
  memberTypeName: string;
  vehicleTypeId: number;
  vehicleTypeName: string;
  entryDateTime: string;
  logDateTime: string;
  isCardLost: boolean;
  parkHH: number;
  parkMM: number;
  rateHH: number;
  freeHH: number;
  rateCode: string;
  rateDetailTH: string;
  rateDetailEN: string;
  tenantId: string;
  tenantName: string;
  subTotal: number;
  discount: number;
  parkFee: number;
  cardLostFine: number;
  overNightFine: number;
  total: number;
  isInv: boolean;
  invRateHH: number;
  invFee: number;
  isPayAtKiosk: boolean;
  lastDateTimePaymentAtKiosk: string;
  payAtKioskAll: number;
  timeUsedInMinute: number;
  durationInMinute: number;
  remainInMinute: number;
}

export interface Oauth2TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface GetPromptPayInput {
  invoiceNo: string;
  description: string;
  amount: number;
  subCode?: string;
}

export interface GetPromptPayResponse {
  respCode: string;
  respDesc: string;
  qrImage: string;
  transactionNo: string;
  qrTimeOut: number;
  qrId: string;
}

export interface GetTrueMoneyInput {
  invoiceNo: string;
  description: string;
  amount: number;
}

export interface GetTrueMoneyResponse {
  respCode: string;
  respDesc: string;
  qrImage: string;
  transactionNo: string;
  qrTimeOut: number;
  qrId: string;
}

export interface GetInquiryPaymentTransactionRqBody {
  transactionNo: string;
  type: string;
  logId: string;
  subCode?: string;
}

export interface GetInquiryPaymentTransactionResponse {
  transactionNo: string;
  invoiceNo: string;
  transactionDate: string;
  merchantId: string;
  merchantName: string;
  paymentChannel: string;
  amount: number;
  paidAmount: string;
  fee: number;
  feeVat: number;
  balance: number;
  transactionStatusId: number;
  description: string;
  deviceProfileId: string;
}

export type GetReceiptDetailsResponse = GetReceiptDetail[];
export interface GetReceiptDetail {
  trn_Log_ID_Payment: number;
  trn_Log_ID: string;
  trn_Date: string;
  trn_Terminal_ID: string;
  trn_User_ID: string;
  trn_Shift_Running_No: number;
  trn_Shift_Date: string;
  trn_Operation: any;
  trn_Direction: any;
  trn_Shift_Type: any;
  trn_Log_Date: string;
  trn_Ent_Date: string;
  trn_Ent_Terminal_ID: string;
  trn_Vehicle_Type: string;
  trn_Card_UID: string;
  trn_Ticket_No: string;
  trn_Ticket_Type: any;
  trn_Mem_Code: any;
  trn_Mem_Type: any;
  trn_Mem_Credit: any;
  trn_Car_Char: any;
  trn_Car_No: string;
  trn_Car_Prv: any;
  trn_Rate_HH: number;
  trn_Park_HH: number;
  trn_Park_MM: number;
  trn_Piad_Lost: any;
  trn_Piad_Overnight: any;
  trn_SubCharge: number;
  trn_SubTotal: number;
  trn_Discount: number;
  trn_Charge: number;
  trn_Total: number;
  trn_Cash: number;
  trn_Refund: any;
  trn_Piad_Card: any;
  trn_Piad_1: any;
  trn_Piad_2: any;
  trn_Piad_CP: any;
  trn_Piad_Cp_Detail: any;
  trn_Rate_Code: number;
  trn_Rate_LogID: any;
  trn_Bill_No: any;
  trn_Tax_No: string;
  trn_Piad_Remark: string;
  trn_Remark: any;
  trn_MSG: any;
  trn_Exit_Status: any;
  trn_Ref_Log: string;
  trn_TaxInv_Ref: any;
  trn_IsInv: number;
  trn_Inv_Pay: number;
  trn_Inv_Rate_HH: number;
  trn_Vat_Rate: number;
  trn_Vat: number;
  trn_Amount: number;
  trn_Lot_No: any;
  trn_Estamp_User: any;
  trn_Estamp_Date: any;
  trn_Estamp_Station: any;
  trn_Status: number;
  trn_Pooling_Date: string;
  trn_Fee_Type_Detail_Id: any;
  trn_Fee_Type_Detail_Name: string;
  trn_Fee_Percent: any;
  trn_Fee_Amont: any;
  trn_CreateTime: string;
  trn_IsVoid: number;
  trn_SaleTransactionId: any;
  trn_SaleTaxNo: any;
  void_reason_Id: any;
}

export interface GetReceiptImageResponse {
  image: string;
}

export interface GetAlldataDetailsReceiptBody {
  type: string;
  logId: string;
}
