export interface liftCalledPayload {
  personID: string;
  liftName: string;
  floorName: string;
  towerName: string;
}

export interface visitorPassedPayload {
  inviteID: string;
  liftName: string;
  floorName: string;
  towerName: string;
}

export interface memberAccessLog {
  transacId: number;
  transacDatetime: string;
  projectID: number;
  towerID: number;
  personID: string;
  turnstileID: string;
  terminalPosition: number;
}

export interface visitorAccessLog {
  transacId: number;
  transacDatetime: string;
  projectID: number;
  towerID: number;
  inviteID: string;
  turnstileID: string;
  terminalPosition: number;
}

export interface parkingVisitorAccessLog {
  transacId: number;
  transacDatetime: string;
  inviteID: string;
  terminalID: string;
  terminalPosition: number;
}

export interface parkingMemberAccessLog {
  transacId: number;
  transacDatetime: string;
  personID: string;
  terminalID: string;
  terminalPosition: number;
}
export interface valetStatusPayload {
  uid: string;
  detail: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    code: string;
    status: string;
    name: string;
    phoneNumber: string;
    incomingTime: string;
    outgoingTime: string;
    licensePlate: string;
    licensePlateProvince: string;
    keyCabinetId: string;
    staffParkedId: string;
    staffDeliverId: string;
    userId: string;
    parkingSpotId: string;
    pickUpStationId: string;
    dropOffStationId: number;
    verifiedAt: string;
    staffVerifyId: string;
    confirmParkedAt: string;
    staffConfirmParkedId: number;
    confirmDeliverAt: string;
    staffConfirmDeliverId: string;
    signatureURL: string;
    referenceCode: string;
    isMyQr: boolean;
    spot: string;
    staffDeliver: string;
    staffParked: string;
    staffConfirmDeliver: string;
    staffConfirmParked: {
      id: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      userName: string;
      pin: string;
      email: string;
      phoneNumber: string;
      displayName: string;
      role: string;
    };
    staffVerify: string;
    pickUpStation: string;
    dropOffStation: {
      id: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      name: string;
      description: string;
      location: string;
      active: boolean;
      isUsed: boolean;
    };
    images: {
      createdAt: string;
      url: string;
      valetParkingId: number;
    }[];
    keyCabinet: string;
  };
}

export interface WebhookPaymentPaidPayload {
  transactionNo: string;
  invoiceNo: string;
  transactionDate: string;
  merchantId: string;
  merchantName: string;
  paymentChannel: string;
  amount: number;
  paidAmount: number;
  fee: number;
  feeVat: number;
  balance: number;
  transactionStatusId: number;
  description: string;
  deviceProfileId: string | null;
  referenceNumber: string;
}

export interface WebhookCreateBody {
  action: string;
  payload:
    | liftCalledPayload
    | visitorPassedPayload
    | memberAccessLog[]
    | visitorAccessLog[]
    | parkingVisitorAccessLog[]
    | parkingMemberAccessLog[]
    | valetStatusPayload
    | WebhookPaymentPaidPayload
    | any;
}
