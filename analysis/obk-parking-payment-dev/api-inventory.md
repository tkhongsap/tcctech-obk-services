# API Inventory: obk-parking-payment-dev

## Service Overview

- **Service Name**: obk-parking-payment-dev
- **Framework**: Next.js
- **Language**: JavaScript/TypeScript
- **Analysis Date**: 7/23/2025
- **Total Endpoints**: 0

## Technology Stack

- **Framework**: Next.js ^14.2.5
- **Language**: JavaScript/TypeScript
- **Dependencies**: 15 packages
- **External APIs**: 0

## API Endpoints



## Data Schemas

### Props

**File**: `src/app/info/[id]/components/MainDetail.tsx`

#### Fields
- **data** (`GetParkingDetailResponse`) - Required

---

### itemInput

**File**: `src/app/info/[id]/payMethod/page.tsx`

#### Fields
- **logo** (`StaticImageData`) - Required
- **name** (`string`) - Required
- **slug** (`string`) - Required

---

### Props

**File**: `src/components/BottomAction.tsx`

#### Fields
- **text** (`string`) - Required
- **onClick** (`() => void`) - Optional
- **href** (`Object`) - Optional
- **showIcon** (`boolean`) - Optional
- **textPos** (`string`) - Optional
- **iconPos** (`string`) - Optional
- **prefetch** (`null | boolean`) - Optional

---

### GetOauthTokenOutput

**File**: `src/services/GetOauthToken.tsx`

#### Fields
- **data** (`Oauth2TokenResponse`) - Optional
- **error** (`string`) - Optional

---

### GetParkingDetailResponse

**File**: `src/types/Service.ts`

#### Fields
- **status** (`string`) - Required
- **message** (`string`) - Required
- **exeption** (`string`) - Required
- **logId** (`string`) - Required
- **ticketNo** (`string`) - Required
- **ticketUid** (`string`) - Required
- **plateNo** (`string`) - Required
- **exitStatus** (`number`) - Required
- **terminalInId** (`number`) - Required
- **terminalInName** (`string`) - Required
- **memberTypeId** (`number`) - Required
- **memberTypeName** (`string`) - Required
- **vehicleTypeId** (`number`) - Required
- **vehicleTypeName** (`string`) - Required
- **entryDateTime** (`string`) - Required
- **logDateTime** (`string`) - Required
- **isCardLost** (`boolean`) - Required
- **parkHH** (`number`) - Required
- **parkMM** (`number`) - Required
- **rateHH** (`number`) - Required
- **freeHH** (`number`) - Required
- **rateCode** (`string`) - Required
- **rateDetailTH** (`string`) - Required
- **rateDetailEN** (`string`) - Required
- **tenantId** (`string`) - Required
- **tenantName** (`string`) - Required
- **subTotal** (`number`) - Required
- **discount** (`number`) - Required
- **parkFee** (`number`) - Required
- **cardLostFine** (`number`) - Required
- **overNightFine** (`number`) - Required
- **total** (`number`) - Required
- **isInv** (`boolean`) - Required
- **invRateHH** (`number`) - Required
- **invFee** (`number`) - Required
- **isPayAtKiosk** (`boolean`) - Required
- **lastDateTimePaymentAtKiosk** (`string`) - Required
- **payAtKioskAll** (`number`) - Required
- **timeUsedInMinute** (`number`) - Required
- **durationInMinute** (`number`) - Required
- **remainInMinute** (`number`) - Required

---

### Oauth2TokenResponse

**File**: `src/types/Service.ts`

#### Fields
- **access_token** (`string`) - Required
- **expires_in** (`number`) - Required
- **token_type** (`string`) - Required

---

### GetPromptPayInput

**File**: `src/types/Service.ts`

#### Fields
- **invoiceNo** (`string`) - Required
- **description** (`string`) - Required
- **amount** (`number`) - Required
- **subCode** (`string`) - Optional

---

### GetPromptPayResponse

**File**: `src/types/Service.ts`

#### Fields
- **respCode** (`string`) - Required
- **respDesc** (`string`) - Required
- **qrImage** (`string`) - Required
- **transactionNo** (`string`) - Required
- **qrTimeOut** (`number`) - Required
- **qrId** (`string`) - Required

---

### GetTrueMoneyInput

**File**: `src/types/Service.ts`

#### Fields
- **invoiceNo** (`string`) - Required
- **description** (`string`) - Required
- **amount** (`number`) - Required

---

### GetTrueMoneyResponse

**File**: `src/types/Service.ts`

#### Fields
- **respCode** (`string`) - Required
- **respDesc** (`string`) - Required
- **qrImage** (`string`) - Required
- **transactionNo** (`string`) - Required
- **qrTimeOut** (`number`) - Required
- **qrId** (`string`) - Required

---

### GetInquiryPaymentTransactionRqBody

**File**: `src/types/Service.ts`

#### Fields
- **transactionNo** (`string`) - Required
- **type** (`string`) - Required
- **logId** (`string`) - Required
- **subCode** (`string`) - Optional

---

### GetInquiryPaymentTransactionResponse

**File**: `src/types/Service.ts`

#### Fields
- **transactionNo** (`string`) - Required
- **invoiceNo** (`string`) - Required
- **transactionDate** (`string`) - Required
- **merchantId** (`string`) - Required
- **merchantName** (`string`) - Required
- **paymentChannel** (`string`) - Required
- **amount** (`number`) - Required
- **paidAmount** (`string`) - Required
- **fee** (`number`) - Required
- **feeVat** (`number`) - Required
- **balance** (`number`) - Required
- **transactionStatusId** (`number`) - Required
- **description** (`string`) - Required
- **deviceProfileId** (`string`) - Required

---

### GetReceiptDetail

**File**: `src/types/Service.ts`

#### Fields
- **trn_Log_ID_Payment** (`number`) - Required
- **trn_Log_ID** (`string`) - Required
- **trn_Date** (`string`) - Required
- **trn_Terminal_ID** (`string`) - Required
- **trn_User_ID** (`string`) - Required
- **trn_Shift_Running_No** (`number`) - Required
- **trn_Shift_Date** (`string`) - Required
- **trn_Operation** (`any`) - Required
- **trn_Direction** (`any`) - Required
- **trn_Shift_Type** (`any`) - Required
- **trn_Log_Date** (`string`) - Required
- **trn_Ent_Date** (`string`) - Required
- **trn_Ent_Terminal_ID** (`string`) - Required
- **trn_Vehicle_Type** (`string`) - Required
- **trn_Card_UID** (`string`) - Required
- **trn_Ticket_No** (`string`) - Required
- **trn_Ticket_Type** (`any`) - Required
- **trn_Mem_Code** (`any`) - Required
- **trn_Mem_Type** (`any`) - Required
- **trn_Mem_Credit** (`any`) - Required
- **trn_Car_Char** (`any`) - Required
- **trn_Car_No** (`string`) - Required
- **trn_Car_Prv** (`any`) - Required
- **trn_Rate_HH** (`number`) - Required
- **trn_Park_HH** (`number`) - Required
- **trn_Park_MM** (`number`) - Required
- **trn_Piad_Lost** (`any`) - Required
- **trn_Piad_Overnight** (`any`) - Required
- **trn_SubCharge** (`number`) - Required
- **trn_SubTotal** (`number`) - Required
- **trn_Discount** (`number`) - Required
- **trn_Charge** (`number`) - Required
- **trn_Total** (`number`) - Required
- **trn_Cash** (`number`) - Required
- **trn_Refund** (`any`) - Required
- **trn_Piad_Card** (`any`) - Required
- **trn_Piad_1** (`any`) - Required
- **trn_Piad_2** (`any`) - Required
- **trn_Piad_CP** (`any`) - Required
- **trn_Piad_Cp_Detail** (`any`) - Required
- **trn_Rate_Code** (`number`) - Required
- **trn_Rate_LogID** (`any`) - Required
- **trn_Bill_No** (`any`) - Required
- **trn_Tax_No** (`string`) - Required
- **trn_Piad_Remark** (`string`) - Required
- **trn_Remark** (`any`) - Required
- **trn_MSG** (`any`) - Required
- **trn_Exit_Status** (`any`) - Required
- **trn_Ref_Log** (`string`) - Required
- **trn_TaxInv_Ref** (`any`) - Required
- **trn_IsInv** (`number`) - Required
- **trn_Inv_Pay** (`number`) - Required
- **trn_Inv_Rate_HH** (`number`) - Required
- **trn_Vat_Rate** (`number`) - Required
- **trn_Vat** (`number`) - Required
- **trn_Amount** (`number`) - Required
- **trn_Lot_No** (`any`) - Required
- **trn_Estamp_User** (`any`) - Required
- **trn_Estamp_Date** (`any`) - Required
- **trn_Estamp_Station** (`any`) - Required
- **trn_Status** (`number`) - Required
- **trn_Pooling_Date** (`string`) - Required
- **trn_Fee_Type_Detail_Id** (`any`) - Required
- **trn_Fee_Type_Detail_Name** (`string`) - Required
- **trn_Fee_Percent** (`any`) - Required
- **trn_Fee_Amont** (`any`) - Required
- **trn_CreateTime** (`string`) - Required
- **trn_IsVoid** (`number`) - Required
- **trn_SaleTransactionId** (`any`) - Required
- **trn_SaleTaxNo** (`any`) - Required
- **void_reason_Id** (`any`) - Required

---

### GetReceiptImageResponse

**File**: `src/types/Service.ts`

#### Fields
- **image** (`string`) - Required

---

### GetAlldataDetailsReceiptBody

**File**: `src/types/Service.ts`

#### Fields
- **type** (`string`) - Required
- **logId** (`string`) - Required

---

### item

**File**: `src/types/config/smart_parking_color.ts`

#### Fields
- **name** (`string`) - Required
- **color** (`string`) - Required

---



## External Dependencies

### Python Packages
- **date-fns** (^3.6.0)
- **firebase** (^11.2.0)
- **next** (^14.2.5)
- **react** (^18)
- **react-dom** (^18)
- **react-timer-hook** (^3.0.7)
- **swr** (^2.2.5)
- **@types/node** (^20)
- **@types/react** (^18)
- **@types/react-dom** (^18)
- **eslint** (^8)
- **eslint-config-next** (14.2.4)
- **postcss** (^8)
- **tailwindcss** (^3.4.1)
- **typescript** (^5)


### External APIs


## Summary

- ✅ **Total Endpoints**: 0
- ✅ **HTTP Methods**: 
- ✅ **Authentication**: No
- ✅ **Documentation**: No
- ✅ **Schemas**: 16
- ✅ **Dependencies**: 15

---

*Generated by API Documentation and Inventory System - 7/23/2025* 