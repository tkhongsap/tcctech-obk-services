# API Inventory: obk-parking-trunk

## Service Overview

- **Service Name**: obk-parking-trunk
- **Framework**: Express.js
- **Language**: JavaScript/TypeScript
- **Analysis Date**: 7/23/2025
- **Total Endpoints**: 1

## Technology Stack

- **Framework**: Express.js ^4.1.5
- **Language**: JavaScript/TypeScript
- **Dependencies**: 47 packages
- **External APIs**: 0

## API Endpoints

### GET /

- **Method**: GET
- **Path**: /
- **Function**: `undefined`
- **File**: `src/app.ts`
- **Description**: GET /

---



## Data Schemas

### LoggingContext

**File**: `src/context/logging_context.ts`

#### Fields
- **traceId** (`string`) - Optional
- **accountId** (`string`) - Optional

---

### BaseIndexQuery

**File**: `src/controllers/base_controller.interfaces.ts`

#### Fields
- **order_by** (`string`) - Optional
- **order_direction** (`string`) - Optional
- **page_number** (`number`) - Optional
- **page_size** (`number`) - Optional
- **filter_by** (`string`) - Optional
- **filter_key** (`string`) - Optional

---

### Pagination

**File**: `src/controllers/base_controller.ts`

#### Fields
- **total** (`number`) - Required
- **total_page** (`number`) - Required
- **page_number** (`number`) - Required
- **page_size** (`number`) - Required

---

### CampaignResponse

**File**: `src/controllers/campaign_controller.interface.ts`

#### Fields
- **id** (`string`) - Required
- **sequence** (`number`) - Required
- **price_min** (`number`) - Required
- **price_max** (`number | null`) - Required
- **redeem_hour** (`number`) - Required
- **rate_code** (`string`) - Required
- **created_at** (`Date`) - Required
- **updated_at** (`Date`) - Required
- **deleted_at** (`Date | null`) - Required

---

### CampaignSequenceResponse

**File**: `src/controllers/campaign_controller.interface.ts`

#### Fields
- **data** (`{`) - Required
- **1** (`CampaignResponse`) - Required
- **2** (`CampaignResponse`) - Required
- **3** (`CampaignResponse`) - Required
- **4** (`CampaignResponse`) - Required
- **created_at** (`Date | string`) - Required
- **updated_at** (`Date | string`) - Required
- **updated_by** (`string | null`) - Required

---

### BaseCampaignBody

**File**: `src/controllers/campaign_controller.interface.ts`

#### Fields
- **id** (`string`) - Optional
- **price_min** (`number`) - Required
- **redeem_hour** (`number`) - Required
- **rate_code** (`string`) - Required

---

### UpsertCampaignBody

**File**: `src/controllers/campaign_controller.interface.ts`

#### Fields
- **1** (`CampaignBody`) - Required
- **2** (`CampaignBody`) - Required
- **3** (`CampaignBody`) - Required
- **4** (`FinalCampaignBody`) - Required

---

### UpsertCampaign

**File**: `src/controllers/campaign_controller.interface.ts`

#### Fields
- **data** (`UpsertCampaignBody`) - Required
- **updated_by** (`string`) - Optional

---

### ConfigStoreWhitelistQuery

**File**: `src/controllers/config_controller.interface.ts`

#### Fields
- **id** (`string`) - Optional
- **tax_id** (`string`) - Optional
- **store_name** (`string`) - Optional
- **company_name** (`string`) - Optional
- **property_name** (`string`) - Optional
- **property_id** (`string`) - Optional
- **unit_no** (`string`) - Optional
- **address** (`string`) - Optional
- **building** (`string`) - Optional
- **has_tax_id** (`boolean`) - Optional
- **receipt_address_in_obk** (`boolean`) - Optional
- **updated_at** (`Date`) - Optional
- **created_at** (`string`) - Optional
- **sort_key** (`string`) - Optional
- **sort_direction** (`string`) - Optional

---

### AddConfigStoreWhitelist

**File**: `src/controllers/config_controller.interface.ts`

#### Fields
- **tax_id** (`string`) - Optional
- **store_name** (`string`) - Required
- **company_name** (`string`) - Required
- **property_id** (`string`) - Required
- **unit_no** (`string`) - Optional
- **address** (`string`) - Optional
- **building** (`string`) - Optional
- **has_tax_id** (`boolean`) - Required
- **receipt_address_in_obk** (`boolean`) - Required
- **updated_by** (`string`) - Optional

---

### PropertyQuery

**File**: `src/controllers/config_controller.interface.ts`

#### Fields
- **id** (`string`) - Optional
- **name** (`string`) - Optional

---

### UpdateConfigStoreWhitelist

**File**: `src/controllers/config_controller.interface.ts`

#### Fields
- **tax_id** (`string`) - Optional
- **store_name** (`string`) - Optional
- **company_name** (`string`) - Optional
- **property_id** (`string`) - Optional
- **unit_no** (`string`) - Optional
- **address** (`string`) - Optional
- **building** (`string`) - Optional
- **has_tax_id** (`boolean`) - Optional
- **receipt_address_in_obk** (`boolean`) - Optional
- **updated_by** (`string`) - Optional

---

### StoreWhitelistResponse

**File**: `src/controllers/config_controller.interface.ts`

#### Fields
- **id** (`string`) - Required
- **updated_at** (`Date`) - Required
- **created_at** (`Date`) - Required
- **tax_id** (`string | null`) - Required
- **store_name** (`string`) - Required
- **company_name** (`string`) - Required
- **unit_no** (`string | null`) - Required
- **address** (`string | null`) - Required
- **building** (`string | null`) - Required
- **has_tax_id** (`boolean`) - Required
- **receipt_address_in_obk** (`boolean`) - Required
- **property** (`{`) - Required
- **id** (`string`) - Required
- **name** (`string`) - Required
- **keywords** (`string[]`) - Required
- **addresses** (`string[]`) - Required

---

### propertiesResponse

**File**: `src/controllers/config_controller.interface.ts`

#### Fields
- **id** (`string`) - Required
- **name** (`string`) - Required
- **keywords** (`string[]`) - Required
- **addresses** (`string[]`) - Required

---

### PropertyBody

**File**: `src/controllers/config_controller.interface.ts`

#### Fields
- **name** (`string`) - Required
- **keywords** (`string[]`) - Required
- **addresses** (`string[]`) - Required

---

### ConfigDocsTypeResponse

**File**: `src/controllers/config_controller.interface.ts`

#### Fields
- **id** (`string`) - Required
- **keyword** (`string`) - Required
- **type** (`string`) - Required

---

### ConfigDocsTypeBody

**File**: `src/controllers/config_controller.interface.ts`

#### Fields
- **keyword** (`string`) - Required
- **type** (`string`) - Required

---

### AddParkingTicketQuery

**File**: `src/controllers/parking_detail_controller.interfaces.ts`

#### Fields
- **id** (`string`) - Required
- **platform** (`AddParkingTicketType`) - Required
- **id_type** (`AddParkingTicketIdType`) - Required

---

### AddParkingTicketResponse

**File**: `src/controllers/parking_detail_controller.interfaces.ts`

#### Fields
- **parkingDetailId** (`string`) - Required

---

### ParkingAccountDetail

**File**: `src/controllers/parking_detail_controller.interfaces.ts`

#### Fields
- **id** (`string`) - Required
- **username** (`string`) - Required
- **email** (`string`) - Required
- **phone** (`string`) - Required

---

### GetParkingDetailResponse

**File**: `src/controllers/parking_detail_controller.interfaces.ts`

#### Fields
- **id** (`string`) - Required
- **record_id** (`string`) - Required
- **parking_ticket** (`string`) - Required
- **license_plate** (`string`) - Required
- **account_detail** (`ParkingAccountDetail`) - Required
- **total_amount** (`string`) - Required
- **receipts** (`Receipt[]`) - Required
- **redeemed_at** (`string`) - Required
- **rate_detail** (`{`) - Required
- **en** (`string`) - Required
- **th** (`string`) - Required

---

### GetParkingDetailsIndexResponse

**File**: `src/controllers/parking_detail_controller.interfaces.ts`

#### Fields
- **id** (`string`) - Required
- **record_id** (`string`) - Required
- **parking_ticket_id** (`string`) - Required
- **plate_no** (`string`) - Required
- **account_detail** (`ParkingAccountDetail`) - Required
- **total_amount** (`string`) - Required
- **redeemed_at** (`string`) - Required
- **status** (`ParkingDetailStatus`) - Required

---

### GetParkingDetailIndexQuery

**File**: `src/controllers/parking_detail_controller.interfaces.ts`

#### Fields
- **startDate** (`string`) - Optional
- **endDate** (`string`) - Optional
- **status** (`ParkingDetailStatus`) - Optional

---

### ParkingDetailRedeemBody

**File**: `src/controllers/parking_detail_controller.interfaces.ts`

#### Fields
- **parking_detail_id** (`string`) - Required
- **type** (`RedeemType`) - Required

---

### RateDetail

**File**: `src/controllers/parking_detail_controller.interfaces.ts`

#### Fields
- **en** (`string`) - Required
- **th** (`string`) - Required

---

### RedeemParkingDetailResponse

**File**: `src/controllers/parking_detail_controller.interfaces.ts`

#### Fields
- **id** (`string`) - Required
- **plate_number** (`string`) - Required
- **ticket_number** (`string`) - Required
- **vehicle_type** (`string`) - Required
- **total_fee** (`number`) - Required
- **parked_at** (`string`) - Required
- **rate_detail** (`RateDetail`) - Required
- **member_type_id** (`number`) - Required
- **vehicle_type_id** (`number`) - Required
- **sub_code** (`string`) - Optional

---

### CreateReceiptBody

**File**: `src/controllers/receipts_controller_interface.ts`

#### Fields
- **parkingDetailId** (`string`) - Required
- **imageUrl** (`string`) - Required
- **email** (`string`) - Optional

---

### Receipt

**File**: `src/controllers/receipts_controller_interface.ts`

#### Fields
- **id** (`string`) - Required
- **total** (`string`) - Required
- **created_at** (`string`) - Required
- **updated_at** (`string`) - Required
- **status** (`ReceiptStatus`) - Required
- **message** (`string`) - Optional
- **image_url** (`string`) - Required
- **merchant_name** (`string`) - Optional
- **transaction_date** (`string`) - Optional
- **Format** (`YYYY-MM-DD`) - Required
- **transaction_time** (`string`) - Optional
- **Format** (`HH:mm (local time GMT+7)`) - Required
- **items** (`Item[]`) - Required
- **tax_id** (`string`) - Optional
- **receipt_no** (`string`) - Optional
- **addres** (`string`) - Optional
- **unit_no** (`string`) - Optional
- **mall_name** (`string`) - Optional
- **hashed_receipt** (`string`) - Optional
- **redeemed_at** (`string`) - Optional

---

### Item

**File**: `src/controllers/receipts_controller_interface.ts`

#### Fields
- **description** (`string`) - Required
- **quantity** (`number`) - Optional
- **total_price** (`string`) - Optional

---

### UpdateReceiptBody

**File**: `src/controllers/receipts_controller_interface.ts`

#### Fields
- **id** (`string`) - Required
- **merchant_name** (`string`) - Required
- **transaction_date** (`string`) - Required
- **Format** (`YYYY-MM-DD`) - Required
- **transaction_time** (`string`) - Required
- **Format** (`HH:mm (local time GMT+7)`) - Required
- **items** (`Item[]`) - Required
- **total** (`string`) - Required
- **tax_id** (`string`) - Required
- **receipt_no** (`string`) - Required
- **address** (`string`) - Required
- **unit_no** (`string`) - Required
- **mall_name** (`string`) - Required
- **hashed_receipt** (`string`) - Required
- **status** (`ReceiptStatus`) - Required
- **message** (`string`) - Required

---

### GetAllReceiptQuery

**File**: `src/controllers/receipts_controller_interface.ts`

#### Fields
- **id** (`string`) - Optional
- **receipt_hashed_id** (`string`) - Optional
- **user_id** (`string`) - Optional
- **status** (`ReceiptStatus`) - Optional
- **content** (`string`) - Optional
- **redeemed_at** (`string`) - Optional
- **created_at** (`string`) - Optional
- **total** (`string`) - Optional
- **parking_id** (`string`) - Optional

---

### GetAllReceiptResponse

**File**: `src/controllers/receipts_controller_interface.ts`

#### Fields
- **id** (`string`) - Required
- **receipt_hashed_id** (`string`) - Optional
- **user_id** (`string`) - Optional
- **status** (`ReceiptStatus`) - Required
- **content** (`Receipt`) - Optional
- **redeemed_at** (`string`) - Optional
- **created_at** (`string`) - Optional
- **total** (`string`) - Required
- **parking_id** (`string`) - Required

---

### GetParkingDetailByPersonIDDataResponse

**File**: `src/libs/fs_parking_client.ts`

#### Fields
- **status** (`string`) - Required
- **message** (`string`) - Required
- **exeption** (`string | null`) - Required
- **logId** (`string`) - Required
- **ticketNo** (`string`) - Required
- **ticketUid** (`string`) - Required
- **plateNo** (`string`) - Required
- **entryDateTime** (`string`) - Required
- **logDateTime** (`string`) - Required
- **exitStatus** (`number`) - Required
- **terminalInId** (`number`) - Required
- **terminalInName** (`string`) - Required
- **memberTypeId** (`number`) - Required
- **memberTypeName** (`string`) - Required
- **vehicleTypeId** (`number`) - Required
- **vehicleTypeName** (`string`) - Required
- **rateCode** (`string`) - Required
- **rateDetailTH** (`string`) - Required
- **rateDetailEN** (`string`) - Required
- **tenantId** (`string`) - Required
- **tenantName** (`string`) - Required
- **isCardLost** (`boolean`) - Required
- **parkHH** (`number`) - Required
- **parkMM** (`number`) - Required
- **rateHH** (`number`) - Required
- **freeHH** (`number`) - Required
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
- **lastDateTimePaymentAtKiosk** (`string | null`) - Required
- **payAtKioskAll** (`number`) - Required
- **durationInMinute** (`number`) - Required
- **timeUsedInMinute** (`number`) - Required
- **remainInMinute** (`number`) - Required

---

### ReceiptItem

**File**: `src/libs/ocr_client.ts`

#### Fields
- **description** (`string`) - Required
- **quantity** (`number | null`) - Required
- **total_price** (`string | null`) - Required

---

### ReceiptData

**File**: `src/libs/ocr_client.ts`

#### Fields
- **merchant_name** (`string | null`) - Required
- **transaction_date** (`string | null`) - Required
- **format** (`YYYY-MM-DD`) - Required
- **transaction_time** (`string | null`) - Required
- **HH** (`mm:ss`) - Required
- **items** (`ReceiptItem[]`) - Required
- **total** (`string`) - Required
- **tax_id** (`string | null`) - Required
- **receipt_no** (`string`) - Required
- **status** (`string`) - Required
- **address** (`string | null`) - Required
- **unit_no** (`string | null`) - Required
- **mall_name** (`string | null`) - Required
- **remarks** (`string[]`) - Required
- **hashed_receipt** (`string`) - Required
- **message** (`string`) - Required

---

### ReceiptDataErrorResponse

**File**: `src/libs/ocr_client.ts`

#### Fields
- **detail** (`{`) - Required
- **status** (`string`) - Required
- **http_status** (`number`) - Required
- **message** (`string`) - Required
- **step** (`string`) - Required
- **extracted_data** (`ReceiptData`) - Optional

---

### getOauth2Response

**File**: `src/libs/tcc_client.ts`

#### Fields
- **token_type** (`string`) - Required
- **access_token** (`string`) - Required
- **expires_in** (`number`) - Required

---

### RequirePermission

**File**: `src/middlewares/authorizer.ts`

#### Fields
- **resource** (`string`) - Required
- **action** (`string`) - Required

---

### EventReceiptApprovedPayload

**File**: `src/services/ocr_service.ts`

#### Fields
- **account_id** (`string`) - Required
- **receipt_id** (`string`) - Required
- **total_spending** (`Decimal | null`) - Required

---

### EventReceiptDeclinedPayload

**File**: `src/services/ocr_service.ts`

#### Fields
- **account_id** (`string`) - Required
- **receipt_id** (`string`) - Required
- **total_spending** (`Decimal | null`) - Required
- **reason_en** (`string`) - Required
- **reason_th** (`string`) - Required

---

### LogObject

**File**: `src/utils/logging.ts`

#### Fields
- **title** (`string`) - Optional
- **body** (`string`) - Optional
- **key** (`string]: any`) - Required

---



## External Dependencies

### Python Packages
- **@openapitools/openapi-generator-cli** (^2.7.0)
- **@prisma/client** (5.4.2)
- **@types/axios** (^0.14.0)
- **@types/better-queue** (^3.8.6)
- **@types/lodash** (^4.14.200)
- **@types/multer** (^1.4.9)
- **@types/swagger-ui-express** (^4.1.5)
- **aws-sdk** (^2.1481.0)
- **axios** (^1.6.0)
- **better-queue** (^3.8.12)
- **cors** (^2.8.5)
- **dayjs** (^1.11.10)
- **express** (^4.18.2)
- **jest** (^29.7.0)
- **kafkajs** (^2.2.4)
- **minio** (^8.0.5)
- **multer** (^1.4.5-lts.1)
- **ob-bms-sdk** (0.0.120)
- **ob-iam-sdk** (0.0.30)
- **prisma** (^5.4.2)
- **redis** (^5.1.0)
- **swagger-ui-express** (^5.0.0)
- **tsoa** (^5.1.1)
- **uuid** (^11.1.0)
- **winston** (^3.11.0)
- **yup** (^1.6.1)
- **@types/cors** (^2.8.16)
- **@types/express** (^4.17.20)
- **@types/jest** (^29.5.6)
- **@types/node** (^20.8.7)
- **@types/supertest** (^2.0.15)
- **@typescript-eslint/eslint-plugin** (^6.8.0)
- **@typescript-eslint/parser** (^6.8.0)
- **concurrently** (^8.2.2)
- **dotenv** (^16.3.1)
- **eslint** (^8.51.0)
- **eslint-config-prettier** (^9.0.0)
- **eslint-plugin-prettier** (^5.0.1)
- **husky** (^8.0.3)
- **lint-staged** (^15.0.1)
- **nodemon** (^3.0.1)
- **prettier** (^3.0.3)
- **supertest** (^6.3.3)
- **ts-jest** (^29.1.1)
- **ts-node** (^10.9.1)
- **ts-node-dev** (^2.0.0)
- **typescript** (^5.2.2)


### External APIs


## Summary

- ✅ **Total Endpoints**: 1
- ✅ **HTTP Methods**: GET
- ✅ **Authentication**: No
- ✅ **Documentation**: No
- ✅ **Schemas**: 41
- ✅ **Dependencies**: 47

---

*Generated by API Documentation and Inventory System - 7/23/2025* 