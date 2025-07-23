# API Inventory: obk-campaign-web-trunk

## Service Overview

- **Service Name**: obk-campaign-web-trunk
- **Framework**: Next.js
- **Language**: JavaScript/TypeScript
- **Analysis Date**: 7/23/2025
- **Total Endpoints**: 0

## Technology Stack

- **Framework**: Next.js 14.2.6
- **Language**: JavaScript/TypeScript
- **Dependencies**: 29 packages
- **External APIs**: 0

## API Endpoints



## Data Schemas

### TermConProps

**File**: `src/app/[locale]/(campaign)/evShutterService/page.tsx`

#### Fields
- **stage** (`string`) - Required

---

### itemInput

**File**: `src/app/[locale]/cms/home/page.tsx`

#### Fields
- **name** (`string`) - Required
- **url** (`string`) - Required

---

### IFormInput

**File**: `src/app/[locale]/cms/login/page.tsx`

#### Fields
- **email** (`string`) - Required
- **password** (`string`) - Required

---

### Dialog

**File**: `src/app/[locale]/cms/scanqr/page.tsx`

#### Fields
- **title** (`string`) - Required

---

### ShowDialog

**File**: `src/components/UseCouponResultDialog.tsx`

#### Fields
- **title** (`string`) - Required
- **type** (`string`) - Required
- **message** (`string`) - Optional

---

### ButtonProps

**File**: `src/components/ui/button.tsx`

#### Fields
- **asChild** (`boolean`) - Optional

---

### FormItemContextValue

**File**: `src/components/ui/form.tsx`

#### Fields
- **id** (`string`) - Required

---

### AuthLoginPostBody

**File**: `src/types/services.ts`

#### Fields
- **email** (`string`) - Required
- **password** (`string`) - Required

---

### AuthLoginPostResponse

**File**: `src/types/services.ts`

#### Fields
- **authToken** (`string`) - Required

---

### AuthMeGetResponse

**File**: `src/types/services.ts`

#### Fields
- **id** (`string`) - Required
- **created_at** (`string`) - Required
- **name** (`string`) - Required
- **email** (`string`) - Required

---

### SurveyGetResponse

**File**: `src/types/services.ts`

#### Fields
- **id** (`number`) - Required
- **survey_code** (`string`) - Required
- **allow_multiple_responses** (`boolean`) - Required
- **expire_date** (`string`) - Required
- **title** (`string`) - Required
- **description** (`null | string`) - Required
- **question** (`Question`) - Required
- **btn_submit** (`string`) - Required
- **created_at** (`number`) - Required
- **last_update_at** (`null | number`) - Required
- **message** (`string`) - Optional

---

### Question

**File**: `src/types/services.ts`

#### Fields
- **questions** (`QuestionItem[]`) - Required

---

### QuestionItem

**File**: `src/types/services.ts`

#### Fields
- **id** (`number`) - Required
- **type** (`string`) - Required
- **options** (`string[]`) - Required
- **question** (`string`) - Required

---

### SurveyPostBody

**File**: `src/types/services.ts`

#### Fields
- **account_id** (`string`) - Required
- **answer** (`Answer[]`) - Required
- **start_time** (`string`) - Optional

---

### SurveyPostResponse

**File**: `src/types/services.ts`

#### Fields
- **id** (`number`) - Required
- **survey_code** (`string`) - Required
- **account_id** (`string`) - Required
- **answer** (`Answer[]`) - Required
- **created_at** (`number`) - Required

---

### Answer

**File**: `src/types/services.ts`

#### Fields
- **questionId** (`number`) - Required
- **answer** (`string`) - Required

---

### QrInfoPostBody

**File**: `src/types/services.ts`

#### Fields
- **ref_code** (`string`) - Required

---

### QrInfoPostResponse

**File**: `src/types/services.ts`

#### Fields
- **id** (`number`) - Required
- **account_id** (`string`) - Required
- **ref_code** (`string`) - Required
- **coupon_code** (`string`) - Required
- **coupon_use** (`boolean`) - Required
- **use_date** (`string | null`) - Required
- **expire_date** (`number`) - Required
- **created_at** (`number`) - Required
- **last_update_at** (`number`) - Required
- **message** (`string`) - Optional

---

### CouponGetBody

**File**: `src/types/services.ts`

#### Fields
- **ref_code** (`string`) - Required

---

### CouponGetResponse

**File**: `src/types/services.ts`

#### Fields
- **id** (`number`) - Required
- **account_id** (`string`) - Required
- **ref_code** (`string`) - Required
- **coupon_code** (`string`) - Required
- **coupon_use** (`boolean`) - Required
- **use_date** (`string | null`) - Required
- **expire_date** (`number`) - Required
- **created_at** (`number`) - Required
- **last_update_at** (`number`) - Required
- **message** (`string`) - Optional

---

### CouponPostBody

**File**: `src/types/services.ts`

#### Fields
- **ref_code** (`string`) - Required

---

### CouponPostResponse

**File**: `src/types/services.ts`

#### Fields
- **id** (`number`) - Required
- **account_id** (`string`) - Required
- **ref_code** (`string`) - Required
- **coupon_code** (`string`) - Required
- **coupon_use** (`boolean`) - Required
- **use_date** (`number`) - Required
- **expire_date** (`number`) - Required
- **created_at** (`number`) - Required
- **last_update_at** (`number`) - Required
- **message** (`string`) - Optional

---

### ActivityPostBody

**File**: `src/types/services.ts`

#### Fields
- **name** (`string`) - Required
- **data** (`{`) - Required
- **language** (`string`) - Optional
- **account_id** (`string`) - Required

---

### ActivityPostResponse

**File**: `src/types/services.ts`

#### Fields
- **id** (`number`) - Required
- **api_name** (`string`) - Required
- **method** (`string`) - Required
- **parameter** (`string`) - Required
- **result_value** (`string`) - Required
- **created_at** (`number`) - Required

---

### DynamicContentGetResponse

**File**: `src/types/services.ts`

#### Fields
- **id** (`string`) - Required
- **name** (`string`) - Required
- **language** (`string`) - Required
- **header** (`Header`) - Required
- **description** (`Description`) - Required
- **footer** (`Footer`) - Required
- **button** (`Button`) - Required
- **created_at** (`number`) - Required

---

### Header

**File**: `src/types/services.ts`

#### Fields
- **header** (`HeaderOrFooter`) - Required

---

### HeaderOrFooter

**File**: `src/types/services.ts`

#### Fields
- **title** (`string`) - Required
- **subtitle** (`string`) - Required
- **description** (`string`) - Required

---

### Description

**File**: `src/types/services.ts`

#### Fields
- **sessions** (`Sessions`) - Required

---

### Sessions

**File**: `src/types/services.ts`

#### Fields
- **session1** (`SessionsItem`) - Required
- **session2** (`SessionsItem`) - Required
- **session3** (`SessionsItem`) - Required

---

### SessionsItem

**File**: `src/types/services.ts`

#### Fields
- **description** (`string`) - Required

---

### Footer

**File**: `src/types/services.ts`

#### Fields
- **footer** (`HeaderOrFooter`) - Required

---

### Button

**File**: `src/types/services.ts`

#### Fields
- **footer** (`Footer1`) - Required

---

### Footer1

**File**: `src/types/services.ts`

#### Fields
- **button1** (`string`) - Required
- **button2** (`string`) - Required
- **button3** (`string`) - Required

---



## External Dependencies

### Python Packages
- **@hookform/resolvers** (^3.9.0)
- **@radix-ui/react-label** (^2.1.0)
- **@radix-ui/react-radio-group** (^1.2.0)
- **@radix-ui/react-slot** (^1.1.0)
- **class-variance-authority** (^0.7.0)
- **clsx** (^2.1.1)
- **date-fns** (^4.0.0)
- **image-blob-reduce** (^4.1.0)
- **lucide-react** (^0.436.0)
- **next** (14.2.6)
- **next-intl** (^3.19.1)
- **qr-scanner** (^1.4.2)
- **qrcode.react** (^4.0.1)
- **react** (^18)
- **react-dom** (^18)
- **react-hook-form** (^7.53.0)
- **tailwind-merge** (^2.5.2)
- **tailwindcss-animate** (^1.0.7)
- **zod** (^3.23.8)
- **@types/image-blob-reduce** (^4.1.4)
- **@types/node** (^20)
- **@types/react** (^18)
- **@types/react-dom** (^18)
- **eslint** (^8)
- **eslint-config-next** (14.2.6)
- **postcss** (^8.4.41)
- **postcss-100vh-fix** (^1.0.2)
- **tailwindcss** (^3.4.1)
- **typescript** (^5)


### External APIs


## Summary

- ✅ **Total Endpoints**: 0
- ✅ **HTTP Methods**: 
- ✅ **Authentication**: No
- ✅ **Documentation**: No
- ✅ **Schemas**: 33
- ✅ **Dependencies**: 29

---

*Generated by API Documentation and Inventory System - 7/23/2025* 