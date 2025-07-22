# API Inventory: tcct-serviceabstraction-dev

## Service Overview

- **Service Name**: tcct-serviceabstraction-dev
- **Framework**: .NET
- **Language**: C#
- **Analysis Date**: 7/23/2025
- **Total Endpoints**: 352

## Technology Stack

- **Framework**: .NET {{FRAMEWORK_VERSION}}
- **Language**: C#
- **Dependencies**: 31 packages
- **External APIs**: 0

## API Endpoints

### GET api/v1/airquality/activefloor

- **Method**: GET
- **Path**: api/v1/airquality/activefloor
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/AirQuality/AirQualityController.cs`
- **Description**: GET api/v1/airquality/activefloor

#### Responses
- **200**: Success response

---

### GET api/v1/airquality/outdoorzone

- **Method**: GET
- **Path**: api/v1/airquality/outdoorzone
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/AirQuality/AirQualityController.cs`
- **Description**: GET api/v1/airquality/outdoorzone

#### Responses
- **200**: Success response

---

### GET api/v1/airquality/simplefeed

- **Method**: GET
- **Path**: api/v1/airquality/simplefeed
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/AirQuality/AirQualityController.cs`
- **Description**: GET api/v1/airquality/simplefeed

#### Responses
- **200**: Success response

---

### GET api/v1/airquality/feed

- **Method**: GET
- **Path**: api/v1/airquality/feed
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/AirQuality/AirQualityController.cs`
- **Description**: GET api/v1/airquality/feed

#### Responses
- **200**: Success response

---

### GET api/v1/airquality/feed/pm25

- **Method**: GET
- **Path**: api/v1/airquality/feed/pm25
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/AirQuality/AirQualityController.cs`
- **Description**: GET api/v1/airquality/feed/pm25

#### Responses
- **200**: Success response

---

### GET api/v1/airquality/feed/pm10

- **Method**: GET
- **Path**: api/v1/airquality/feed/pm10
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/AirQuality/AirQualityController.cs`
- **Description**: GET api/v1/airquality/feed/pm10

#### Responses
- **200**: Success response

---

### GET api/v1/airquality/feed/co2

- **Method**: GET
- **Path**: api/v1/airquality/feed/co2
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/AirQuality/AirQualityController.cs`
- **Description**: GET api/v1/airquality/feed/co2

#### Responses
- **200**: Success response

---

### GET api/v1/airquality/feed/temperature

- **Method**: GET
- **Path**: api/v1/airquality/feed/temperature
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/AirQuality/AirQualityController.cs`
- **Description**: GET api/v1/airquality/feed/temperature

#### Responses
- **200**: Success response

---

### GET api/v1/airquality/feed/humidity

- **Method**: GET
- **Path**: api/v1/airquality/feed/humidity
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/AirQuality/AirQualityController.cs`
- **Description**: GET api/v1/airquality/feed/humidity

#### Responses
- **200**: Success response

---

### POST api/v1/carpark/payment/PromptPay

- **Method**: POST
- **Path**: api/v1/carpark/payment/PromptPay
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/CarparkPayment/PaymentController.cs`
- **Description**: POST api/v1/carpark/payment/PromptPay

#### Parameters
- **request** (`PromptPayChargeCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/carpark/payment/TrueMoneyOnline

- **Method**: POST
- **Path**: api/v1/carpark/payment/TrueMoneyOnline
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/CarparkPayment/PaymentController.cs`
- **Description**: POST api/v1/carpark/payment/TrueMoneyOnline

#### Parameters
- **request** (`TrueMoneyOnlineChargeCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/carpark/payment/InquiryPaymentTransaction

- **Method**: POST
- **Path**: api/v1/carpark/payment/InquiryPaymentTransaction
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/CarparkPayment/PaymentController.cs`
- **Description**: POST api/v1/carpark/payment/InquiryPaymentTransaction

#### Parameters
- **request** (`InquiryPaymentTransactionCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/carpark/redemption/GetParkingDetail

- **Method**: POST
- **Path**: api/v1/carpark/redemption/GetParkingDetail
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/CarparkPayment/RedemptionController.cs`
- **Description**: POST api/v1/carpark/redemption/GetParkingDetail

#### Parameters
- **request** (`GetParkingDetailQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/carpark/redemption/AlldataDetailsReceipt

- **Method**: POST
- **Path**: api/v1/carpark/redemption/AlldataDetailsReceipt
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/CarparkPayment/RedemptionController.cs`
- **Description**: POST api/v1/carpark/redemption/AlldataDetailsReceipt

#### Parameters
- **request** (`AlldataDetailsReceiptCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/carpark/redemption/GenerateReceipt

- **Method**: POST
- **Path**: api/v1/carpark/redemption/GenerateReceipt
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/CarparkPayment/RedemptionController.cs`
- **Description**: POST api/v1/carpark/redemption/GenerateReceipt

#### Parameters
- **request** (`GenerateReceiptCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/Assets/Categories

- **Method**: GET
- **Path**: api/v1/certis/Assets/Categories
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/AssetManagementController.cs`
- **Description**: GET api/v1/certis/Assets/Categories

#### Responses
- **200**: Success response

---

### GET api/v1/certis/Assets/Group

- **Method**: GET
- **Path**: api/v1/certis/Assets/Group
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/AssetManagementController.cs`
- **Description**: GET api/v1/certis/Assets/Group

#### Responses
- **200**: Success response

---

### GET api/v1/certis/Assets

- **Method**: GET
- **Path**: api/v1/certis/Assets
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/AssetManagementController.cs`
- **Description**: GET api/v1/certis/Assets

#### Responses
- **200**: Success response

---

### GET api/v1/certis/AttachmentTypes

- **Method**: GET
- **Path**: api/v1/certis/AttachmentTypes
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/AttachmentTypeController.cs`
- **Description**: GET api/v1/certis/AttachmentTypes

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/types

- **Method**: GET
- **Path**: api/v1/certis/CWO/types
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/types

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/statuscode

- **Method**: GET
- **Path**: api/v1/certis/CWO/statuscode
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/statuscode

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/defaultconfig

- **Method**: GET
- **Path**: api/v1/certis/CWO/defaultconfig
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/defaultconfig

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/Priorities

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/Priorities
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/Priorities

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/Requesters/Types

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/Requesters/Types
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/Requesters/Types

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/Requesters

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/Requesters
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/Requesters

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/CommentTypes

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/CommentTypes
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/CommentTypes

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/ServiceProviders

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/ServiceProviders
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/ServiceProviders

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/ServiceCategories

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/ServiceCategories
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/ServiceCategories

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/ServiceCategories/ServingLocations

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/ServiceCategories/ServingLocations
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/ServiceCategories/ServingLocations

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/ProblemTypes

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/ProblemTypes
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/ProblemTypes

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/Checklists

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/Checklists
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/Checklists

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/Checklists/Tasks

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/Checklists/Tasks
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/Checklists/Tasks

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/FMSupervisors

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/FMSupervisors
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/FMSupervisors

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/FMSupervisors/Services

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/FMSupervisors/Services
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/FMSupervisors/Services

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/FMTechnicians

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/FMTechnicians
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/FMTechnicians

#### Responses
- **200**: Success response

---

### GET api/v1/certis/FMRelated/FMTechnicians/Services

- **Method**: GET
- **Path**: api/v1/certis/FMRelated/FMTechnicians/Services
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/FMRelatedController.cs`
- **Description**: GET api/v1/certis/FMRelated/FMTechnicians/Services

#### Responses
- **200**: Success response

---

### GET api/v1/certis/Locations/Types

- **Method**: GET
- **Path**: api/v1/certis/Locations/Types
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/LocationController.cs`
- **Description**: GET api/v1/certis/Locations/Types

#### Responses
- **200**: Success response

---

### GET api/v1/certis/Locations

- **Method**: GET
- **Path**: api/v1/certis/Locations
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/LocationController.cs`
- **Description**: GET api/v1/certis/Locations

#### Responses
- **200**: Success response

---

### GET api/v1/certis/Location/Config

- **Method**: GET
- **Path**: api/v1/certis/Location/Config
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/LocationController.cs`
- **Description**: GET api/v1/certis/Location/Config

#### Responses
- **200**: Success response

---

### GET api/v1/certis/master/users

- **Method**: GET
- **Path**: api/v1/certis/master/users
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/MasterController.cs`
- **Description**: GET api/v1/certis/master/users

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/FrequencyTypes

- **Method**: GET
- **Path**: api/v1/certis/PPM/FrequencyTypes
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/FrequencyTypes

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/StatusCodes

- **Method**: GET
- **Path**: api/v1/certis/PPM/StatusCodes
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/StatusCodes

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/DefaultConfig

- **Method**: GET
- **Path**: api/v1/certis/PPM/DefaultConfig
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/DefaultConfig

#### Responses
- **200**: Success response

---

### GET api/v1/UserPermission/UsersProfile

- **Method**: GET
- **Path**: api/v1/UserPermission/UsersProfile
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/UserPermissionController.cs`
- **Description**: GET api/v1/UserPermission/UsersProfile

#### Responses
- **200**: Success response

---

### GET api/v1/UserPermission/Myprofile/{userid}

- **Method**: GET
- **Path**: api/v1/UserPermission/Myprofile/{userid}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/UserPermissionController.cs`
- **Description**: GET api/v1/UserPermission/Myprofile/{userid}

#### Parameters
- **userid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/UserPermission/Userpermission

- **Method**: GET
- **Path**: api/v1/UserPermission/Userpermission
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/UserPermissionController.cs`
- **Description**: GET api/v1/UserPermission/Userpermission

#### Responses
- **200**: Success response

---

### GET api/v1/UserPermission/Group

- **Method**: GET
- **Path**: api/v1/UserPermission/Group
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/UserPermissionController.cs`
- **Description**: GET api/v1/UserPermission/Group

#### Responses
- **200**: Success response

---

### GET api/v1/UserPermission/Permissiongroup/{groupid}/Permissioninfo

- **Method**: GET
- **Path**: api/v1/UserPermission/Permissiongroup/{groupid}/Permissioninfo
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/UserPermissionController.cs`
- **Description**: GET api/v1/UserPermission/Permissiongroup/{groupid}/Permissioninfo

#### Parameters
- **groupid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/UserPermission/Permissiongroup/{groupid}/permission

- **Method**: GET
- **Path**: api/v1/UserPermission/Permissiongroup/{groupid}/permission
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/UserPermissionController.cs`
- **Description**: GET api/v1/UserPermission/Permissiongroup/{groupid}/permission

#### Parameters
- **groupid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/UserPermission/Permissiongroup/{userid}/user

- **Method**: GET
- **Path**: api/v1/UserPermission/Permissiongroup/{userid}/user
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/UserPermissionController.cs`
- **Description**: GET api/v1/UserPermission/Permissiongroup/{userid}/user

#### Parameters
- **userid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/UserPermission/Functionrole

- **Method**: GET
- **Path**: api/v1/UserPermission/Functionrole
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/MasterData/UserPermissionController.cs`
- **Description**: GET api/v1/UserPermission/Functionrole

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/event/types

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/event/types
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/event/types

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/event/subtypes

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/event/subtypes
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/event/subtypes

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/event/categories

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/event/categories
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/event/categories

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/types

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/types
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/types

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/status

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/status
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/status

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/task/category

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/task/category
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/task/category

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/task/status

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/task/status
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/task/status

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/sitehandlers

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/sitehandlers
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/sitehandlers

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/priority

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/priority
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/priority

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/slaconfigs

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/slaconfigs
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/slaconfigs

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/locations

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/locations
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/locations

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/locations/types

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/locations/types
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/locations/types

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/assets

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/assets
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/assets

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/assets/categories

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/assets/categories
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/assets/categories

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/icons

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/icons
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/icons

#### Parameters
- **caseId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/{caseId}/tasks

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/{caseId}/tasks
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/{caseId}/tasks

#### Parameters
- **caseId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/{caseId}/media

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/{caseId}/media
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/{caseId}/media

#### Parameters
- **caseId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/Cases/{id}

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/Cases/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/Cases/{id}

#### Parameters
- **id** (`string`) - Required
- **caseid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/{caseid}/tasks/{taskid}

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/{caseid}/tasks/{taskid}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/{caseid}/tasks/{taskid}

#### Parameters
- **caseid** (`string`) - Required
- **taskid** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/cms/cases/task

- **Method**: POST
- **Path**: api/v1/certis/cms/cases/task
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: POST api/v1/certis/cms/cases/task

#### Parameters
- **body** (`CaseCreateTaskRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/cms/cases/media

- **Method**: POST
- **Path**: api/v1/certis/cms/cases/media
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: POST api/v1/certis/cms/cases/media

#### Responses
- **200**: Success response

---

### PATCH api/v1/certis/cms/cases/task

- **Method**: PATCH
- **Path**: api/v1/certis/cms/cases/task
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: PATCH api/v1/certis/cms/cases/task

#### Parameters
- **body** (`CaseUpdateTaskCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/cases/updates

- **Method**: GET
- **Path**: api/v1/certis/cms/cases/updates
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: GET api/v1/certis/cms/cases/updates

#### Responses
- **200**: Success response

---

### POST api/v1/certis/cms/cases/interface/{caseId}/cwo

- **Method**: POST
- **Path**: api/v1/certis/cms/cases/interface/{caseId}/cwo
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: POST api/v1/certis/cms/cases/interface/{caseId}/cwo

#### Parameters
- **caseId** (`string`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/certis/cms/cases/update-case-status

- **Method**: PUT
- **Path**: api/v1/certis/cms/cases/update-case-status
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CMSController.cs`
- **Description**: PUT api/v1/certis/cms/cases/update-case-status

#### Parameters
- **body** (`UpdateCaseStatusCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/cms/core/staff

- **Method**: POST
- **Path**: api/v1/certis/cms/core/staff
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CoreControlle.cs`
- **Description**: POST api/v1/certis/cms/core/staff

#### Parameters
- **locationId** (`string`) - Required
- **body** (`CreateStaffCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/core/locations/{locationId}/staffs

- **Method**: GET
- **Path**: api/v1/certis/cms/core/locations/{locationId}/staffs
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CoreControlle.cs`
- **Description**: GET api/v1/certis/cms/core/locations/{locationId}/staffs

#### Parameters
- **locationId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/core/staffs/{staffCodeOrId}/functionroles

- **Method**: GET
- **Path**: api/v1/certis/cms/core/staffs/{staffCodeOrId}/functionroles
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CoreControlle.cs`
- **Description**: GET api/v1/certis/cms/core/staffs/{staffCodeOrId}/functionroles

#### Parameters
- **staffCodeOrId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/cms/core/staffs/functionroles

- **Method**: POST
- **Path**: api/v1/certis/cms/core/staffs/functionroles
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CoreControlle.cs`
- **Description**: POST api/v1/certis/cms/core/staffs/functionroles

#### Parameters
- **body** (`AddStaffRoleMappingCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/certis/cms/core/staff

- **Method**: PUT
- **Path**: api/v1/certis/cms/core/staff
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CoreControlle.cs`
- **Description**: PUT api/v1/certis/cms/core/staff

#### Parameters
- **body** (`UpdateStaffCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/certis/cms/core/staffs/functionroles

- **Method**: DELETE
- **Path**: api/v1/certis/cms/core/staffs/functionroles
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CoreControlle.cs`
- **Description**: DELETE api/v1/certis/cms/core/staffs/functionroles

#### Parameters
- **body** (`DeleteStaffRoleMappingCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/core/functionroles

- **Method**: GET
- **Path**: api/v1/certis/cms/core/functionroles
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CoreControlle.cs`
- **Description**: GET api/v1/certis/cms/core/functionroles

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/core/staffs/search

- **Method**: GET
- **Path**: api/v1/certis/cms/core/staffs/search
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CoreControlle.cs`
- **Description**: GET api/v1/certis/cms/core/staffs/search

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/CWO

- **Method**: POST
- **Path**: api/v1/certis/CWO/CWO
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/CWO

#### Parameters
- **body** (`CWORequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Assign/Supervisor

- **Method**: POST
- **Path**: api/v1/certis/CWO/Assign/Supervisor
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Assign/Supervisor

#### Parameters
- **body** (`AssignSupervisorRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Supervisor/Reject

- **Method**: POST
- **Path**: api/v1/certis/CWO/Supervisor/Reject
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Supervisor/Reject

#### Parameters
- **body** (`SupervisorRejectRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Assign/Technician

- **Method**: POST
- **Path**: api/v1/certis/CWO/Assign/Technician
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Assign/Technician

#### Parameters
- **body** (`AssignTechnicianRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Technician/Reject

- **Method**: POST
- **Path**: api/v1/certis/CWO/Technician/Reject
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Technician/Reject

#### Parameters
- **body** (`TechnicianRejectRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Acknowledge/Assignment

- **Method**: POST
- **Path**: api/v1/certis/CWO/Acknowledge/Assignment
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Acknowledge/Assignment

#### Parameters
- **body** (`AcknowledgeAssignmentRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Comment

- **Method**: POST
- **Path**: api/v1/certis/CWO/Comment
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Comment

#### Parameters
- **body** (`CommentRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Pause

- **Method**: POST
- **Path**: api/v1/certis/CWO/Pause
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Pause

#### Parameters
- **body** (`PauseRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Resume

- **Method**: POST
- **Path**: api/v1/certis/CWO/Resume
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Resume

#### Parameters
- **body** (`ResumeRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Work/Offline

- **Method**: POST
- **Path**: api/v1/certis/CWO/Work/Offline
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Work/Offline

#### Parameters
- **body** (`WorkOfflineRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Task/Update

- **Method**: POST
- **Path**: api/v1/certis/CWO/Task/Update
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Task/Update

#### Parameters
- **body** (`UpdateTaskRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Task/ConfirmCompletion

- **Method**: POST
- **Path**: api/v1/certis/CWO/Task/ConfirmCompletion
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Task/ConfirmCompletion

#### Parameters
- **body** (`ConfirmTaskCompletionRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Task/Complete

- **Method**: POST
- **Path**: api/v1/certis/CWO/Task/Complete
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Task/Complete

#### Parameters
- **body** (`CompleteRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Task/Rework

- **Method**: POST
- **Path**: api/v1/certis/CWO/Task/Rework
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Task/Rework

#### Parameters
- **body** (`ReworkRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/Task/Close

- **Method**: POST
- **Path**: api/v1/certis/CWO/Task/Close
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/Task/Close

#### Parameters
- **body** (`CloseRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/ClientVerify

- **Method**: POST
- **Path**: api/v1/certis/CWO/ClientVerify
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/ClientVerify

#### Parameters
- **body** (`ClientVerifyRequest`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/Comment

- **Method**: GET
- **Path**: api/v1/certis/CWO/Comment
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/Comment

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/Task

- **Method**: GET
- **Path**: api/v1/certis/CWO/Task
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/Task

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/CWOS

- **Method**: GET
- **Path**: api/v1/certis/CWO/CWOS
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/CWOS

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/SupportiveTeam/{id}

- **Method**: GET
- **Path**: api/v1/certis/CWO/SupportiveTeam/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/SupportiveTeam/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/Transactions/{id}

- **Method**: GET
- **Path**: api/v1/certis/CWO/Transactions/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/Transactions/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/CommentById/{id}

- **Method**: GET
- **Path**: api/v1/certis/CWO/CommentById/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/CommentById/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/Documents/{id}/Related

- **Method**: GET
- **Path**: api/v1/certis/CWO/Documents/{id}/Related
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/Documents/{id}/Related

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/CWO/cwoupdates

- **Method**: GET
- **Path**: api/v1/certis/CWO/cwoupdates
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: GET api/v1/certis/CWO/cwoupdates

#### Responses
- **200**: Success response

---

### POST api/v1/certis/CWO/CWOExternal

- **Method**: POST
- **Path**: api/v1/certis/CWO/CWOExternal
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/CorrectiveWorkOrderController.cs`
- **Description**: POST api/v1/certis/CWO/CWOExternal

#### Parameters
- **body** (`CreateCWOExternalCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/DMS

- **Method**: POST
- **Path**: api/v1/certis/DMS
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/DocumentManagementController.cs`
- **Description**: POST api/v1/certis/DMS

#### Responses
- **200**: Success response

---

### GET api/v1/certis/DMS/Documents/{objectType}/hidden

- **Method**: GET
- **Path**: api/v1/certis/DMS/Documents/{objectType}/hidden
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/DocumentManagementController.cs`
- **Description**: GET api/v1/certis/DMS/Documents/{objectType}/hidden

#### Parameters
- **objectType** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/DMS/Documents/{objectType}/{objectKey}/hidden

- **Method**: GET
- **Path**: api/v1/certis/DMS/Documents/{objectType}/{objectKey}/hidden
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/DocumentManagementController.cs`
- **Description**: GET api/v1/certis/DMS/Documents/{objectType}/{objectKey}/hidden

#### Parameters
- **objectType** (`string`) - Required
- **objectKey** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/DMS/Documents/{ot}/{ok}/defult

- **Method**: GET
- **Path**: api/v1/certis/DMS/Documents/{ot}/{ok}/defult
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/DocumentManagementController.cs`
- **Description**: GET api/v1/certis/DMS/Documents/{ot}/{ok}/defult

#### Parameters
- **ot** (`string`) - Required
- **ok** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/DMS/Documents/{ot}/{ok}

- **Method**: GET
- **Path**: api/v1/certis/DMS/Documents/{ot}/{ok}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/DocumentManagementController.cs`
- **Description**: GET api/v1/certis/DMS/Documents/{ot}/{ok}

#### Parameters
- **ot** (`string`) - Required
- **ok** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/DMS/Documents/image/{id}

- **Method**: GET
- **Path**: api/v1/certis/DMS/Documents/image/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/DocumentManagementController.cs`
- **Description**: GET api/v1/certis/DMS/Documents/image/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/DMS/Documents/detail/{id}

- **Method**: GET
- **Path**: api/v1/certis/DMS/Documents/detail/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/DocumentManagementController.cs`
- **Description**: GET api/v1/certis/DMS/Documents/detail/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/ifm/cwosbyincidentId/{id}

- **Method**: GET
- **Path**: api/v1/certis/ifm/cwosbyincidentId/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/IFMControlle.cs`
- **Description**: GET api/v1/certis/ifm/cwosbyincidentId/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/WorkOrder/Create

- **Method**: POST
- **Path**: api/v1/certis/PPM/WorkOrder/Create
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/WorkOrder/Create

#### Parameters
- **body** (`PPMWORequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Assign/Supervisor

- **Method**: POST
- **Path**: api/v1/certis/PPM/Assign/Supervisor
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Assign/Supervisor

#### Parameters
- **body** (`AssignSupervisorRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Assign/Technician

- **Method**: POST
- **Path**: api/v1/certis/PPM/Assign/Technician
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Assign/Technician

#### Parameters
- **body** (`AssignTechnicianRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Supervisor/Reject

- **Method**: POST
- **Path**: api/v1/certis/PPM/Supervisor/Reject
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Supervisor/Reject

#### Parameters
- **body** (`SupervisorRejectRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Technician/Reject

- **Method**: POST
- **Path**: api/v1/certis/PPM/Technician/Reject
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Technician/Reject

#### Parameters
- **body** (`TechnicianRejectRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Technician/Acknowldge

- **Method**: POST
- **Path**: api/v1/certis/PPM/Technician/Acknowldge
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Technician/Acknowldge

#### Parameters
- **body** (`AcknowledgeAssignmentRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Comment

- **Method**: POST
- **Path**: api/v1/certis/PPM/Comment
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Comment

#### Parameters
- **body** (`CommentRequest`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/Task/{workOrderId}

- **Method**: GET
- **Path**: api/v1/certis/PPM/Task/{workOrderId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/Task/{workOrderId}

#### Parameters
- **workOrderId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/ServicingObject/{workOrderId}

- **Method**: GET
- **Path**: api/v1/certis/PPM/ServicingObject/{workOrderId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/ServicingObject/{workOrderId}

#### Parameters
- **workOrderId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Task/Update

- **Method**: POST
- **Path**: api/v1/certis/PPM/Task/Update
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Task/Update

#### Parameters
- **body** (`UpdateTaskRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Task/ConfirmCompletion

- **Method**: POST
- **Path**: api/v1/certis/PPM/Task/ConfirmCompletion
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Task/ConfirmCompletion

#### Parameters
- **body** (`ConfirmTaskCompletionRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Task/Complete

- **Method**: POST
- **Path**: api/v1/certis/PPM/Task/Complete
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Task/Complete

#### Parameters
- **body** (`CompleteRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Task/Rework

- **Method**: POST
- **Path**: api/v1/certis/PPM/Task/Rework
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Task/Rework

#### Parameters
- **body** (`ReworkRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/ClientVerify

- **Method**: POST
- **Path**: api/v1/certis/PPM/ClientVerify
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/ClientVerify

#### Parameters
- **body** (`ClientVerifyRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/PPM/Task/Close

- **Method**: POST
- **Path**: api/v1/certis/PPM/Task/Close
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: POST api/v1/certis/PPM/Task/Close

#### Parameters
- **body** (`CloseRequest`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/PPMWOS

- **Method**: GET
- **Path**: api/v1/certis/PPM/PPMWOS
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/PPMWOS

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/PPMMWOS

- **Method**: GET
- **Path**: api/v1/certis/PPM/PPMMWOS
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/PPMMWOS

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/CheckListMaps

- **Method**: GET
- **Path**: api/v1/certis/PPM/CheckListMaps
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/CheckListMaps

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/Technicians/{id}

- **Method**: GET
- **Path**: api/v1/certis/PPM/Technicians/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/Technicians/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/Comments/{woid}

- **Method**: GET
- **Path**: api/v1/certis/PPM/Comments/{woid}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/Comments/{woid}

#### Parameters
- **woid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/Transactions/{woid}

- **Method**: GET
- **Path**: api/v1/certis/PPM/Transactions/{woid}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/Transactions/{woid}

#### Parameters
- **woid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/Documents/{id}/Related

- **Method**: GET
- **Path**: api/v1/certis/PPM/Documents/{id}/Related
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/Documents/{id}/Related

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/PPM/ppmupdates

- **Method**: GET
- **Path**: api/v1/certis/PPM/ppmupdates
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/PlanAndPreventiveMaintenanceController.cs`
- **Description**: GET api/v1/certis/PPM/ppmupdates

#### Responses
- **200**: Success response

---

### POST api/v1/certis/cms/wfm/staff/clockin

- **Method**: POST
- **Path**: api/v1/certis/cms/wfm/staff/clockin
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/WFMControlle.cs`
- **Description**: POST api/v1/certis/cms/wfm/staff/clockin

#### Parameters
- **body** (`StaffClockInCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/certis/cms/wfm/staff/clockout

- **Method**: POST
- **Path**: api/v1/certis/cms/wfm/staff/clockout
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/WFMControlle.cs`
- **Description**: POST api/v1/certis/cms/wfm/staff/clockout

#### Parameters
- **body** (`StaffClockOutCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/certis/cms/wfm/dutyshifts/schedules

- **Method**: GET
- **Path**: api/v1/certis/cms/wfm/dutyshifts/schedules
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Certis/Transaction/WFMControlle.cs`
- **Description**: GET api/v1/certis/cms/wfm/dutyshifts/schedules

#### Parameters
- **body** (`DutyShiftsQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/customer/kc/login

- **Method**: POST
- **Path**: api/v1/customer/kc/login
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Customer/CustomerKeycloakController.cs`
- **Description**: POST api/v1/customer/kc/login

#### Parameters
- **request** (`LoginRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/customer/kc/logout

- **Method**: POST
- **Path**: api/v1/customer/kc/logout
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Customer/CustomerKeycloakController.cs`
- **Description**: POST api/v1/customer/kc/logout

#### Parameters
- **request** (`LogoutRequest`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/customer/kc/user

- **Method**: GET
- **Path**: api/v1/customer/kc/user
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Customer/CustomerKeycloakController.cs`
- **Description**: GET api/v1/customer/kc/user

#### Responses
- **200**: Success response

---

### POST api/v1/customer/kc/user

- **Method**: POST
- **Path**: api/v1/customer/kc/user
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Customer/CustomerKeycloakController.cs`
- **Description**: POST api/v1/customer/kc/user

#### Parameters
- **request** (`CreateUserRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/customer/kc/authalias

- **Method**: POST
- **Path**: api/v1/customer/kc/authalias
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Customer/CustomerKeycloakController.cs`
- **Description**: POST api/v1/customer/kc/authalias

#### Parameters
- **request** (`AddAuthAliasRequest`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/customer/kc/authalias

- **Method**: DELETE
- **Path**: api/v1/customer/kc/authalias
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Customer/CustomerKeycloakController.cs`
- **Description**: DELETE api/v1/customer/kc/authalias

#### Parameters
- **request** (`RemoveAuthAliasRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/customer/kc/password/reset

- **Method**: POST
- **Path**: api/v1/customer/kc/password/reset
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Customer/CustomerKeycloakController.cs`
- **Description**: POST api/v1/customer/kc/password/reset

#### Parameters
- **request** (`ResetPasswordRequest`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/customer/kc/password

- **Method**: PUT
- **Path**: api/v1/customer/kc/password
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Customer/CustomerKeycloakController.cs`
- **Description**: PUT api/v1/customer/kc/password

#### Parameters
- **request** (`UpdatePasswordRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/EV/account/register

- **Method**: POST
- **Path**: api/v1/EV/account/register
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/account/register

#### Parameters
- **body** (`RegisterCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/EV/account/authorize

- **Method**: POST
- **Path**: api/v1/EV/account/authorize
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/account/authorize

#### Parameters
- **body** (`AuthorizeCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/EV/account/signout

- **Method**: POST
- **Path**: api/v1/EV/account/signout
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/account/signout

#### Parameters
- **body** (`SignOutCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/EV/place/{uuid}

- **Method**: GET
- **Path**: api/v1/EV/place/{uuid}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/place/{uuid}

#### Parameters
- **uuid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/EV/places

- **Method**: GET
- **Path**: api/v1/EV/places
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/places

#### Responses
- **200**: Success response

---

### POST api/v1/EV/sessionInit

- **Method**: POST
- **Path**: api/v1/EV/sessionInit
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/sessionInit

#### Parameters
- **body** (`SessionInitCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/EV/sessionStart

- **Method**: POST
- **Path**: api/v1/EV/sessionStart
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/sessionStart

#### Parameters
- **body** (`SessionStartCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/EV/sessionStop

- **Method**: POST
- **Path**: api/v1/EV/sessionStop
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/sessionStop

#### Parameters
- **body** (`SessionStopCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/EV/sessions

- **Method**: GET
- **Path**: api/v1/EV/sessions
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/sessions

#### Responses
- **200**: Success response

---

### GET api/v1/EV/session/{uuid}

- **Method**: GET
- **Path**: api/v1/EV/session/{uuid}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/session/{uuid}

#### Parameters
- **uuid** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/EV/sessionAccess

- **Method**: POST
- **Path**: api/v1/EV/sessionAccess
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/sessionAccess

#### Parameters
- **body** (`SessionAccessCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/EV/reserve

- **Method**: POST
- **Path**: api/v1/EV/reserve
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/reserve

#### Parameters
- **body** (`ReserveCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/EV/reserve/{uuid}

- **Method**: GET
- **Path**: api/v1/EV/reserve/{uuid}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/reserve/{uuid}

#### Parameters
- **uuid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/EV/reserves

- **Method**: GET
- **Path**: api/v1/EV/reserves
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/reserves

#### Responses
- **200**: Success response

---

### POST api/v1/EV/reserveCancel

- **Method**: POST
- **Path**: api/v1/EV/reserveCancel
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/reserveCancel

#### Parameters
- **body** (`ReserveCancelCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/EV/reserveCheck

- **Method**: POST
- **Path**: api/v1/EV/reserveCheck
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/reserveCheck

#### Parameters
- **body** (`ReserveCheckCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/EV/invoice/{uuid}

- **Method**: GET
- **Path**: api/v1/EV/invoice/{uuid}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/invoice/{uuid}

#### Parameters
- **uuid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/EV/invoices

- **Method**: GET
- **Path**: api/v1/EV/invoices
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/invoices

#### Responses
- **200**: Success response

---

### GET api/v1/EV/receipt/{uuid}

- **Method**: GET
- **Path**: api/v1/EV/receipt/{uuid}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/receipt/{uuid}

#### Parameters
- **uuid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/EV/receipts

- **Method**: GET
- **Path**: api/v1/EV/receipts
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/receipts

#### Responses
- **200**: Success response

---

### POST api/v1/EV/checkoutInvoice

- **Method**: POST
- **Path**: api/v1/EV/checkoutInvoice
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/checkoutInvoice

#### Parameters
- **body** (`CheckoutInvoiceCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/EV/cancelInvoice

- **Method**: POST
- **Path**: api/v1/EV/cancelInvoice
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/cancelInvoice

#### Parameters
- **body** (`CancelInvoiceCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/EV/receiptRefund

- **Method**: POST
- **Path**: api/v1/EV/receiptRefund
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: POST api/v1/EV/receiptRefund

#### Parameters
- **body** (`ReceiptRefundCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/EV/place/{place}/building/{building}

- **Method**: GET
- **Path**: api/v1/EV/place/{place}/building/{building}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/place/{place}/building/{building}

#### Parameters
- **place** (`string`) - Required
- **building** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/EV/account/me

- **Method**: GET
- **Path**: api/v1/EV/account/me
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/EV/EVController.cs`
- **Description**: GET api/v1/EV/account/me

#### Responses
- **200**: Success response

---

### GET api/v1/Facility/Management

- **Method**: GET
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/FeedbackController.cs`
- **Description**: GET api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### GET api/v1/Facility/Management

- **Method**: GET
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/FeedbackController.cs`
- **Description**: GET api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### POST api/v1/Facility/Management

- **Method**: POST
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/FeedbackController.cs`
- **Description**: POST api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### GET api/v1/Facility/Management

- **Method**: GET
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/IncidentController.cs`
- **Description**: GET api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### GET api/v1/Facility/Management

- **Method**: GET
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/IncidentController.cs`
- **Description**: GET api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### POST api/v1/Facility/Management

- **Method**: POST
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/IncidentController.cs`
- **Description**: POST api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### GET api/v1/Facility/Management

- **Method**: GET
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/WorkOrderController.cs`
- **Description**: GET api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### GET api/v1/Facility/Management

- **Method**: GET
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/WorkOrderController.cs`
- **Description**: GET api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### POST api/v1/Facility/Management

- **Method**: POST
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/WorkOrderController.cs`
- **Description**: POST api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### GET api/v1/Facility/Management

- **Method**: GET
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/WorkRequestController.cs`
- **Description**: GET api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### GET api/v1/Facility/Management

- **Method**: GET
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/WorkRequestController.cs`
- **Description**: GET api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### POST api/v1/Facility/Management

- **Method**: POST
- **Path**: api/v1/Facility/Management
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Facility/Management/WorkRequestController.cs`
- **Description**: POST api/v1/Facility/Management

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/login/login

- **Method**: POST
- **Path**: api/v1/fineday/iviva/login/login
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/LoginController.cs`
- **Description**: POST api/v1/fineday/iviva/login/login

#### Parameters
- **request** (`LoginCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/login/logout

- **Method**: POST
- **Path**: api/v1/fineday/iviva/login/logout
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/LoginController.cs`
- **Description**: POST api/v1/fineday/iviva/login/logout

#### Parameters
- **request** (`LogoutCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/login/checktoken

- **Method**: POST
- **Path**: api/v1/fineday/iviva/login/checktoken
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/LoginController.cs`
- **Description**: POST api/v1/fineday/iviva/login/checktoken

#### Parameters
- **request** (`CheckTokenCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/login/forcelogout

- **Method**: POST
- **Path**: api/v1/fineday/iviva/login/forcelogout
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/LoginController.cs`
- **Description**: POST api/v1/fineday/iviva/login/forcelogout

#### Parameters
- **request** (`ForceLogoutCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/iviva/login/testconnection

- **Method**: GET
- **Path**: api/v1/fineday/iviva/login/testconnection
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/LoginController.cs`
- **Description**: GET api/v1/fineday/iviva/login/testconnection

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/member/GetDataMember

- **Method**: POST
- **Path**: api/v1/fineday/iviva/member/GetDataMember
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/MemberController.cs`
- **Description**: POST api/v1/fineday/iviva/member/GetDataMember

#### Parameters
- **request** (`GetDataMemberQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/member/GetDataMemberCarPark

- **Method**: POST
- **Path**: api/v1/fineday/iviva/member/GetDataMemberCarPark
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/MemberController.cs`
- **Description**: POST api/v1/fineday/iviva/member/GetDataMemberCarPark

#### Parameters
- **request** (`GetDataMemberCarParkQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/tenant/GetDataTenant

- **Method**: POST
- **Path**: api/v1/fineday/iviva/tenant/GetDataTenant
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/TenantController.cs`
- **Description**: POST api/v1/fineday/iviva/tenant/GetDataTenant

#### Parameters
- **request** (`GetDataTenantQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/transaction/GetDataTransactionCarpark

- **Method**: POST
- **Path**: api/v1/fineday/iviva/transaction/GetDataTransactionCarpark
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/TransactionController.cs`
- **Description**: POST api/v1/fineday/iviva/transaction/GetDataTransactionCarpark

#### Parameters
- **request** (`GetDataTransactionCarparkQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/transaction/GetDataTransactionMember

- **Method**: POST
- **Path**: api/v1/fineday/iviva/transaction/GetDataTransactionMember
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/TransactionController.cs`
- **Description**: POST api/v1/fineday/iviva/transaction/GetDataTransactionMember

#### Parameters
- **request** (`GetDataTransactionMemberQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/transaction/GetDataTransactionVisitor

- **Method**: POST
- **Path**: api/v1/fineday/iviva/transaction/GetDataTransactionVisitor
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/TransactionController.cs`
- **Description**: POST api/v1/fineday/iviva/transaction/GetDataTransactionVisitor

#### Parameters
- **request** (`GetDataTransactionVisitorQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/iviva/transaction/GetDataTransactionTurnstile

- **Method**: POST
- **Path**: api/v1/fineday/iviva/transaction/GetDataTransactionTurnstile
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayIviva/TransactionController.cs`
- **Description**: POST api/v1/fineday/iviva/transaction/GetDataTransactionTurnstile

#### Parameters
- **request** (`GetDataTransactionTurnstileQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/authorizefloor/ChangeDefaultFloor

- **Method**: POST
- **Path**: api/v1/fineday/authorizefloor/ChangeDefaultFloor
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/AuthorizeFloorController.cs`
- **Description**: POST api/v1/fineday/authorizefloor/ChangeDefaultFloor

#### Parameters
- **request** (`ChangeDefaultFloorCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/authorizefloor/GetResidenceLocationMapping

- **Method**: POST
- **Path**: api/v1/fineday/authorizefloor/GetResidenceLocationMapping
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/AuthorizeFloorController.cs`
- **Description**: POST api/v1/fineday/authorizefloor/GetResidenceLocationMapping

#### Parameters
- **request** (`GetResidenceLocationMappingQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/authorizefloor/GetQueueCallLift

- **Method**: POST
- **Path**: api/v1/fineday/authorizefloor/GetQueueCallLift
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/AuthorizeFloorController.cs`
- **Description**: POST api/v1/fineday/authorizefloor/GetQueueCallLift

#### Parameters
- **request** (`GetQueueCallLiftCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/authorizefloor/CheckQueueLift

- **Method**: POST
- **Path**: api/v1/fineday/authorizefloor/CheckQueueLift
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/AuthorizeFloorController.cs`
- **Description**: POST api/v1/fineday/authorizefloor/CheckQueueLift

#### Parameters
- **request** (`CheckQueueLiftCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/booking/reservation/search/query

- **Method**: GET
- **Path**: api/v1/fineday/booking/reservation/search/query
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: GET api/v1/fineday/booking/reservation/search/query

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/booking/reservation/getReservationByID/{id}

- **Method**: GET
- **Path**: api/v1/fineday/booking/reservation/getReservationByID/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: GET api/v1/fineday/booking/reservation/getReservationByID/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/booking/reservation/create

- **Method**: POST
- **Path**: api/v1/fineday/booking/reservation/create
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: POST api/v1/fineday/booking/reservation/create

#### Parameters
- **request** (`ReservationCreateCommand`) - Required

#### Responses
- **200**: Success response

---

### PATCH api/v1/fineday/booking/reservation/update

- **Method**: PATCH
- **Path**: api/v1/fineday/booking/reservation/update
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: PATCH api/v1/fineday/booking/reservation/update

#### Parameters
- **request** (`ReservationUpdateCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/booking/reservation/getFacilities

- **Method**: GET
- **Path**: api/v1/fineday/booking/reservation/getFacilities
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: GET api/v1/fineday/booking/reservation/getFacilities

#### Parameters
- **page** (`string`) - Optional
- **limit** (`string`) - Optional
- **types** (`string`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/booking/reservation/facilities

- **Method**: GET
- **Path**: api/v1/fineday/booking/reservation/facilities
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: GET api/v1/fineday/booking/reservation/facilities

#### Parameters
- **page** (`string`) - Optional
- **limit** (`string`) - Optional
- **types** (`string`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/booking/reservation/facilities/create

- **Method**: POST
- **Path**: api/v1/fineday/booking/reservation/facilities/create
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: POST api/v1/fineday/booking/reservation/facilities/create

#### Parameters
- **request** (`ReservationFacilitiesCreateCommand`) - Required

#### Responses
- **200**: Success response

---

### PATCH api/v1/fineday/booking/reservation/facilities/update

- **Method**: PATCH
- **Path**: api/v1/fineday/booking/reservation/facilities/update
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: PATCH api/v1/fineday/booking/reservation/facilities/update

#### Parameters
- **request** (`ReservationFacilitiesUpdateCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/booking/reservation/search/facilities

- **Method**: GET
- **Path**: api/v1/fineday/booking/reservation/search/facilities
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: GET api/v1/fineday/booking/reservation/search/facilities

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/booking/reservation/search/facilities/count

- **Method**: GET
- **Path**: api/v1/fineday/booking/reservation/search/facilities/count
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: GET api/v1/fineday/booking/reservation/search/facilities/count

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/booking/reservation/facilities/{id}

- **Method**: GET
- **Path**: api/v1/fineday/booking/reservation/facilities/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/BookingController.cs`
- **Description**: GET api/v1/fineday/booking/reservation/facilities/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/card/GetCardsAccessGroups

- **Method**: GET
- **Path**: api/v1/fineday/card/GetCardsAccessGroups
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/CardController.cs`
- **Description**: GET api/v1/fineday/card/GetCardsAccessGroups

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/card/CancelCardResidenceByCardNumber

- **Method**: POST
- **Path**: api/v1/fineday/card/CancelCardResidenceByCardNumber
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/CardController.cs`
- **Description**: POST api/v1/fineday/card/CancelCardResidenceByCardNumber

#### Parameters
- **reques** (`CancelCardResidenceByCardNumberCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/card/GetDataResidenceCardByPersonId

- **Method**: POST
- **Path**: api/v1/fineday/card/GetDataResidenceCardByPersonId
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/CardController.cs`
- **Description**: POST api/v1/fineday/card/GetDataResidenceCardByPersonId

#### Parameters
- **requ** (`GetDataResidenceCardByPersonIdCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/carpark/GetParkingDetailByQRCode

- **Method**: POST
- **Path**: api/v1/fineday/carpark/GetParkingDetailByQRCode
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/CarparkController.cs`
- **Description**: POST api/v1/fineday/carpark/GetParkingDetailByQRCode

#### Parameters
- **request** (`GetParkingDetailByQRCodeQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/carpark/GetParkingDetail

- **Method**: POST
- **Path**: api/v1/fineday/carpark/GetParkingDetail
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/CarparkController.cs`
- **Description**: POST api/v1/fineday/carpark/GetParkingDetail

#### Parameters
- **request** (`GetParkingDetailQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/carpark/GetParkingDetailByPersonId

- **Method**: POST
- **Path**: api/v1/fineday/carpark/GetParkingDetailByPersonId
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/CarparkController.cs`
- **Description**: POST api/v1/fineday/carpark/GetParkingDetailByPersonId

#### Parameters
- **request** (`GetParkingDetailByPersonIdQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/preregister/InviteResidenceVisitor

- **Method**: POST
- **Path**: api/v1/fineday/preregister/InviteResidenceVisitor
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/PreRegisterController.cs`
- **Description**: POST api/v1/fineday/preregister/InviteResidenceVisitor

#### Parameters
- **request** (`InviteResidenceVisitorCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/preregister/CancelInviteResidenceVisitor

- **Method**: POST
- **Path**: api/v1/fineday/preregister/CancelInviteResidenceVisitor
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/PreRegisterController.cs`
- **Description**: POST api/v1/fineday/preregister/CancelInviteResidenceVisitor

#### Parameters
- **request** (`CancelInviteResidenceVisitorCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/preregister/GetDataInviteVisitorTransaction

- **Method**: POST
- **Path**: api/v1/fineday/preregister/GetDataInviteVisitorTransaction
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/PreRegisterController.cs`
- **Description**: POST api/v1/fineday/preregister/GetDataInviteVisitorTransaction

#### Parameters
- **request** (`GetDataInviteVisitorTransactionQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/preregister/SetApproveInviteResidenceVisitor

- **Method**: POST
- **Path**: api/v1/fineday/preregister/SetApproveInviteResidenceVisitor
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/PreRegisterController.cs`
- **Description**: POST api/v1/fineday/preregister/SetApproveInviteResidenceVisitor

#### Parameters
- **request** (`SetApproveInviteResidenceVisitorCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/preregister/CheckPreRegisterIsPass

- **Method**: POST
- **Path**: api/v1/fineday/preregister/CheckPreRegisterIsPass
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/PreRegisterController.cs`
- **Description**: POST api/v1/fineday/preregister/CheckPreRegisterIsPass

#### Parameters
- **request** (`CheckPreRegisterIsPassCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/redemtion/RedeemParking

- **Method**: POST
- **Path**: api/v1/fineday/redemtion/RedeemParking
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/RedemptionController.cs`
- **Description**: POST api/v1/fineday/redemtion/RedeemParking

#### Parameters
- **request** (`RedeemParkingCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/redemtion/GetRateCodeListByTenantID

- **Method**: POST
- **Path**: api/v1/fineday/redemtion/GetRateCodeListByTenantID
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/RedemptionController.cs`
- **Description**: POST api/v1/fineday/redemtion/GetRateCodeListByTenantID

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/redemtion/GetDataDepartment

- **Method**: GET
- **Path**: api/v1/fineday/redemtion/GetDataDepartment
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/RedemptionController.cs`
- **Description**: GET api/v1/fineday/redemtion/GetDataDepartment

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/redemtion/GetDataMemberType

- **Method**: GET
- **Path**: api/v1/fineday/redemtion/GetDataMemberType
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/RedemptionController.cs`
- **Description**: GET api/v1/fineday/redemtion/GetDataMemberType

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/redemtion/GetDataTerminal

- **Method**: GET
- **Path**: api/v1/fineday/redemtion/GetDataTerminal
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/RedemptionController.cs`
- **Description**: GET api/v1/fineday/redemtion/GetDataTerminal

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/redemtion/GetDataVehicleType

- **Method**: GET
- **Path**: api/v1/fineday/redemtion/GetDataVehicleType
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/RedemptionController.cs`
- **Description**: GET api/v1/fineday/redemtion/GetDataVehicleType

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/redemtion/CheckRedemptionStatusByEmail

- **Method**: POST
- **Path**: api/v1/fineday/redemtion/CheckRedemptionStatusByEmail
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/RedemptionController.cs`
- **Description**: POST api/v1/fineday/redemtion/CheckRedemptionStatusByEmail

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/residence/AddResidence

- **Method**: POST
- **Path**: api/v1/fineday/residence/AddResidence
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/ResidenceController.cs`
- **Description**: POST api/v1/fineday/residence/AddResidence

#### Parameters
- **request** (`AddResidenceCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/residence/AddResidenceMember

- **Method**: POST
- **Path**: api/v1/fineday/residence/AddResidenceMember
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/ResidenceController.cs`
- **Description**: POST api/v1/fineday/residence/AddResidenceMember

#### Parameters
- **request** (`AddResidenceMemberCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/residence/CheckFrontalFaceImage

- **Method**: POST
- **Path**: api/v1/fineday/residence/CheckFrontalFaceImage
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/ResidenceController.cs`
- **Description**: POST api/v1/fineday/residence/CheckFrontalFaceImage

#### Parameters
- **request** (`CheckFrontalFaceImageCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/residence/UpdateResidenceMember

- **Method**: POST
- **Path**: api/v1/fineday/residence/UpdateResidenceMember
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/ResidenceController.cs`
- **Description**: POST api/v1/fineday/residence/UpdateResidenceMember

#### Parameters
- **request** (`UpdateResidenceMemberCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/residence/GetDataResidenceMember

- **Method**: POST
- **Path**: api/v1/fineday/residence/GetDataResidenceMember
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/ResidenceController.cs`
- **Description**: POST api/v1/fineday/residence/GetDataResidenceMember

#### Parameters
- **request** (`GetDataResidenceMemberCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/residence/CheckStatusMember

- **Method**: POST
- **Path**: api/v1/fineday/residence/CheckStatusMember
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/ResidenceController.cs`
- **Description**: POST api/v1/fineday/residence/CheckStatusMember

#### Parameters
- **request** (`CheckStatusMemberCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/residence/GetDetailResidenceMemberByPersonID

- **Method**: POST
- **Path**: api/v1/fineday/residence/GetDetailResidenceMemberByPersonID
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/ResidenceController.cs`
- **Description**: POST api/v1/fineday/residence/GetDetailResidenceMemberByPersonID

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/residence/InactiveResidenceByResidenceID

- **Method**: POST
- **Path**: api/v1/fineday/residence/InactiveResidenceByResidenceID
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/ResidenceController.cs`
- **Description**: POST api/v1/fineday/residence/InactiveResidenceByResidenceID

#### Parameters
- **request** (`InactiveResidenceByResidenceIDCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/fineday/residence/GetDataResidenceAuthorizeFloorMaster

- **Method**: POST
- **Path**: api/v1/fineday/residence/GetDataResidenceAuthorizeFloorMaster
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/ResidenceController.cs`
- **Description**: POST api/v1/fineday/residence/GetDataResidenceAuthorizeFloorMaster

#### Responses
- **200**: Success response

---

### GET api/v1/fineday/residence/GetMasServiceType

- **Method**: GET
- **Path**: api/v1/fineday/residence/GetMasServiceType
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/FinedayResidence/ResidenceController.cs`
- **Description**: GET api/v1/fineday/residence/GetMasServiceType

#### Responses
- **200**: Success response

---

### POST api/v1/innoflex/attendance/log

- **Method**: POST
- **Path**: api/v1/innoflex/attendance/log
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Innoflex/InnoflexController.cs`
- **Description**: POST api/v1/innoflex/attendance/log

#### Parameters
- **body** (`AttendanceLogQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/innoflex/onboard/residence

- **Method**: POST
- **Path**: api/v1/innoflex/onboard/residence
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Innoflex/InnoflexController.cs`
- **Description**: POST api/v1/innoflex/onboard/residence

#### Parameters
- **body** (`OnboardResidenceCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/innoflex/onboard/residence/revokeAccess

- **Method**: POST
- **Path**: api/v1/innoflex/onboard/residence/revokeAccess
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Innoflex/InnoflexController.cs`
- **Description**: POST api/v1/innoflex/onboard/residence/revokeAccess

#### Parameters
- **body** (`RevokeAccessCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/lbs/position/AP

- **Method**: GET
- **Path**: api/v1/lbs/position/AP
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/LBS/IndoorPositioningController.cs`
- **Description**: GET api/v1/lbs/position/AP

#### Responses
- **200**: Success response

---

### POST api/v1/lbs/position/sensing

- **Method**: POST
- **Path**: api/v1/lbs/position/sensing
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/LBS/IndoorPositioningController.cs`
- **Description**: POST api/v1/lbs/position/sensing

#### Parameters
- **request** (`SaveSensingCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/lbs/position/query

- **Method**: POST
- **Path**: api/v1/lbs/position/query
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/LBS/IndoorPositioningController.cs`
- **Description**: POST api/v1/lbs/position/query

#### Parameters
- **request** (`QueryPositionQuery`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/mt/parking/spaceNo

- **Method**: POST
- **Path**: api/v1/mt/parking/spaceNo
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: POST api/v1/mt/parking/spaceNo

#### Parameters
- **request** (`GetParkingSpaceCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/mt/parking/trafficStatusRecord

- **Method**: POST
- **Path**: api/v1/mt/parking/trafficStatusRecord
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: POST api/v1/mt/parking/trafficStatusRecord

#### Parameters
- **request** (`GetTrafficStatusRecordCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/mt/parking/query

- **Method**: POST
- **Path**: api/v1/mt/parking/query
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: POST api/v1/mt/parking/query

#### Parameters
- **request** (`GetParkingQueryCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/mt/parking/valetParking/{uid}

- **Method**: GET
- **Path**: api/v1/mt/parking/valetParking/{uid}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: GET api/v1/mt/parking/valetParking/{uid}

#### Parameters
- **uid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/mt/parking/valetParkingStations

- **Method**: GET
- **Path**: api/v1/mt/parking/valetParkingStations
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: GET api/v1/mt/parking/valetParkingStations

#### Responses
- **200**: Success response

---

### PATCH api/v1/mt/parking/callValetCar

- **Method**: PATCH
- **Path**: api/v1/mt/parking/callValetCar
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: PATCH api/v1/mt/parking/callValetCar

#### Parameters
- **request** (`PatchCallMyValetCarCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/mt/parking/getParkingDetailByPersonId

- **Method**: POST
- **Path**: api/v1/mt/parking/getParkingDetailByPersonId
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: POST api/v1/mt/parking/getParkingDetailByPersonId

#### Parameters
- **request** (`GetParkingDetailByPersonIdCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/mt/parking/pmsCarBlocker

- **Method**: POST
- **Path**: api/v1/mt/parking/pmsCarBlocker
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: POST api/v1/mt/parking/pmsCarBlocker

#### Responses
- **200**: Success response

---

### POST api/v1/mt/parking/pmsCarBlocker/byDeviceId

- **Method**: POST
- **Path**: api/v1/mt/parking/pmsCarBlocker/byDeviceId
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: POST api/v1/mt/parking/pmsCarBlocker/byDeviceId

#### Parameters
- **request** (`PmsCarBlockerCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/mt/parking/carpark/updateTransaction

- **Method**: POST
- **Path**: api/v1/mt/parking/carpark/updateTransaction
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: POST api/v1/mt/parking/carpark/updateTransaction

#### Parameters
- **request** (`UpdateTransactionCarparkCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/mt/parking/carpark/entCarpark

- **Method**: POST
- **Path**: api/v1/mt/parking/carpark/entCarpark
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: POST api/v1/mt/parking/carpark/entCarpark

#### Parameters
- **request** (`EntCarparkCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/mt/parking/carpark/extCarpark

- **Method**: POST
- **Path**: api/v1/mt/parking/carpark/extCarpark
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/MT/ParkingController.cs`
- **Description**: POST api/v1/mt/parking/carpark/extCarpark

#### Parameters
- **request** (`ExtCarparkCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/netatmo/home/data/{homeId}

- **Method**: GET
- **Path**: api/v1/netatmo/home/data/{homeId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: GET api/v1/netatmo/home/data/{homeId}

#### Parameters
- **homeId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/netatmo/home/status/{homeId}

- **Method**: GET
- **Path**: api/v1/netatmo/home/status/{homeId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: GET api/v1/netatmo/home/status/{homeId}

#### Parameters
- **homeId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/netatmo/scenarios/{homeId}

- **Method**: GET
- **Path**: api/v1/netatmo/scenarios/{homeId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: GET api/v1/netatmo/scenarios/{homeId}

#### Parameters
- **homeId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/netatmo/home/schedule/create

- **Method**: POST
- **Path**: api/v1/netatmo/home/schedule/create
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: POST api/v1/netatmo/home/schedule/create

#### Parameters
- **body** (`CreateNewHomeScheduleCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/netatmo/home/schedule/switch

- **Method**: POST
- **Path**: api/v1/netatmo/home/schedule/switch
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: POST api/v1/netatmo/home/schedule/switch

#### Parameters
- **body** (`SwitchHomeScheduleRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/netatmo/home/setstate

- **Method**: POST
- **Path**: api/v1/netatmo/home/setstate
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: POST api/v1/netatmo/home/setstate

#### Parameters
- **homeId** (`string`) - Required
- **body** (`SetStateCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/netatmo/homes/data/all/{homeId}

- **Method**: GET
- **Path**: api/v1/netatmo/homes/data/all/{homeId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: GET api/v1/netatmo/homes/data/all/{homeId}

#### Parameters
- **homeId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/netatmo/synchomeschedule

- **Method**: POST
- **Path**: api/v1/netatmo/synchomeschedule
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: POST api/v1/netatmo/synchomeschedule

#### Parameters
- **body** (`SynchomeScheduleCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/netatmo/home/{homeId}/schedule/{scheduleId}

- **Method**: GET
- **Path**: api/v1/netatmo/home/{homeId}/schedule/{scheduleId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: GET api/v1/netatmo/home/{homeId}/schedule/{scheduleId}

#### Parameters
- **homeId** (`string`) - Required
- **scheduleId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/netatmo/home/schedule/validate

- **Method**: POST
- **Path**: api/v1/netatmo/home/schedule/validate
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: POST api/v1/netatmo/home/schedule/validate

#### Parameters
- **body** (`ValidateNewHomeScheduleCoolingCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/netatmo/get-user-token

- **Method**: GET
- **Path**: api/v1/netatmo/get-user-token
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: GET api/v1/netatmo/get-user-token

#### Responses
- **200**: Success response

---

### POST api/v1/netatmo/upsert-user-token

- **Method**: POST
- **Path**: api/v1/netatmo/upsert-user-token
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: POST api/v1/netatmo/upsert-user-token

#### Parameters
- **body** (`UpsertUserTokenCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/netatmo/update-status-sync

- **Method**: POST
- **Path**: api/v1/netatmo/update-status-sync
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: POST api/v1/netatmo/update-status-sync

#### Parameters
- **body** (`UpdateStatusSyncCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/netatmo/sync-home

- **Method**: POST
- **Path**: api/v1/netatmo/sync-home
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Netatmo/NetatmoController.cs`
- **Description**: POST api/v1/netatmo/sync-home

#### Parameters
- **body** (`SyncHomeCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Notification

- **Method**: POST
- **Path**: api/v1/Notification
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Notification/NotificationController.cs`
- **Description**: POST api/v1/Notification

#### Responses
- **200**: Success response

---

### POST api/v1/operation/kc/login

- **Method**: POST
- **Path**: api/v1/operation/kc/login
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Operation/OperationKeycloakController.cs`
- **Description**: POST api/v1/operation/kc/login

#### Parameters
- **request** (`LoginRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/kc/refresh-token

- **Method**: POST
- **Path**: api/v1/operation/kc/refresh-token
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Operation/OperationKeycloakController.cs`
- **Description**: POST api/v1/operation/kc/refresh-token

#### Parameters
- **request** (`RefreshTokenRequest`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/kc/user

- **Method**: GET
- **Path**: api/v1/operation/kc/user
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Operation/OperationKeycloakController.cs`
- **Description**: GET api/v1/operation/kc/user

#### Responses
- **200**: Success response

---

### POST api/v1/operation/kc/user

- **Method**: POST
- **Path**: api/v1/operation/kc/user
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Operation/OperationKeycloakController.cs`
- **Description**: POST api/v1/operation/kc/user

#### Parameters
- **request** (`CreateUserRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/kc/authalias

- **Method**: POST
- **Path**: api/v1/operation/kc/authalias
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Operation/OperationKeycloakController.cs`
- **Description**: POST api/v1/operation/kc/authalias

#### Parameters
- **request** (`AddAuthAliasRequest`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/operation/kc/authalias

- **Method**: DELETE
- **Path**: api/v1/operation/kc/authalias
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Operation/OperationKeycloakController.cs`
- **Description**: DELETE api/v1/operation/kc/authalias

#### Parameters
- **request** (`RemoveAuthAliasRequest`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/kc/password/reset

- **Method**: POST
- **Path**: api/v1/operation/kc/password/reset
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Operation/OperationKeycloakController.cs`
- **Description**: POST api/v1/operation/kc/password/reset

#### Parameters
- **request** (`ResetPasswordRequest`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/operation/kc/password

- **Method**: PUT
- **Path**: api/v1/operation/kc/password
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Operation/OperationKeycloakController.cs`
- **Description**: PUT api/v1/operation/kc/password

#### Parameters
- **request** (`UpdatePasswordRequest`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/kc/staff_event_logs

- **Method**: GET
- **Path**: api/v1/operation/kc/staff_event_logs
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Operation/OperationKeycloakController.cs`
- **Description**: GET api/v1/operation/kc/staff_event_logs

#### Parameters
- **request** (`EventsLogRequest`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/payment/PromptPay

- **Method**: POST
- **Path**: api/v1/payment/PromptPay
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Payment/PaymentController.cs`
- **Description**: POST api/v1/payment/PromptPay

#### Parameters
- **request** (`ArgentoPromptPayChargeCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/payment/Inquiry

- **Method**: POST
- **Path**: api/v1/payment/Inquiry
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Payment/PaymentController.cs`
- **Description**: POST api/v1/payment/Inquiry

#### Parameters
- **request** (`ArgentoInquiryPaymentTransactionCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}

#### Parameters
- **tenantId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}/properties

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}/properties
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}/properties

#### Parameters
- **tenantId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}/properties/{id}

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}/properties/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}/properties/{id}

#### Parameters
- **tenantId** (`string`) - Required
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/announcements

- **Method**: GET
- **Path**: api/v1/resident/announcements
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/announcements

#### Responses
- **200**: Success response

---

### GET api/v1/resident/announcements/{id}

- **Method**: GET
- **Path**: api/v1/resident/announcements/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/announcements/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/home

- **Method**: GET
- **Path**: api/v1/resident/home
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/home

#### Responses
- **200**: Success response

---

### GET api/v1/resident/directory-contacts

- **Method**: GET
- **Path**: api/v1/resident/directory-contacts
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/directory-contacts

#### Responses
- **200**: Success response

---

### GET api/v1/resident/house-rules/categories

- **Method**: GET
- **Path**: api/v1/resident/house-rules/categories
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/house-rules/categories

#### Responses
- **200**: Success response

---

### GET api/v1/resident/house-rules

- **Method**: GET
- **Path**: api/v1/resident/house-rules
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/house-rules

#### Responses
- **200**: Success response

---

### GET api/v1/resident/default-property

- **Method**: GET
- **Path**: api/v1/resident/default-property
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/default-property

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}/car-parking/get-registered-vehicles

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}/car-parking/get-registered-vehicles
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}/car-parking/get-registered-vehicles

#### Parameters
- **tenantId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}/car-parking/get-car-parking-quota-unit-wise

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}/car-parking/get-car-parking-quota-unit-wise
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}/car-parking/get-car-parking-quota-unit-wise

#### Parameters
- **tenantId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}/car-parking/get-car-parking-quota-total-combined

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}/car-parking/get-car-parking-quota-total-combined
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}/car-parking/get-car-parking-quota-total-combined

#### Parameters
- **tenantId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/register-new-tenant

- **Method**: POST
- **Path**: api/v1/resident/register-new-tenant
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/register-new-tenant

#### Parameters
- **body** (`RegisterNewTenantCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/update-default-property

- **Method**: POST
- **Path**: api/v1/resident/update-default-property
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/update-default-property

#### Parameters
- **body** (`UpdateDefaultPropertyCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}/visitors

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}/visitors
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}/visitors

#### Parameters
- **tenantId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}/visitor/{id}

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}/visitor/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}/visitor/{id}

#### Parameters
- **tenantId** (`string`) - Required
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/tenant/add-visitor

- **Method**: POST
- **Path**: api/v1/resident/tenant/add-visitor
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/tenant/add-visitor

#### Parameters
- **body** (`AddVisitorCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/tenant/visitor/update-status

- **Method**: POST
- **Path**: api/v1/resident/tenant/visitor/update-status
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/tenant/visitor/update-status

#### Parameters
- **body** (`UpdateVisitorStatusCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}/parcels

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}/parcels
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}/parcels

#### Parameters
- **tenantId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/get-parcel-status-list

- **Method**: GET
- **Path**: api/v1/resident/get-parcel-status-list
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/get-parcel-status-list

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}/parcel/{id}

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}/parcel/{id}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}/parcel/{id}

#### Parameters
- **tenantId** (`string`) - Required
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### PATCH api/v1/resident/update-parcel-read-status

- **Method**: PATCH
- **Path**: api/v1/resident/update-parcel-read-status
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: PATCH api/v1/resident/update-parcel-read-status

#### Parameters
- **body** (`UpdateParcelReadStatusCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/authorize-tenant

- **Method**: POST
- **Path**: api/v1/resident/authorize-tenant
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/authorize-tenant

#### Parameters
- **body** (`AuthorizeTenantCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/generate-new-presigned-url

- **Method**: POST
- **Path**: api/v1/resident/generate-new-presigned-url
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/generate-new-presigned-url

#### Parameters
- **body** (`GenerateNewPresignedCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/upload-image-url

- **Method**: POST
- **Path**: api/v1/resident/upload-image-url
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/upload-image-url

#### Responses
- **200**: Success response

---

### POST api/v1/resident/save-logs

- **Method**: POST
- **Path**: api/v1/resident/save-logs
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/save-logs

#### Parameters
- **tenantId** (`string`) - Required
- **projectId** (`string`) - Required
- **body** (`SaveLogsCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenant/{tenantId}/car-parking/{projectId}/terms-and-conditions

- **Method**: GET
- **Path**: api/v1/resident/tenant/{tenantId}/car-parking/{projectId}/terms-and-conditions
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenant/{tenantId}/car-parking/{projectId}/terms-and-conditions

#### Parameters
- **tenantId** (`string`) - Required
- **projectId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/terms-and-conditions/tenant/{tenantId}/car-parking/{projectId}

- **Method**: GET
- **Path**: api/v1/resident/terms-and-conditions/tenant/{tenantId}/car-parking/{projectId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/terms-and-conditions/tenant/{tenantId}/car-parking/{projectId}

#### Parameters
- **tenantId** (`string`) - Required
- **projectId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/add-visitor-car-parking-log

- **Method**: POST
- **Path**: api/v1/resident/add-visitor-car-parking-log
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/add-visitor-car-parking-log

#### Parameters
- **request** (`AddVisitorCarParkingLogCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/notifications/notify-lift-arrival/{tenantId}

- **Method**: GET
- **Path**: api/v1/resident/notifications/notify-lift-arrival/{tenantId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/notifications/notify-lift-arrival/{tenantId}

#### Parameters
- **tenantId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/maintenance-repair/get-event-types

- **Method**: POST
- **Path**: api/v1/resident/maintenance-repair/get-event-types
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/maintenance-repair/get-event-types

#### Parameters
- **request** (`GetEventTypesCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/maintenance-repair/get-maintainance-repair-list

- **Method**: POST
- **Path**: api/v1/resident/maintenance-repair/get-maintainance-repair-list
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/maintenance-repair/get-maintainance-repair-list

#### Parameters
- **request** (`GetMaintainanceRepairListCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/get-common-areas

- **Method**: GET
- **Path**: api/v1/resident/get-common-areas
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/get-common-areas

#### Responses
- **200**: Success response

---

### GET api/v1/resident/maintenance-repair/get-status-codes

- **Method**: GET
- **Path**: api/v1/resident/maintenance-repair/get-status-codes
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/maintenance-repair/get-status-codes

#### Responses
- **200**: Success response

---

### POST api/v1/resident/maintenance-repair/create-case

- **Method**: POST
- **Path**: api/v1/resident/maintenance-repair/create-case
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/maintenance-repair/create-case

#### Parameters
- **request** (`CreateMaintainanceRepairCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/service-request/get-event-types

- **Method**: POST
- **Path**: api/v1/resident/service-request/get-event-types
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/service-request/get-event-types

#### Parameters
- **request** (`GetServiceRequestEventTypesCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/service-request/get-list

- **Method**: POST
- **Path**: api/v1/resident/service-request/get-list
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/service-request/get-list

#### Parameters
- **request** (`GetServiceRequestListCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/service-request/get-status-codes

- **Method**: GET
- **Path**: api/v1/resident/service-request/get-status-codes
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/service-request/get-status-codes

#### Responses
- **200**: Success response

---

### POST api/v1/resident/service-request/create-case

- **Method**: POST
- **Path**: api/v1/resident/service-request/create-case
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/service-request/create-case

#### Parameters
- **request** (`CreateServiceRequestCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/feedback/get-event-types

- **Method**: POST
- **Path**: api/v1/resident/feedback/get-event-types
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/feedback/get-event-types

#### Parameters
- **request** (`GetFeedbackEventTypesCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/feedback/get-list

- **Method**: POST
- **Path**: api/v1/resident/feedback/get-list
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/feedback/get-list

#### Parameters
- **request** (`GetFeedbackListCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/feedback/get-status-codes

- **Method**: GET
- **Path**: api/v1/resident/feedback/get-status-codes
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/feedback/get-status-codes

#### Responses
- **200**: Success response

---

### POST api/v1/resident/feedback/create-case

- **Method**: POST
- **Path**: api/v1/resident/feedback/create-case
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/feedback/create-case

#### Parameters
- **request** (`CreateFeedbackCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/webhook/case-updates

- **Method**: POST
- **Path**: api/v1/resident/webhook/case-updates
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/webhook/case-updates

#### Parameters
- **request** (`CaseUpdatesCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/deactivate-visitor-pass

- **Method**: POST
- **Path**: api/v1/resident/deactivate-visitor-pass
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/deactivate-visitor-pass

#### Parameters
- **request** (`DeactivateVisitorPassCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenants/{tenantId}/questionnaires

- **Method**: GET
- **Path**: api/v1/resident/tenants/{tenantId}/questionnaires
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenants/{tenantId}/questionnaires

#### Parameters
- **tenantId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenants/{tenantId}/questionnaires/history

- **Method**: GET
- **Path**: api/v1/resident/tenants/{tenantId}/questionnaires/history
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenants/{tenantId}/questionnaires/history

#### Parameters
- **tenantId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/tenants/{tenantId}/questionnaires/detail/{questionnaireId}

- **Method**: GET
- **Path**: api/v1/resident/tenants/{tenantId}/questionnaires/detail/{questionnaireId}
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/tenants/{tenantId}/questionnaires/detail/{questionnaireId}

#### Parameters
- **tenantId** (`string`) - Required
- **questionnaireId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/submit-questionnaire

- **Method**: POST
- **Path**: api/v1/resident/submit-questionnaire
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/submit-questionnaire

#### Parameters
- **request** (`SubmitQuestionnaireCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/webhook/onboarding-sync-updates

- **Method**: POST
- **Path**: api/v1/resident/webhook/onboarding-sync-updates
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/webhook/onboarding-sync-updates

#### Parameters
- **request** (`OnboardingSyncUpdatesCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/GetDetailResidenceMemberByPersonID

- **Method**: POST
- **Path**: api/v1/resident/GetDetailResidenceMemberByPersonID
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/GetDetailResidenceMemberByPersonID

#### Responses
- **200**: Success response

---

### POST api/v1/resident/payment/generate-prompt-pay-qr

- **Method**: POST
- **Path**: api/v1/resident/payment/generate-prompt-pay-qr
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/payment/generate-prompt-pay-qr

#### Parameters
- **body** (`GeneratePromptPayQrCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/payment/webhook/payment-status-callback

- **Method**: POST
- **Path**: api/v1/resident/payment/webhook/payment-status-callback
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/payment/webhook/payment-status-callback

#### Parameters
- **request** (`GetCallBackPaymentCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/payment/get-transactions

- **Method**: POST
- **Path**: api/v1/resident/payment/get-transactions
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/payment/get-transactions

#### Parameters
- **request** (`GetPaymentTransactionCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/payment/payment-inquiry

- **Method**: POST
- **Path**: api/v1/resident/payment/payment-inquiry
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/payment/payment-inquiry

#### Parameters
- **request** (`GetPaymentInquiryCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/meters-and-billing/get-latest-meter-reading

- **Method**: POST
- **Path**: api/v1/resident/meters-and-billing/get-latest-meter-reading
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/meters-and-billing/get-latest-meter-reading

#### Parameters
- **request** (`GetLatestMeterReadingCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/meters-and-billing/get-billing-history

- **Method**: POST
- **Path**: api/v1/resident/meters-and-billing/get-billing-history
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/meters-and-billing/get-billing-history

#### Parameters
- **request** (`GetBillingHistoryCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/resident/meters-and-billing/get-invoice-history

- **Method**: POST
- **Path**: api/v1/resident/meters-and-billing/get-invoice-history
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: POST api/v1/resident/meters-and-billing/get-invoice-history

#### Parameters
- **request** (`GetInvoiceHistoryCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/resident/meters-and-billing/get-invoice-details

- **Method**: GET
- **Path**: api/v1/resident/meters-and-billing/get-invoice-details
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/meters-and-billing/get-invoice-details

#### Responses
- **200**: Success response

---

### GET api/v1/resident/meters-and-billing/get-receipt-details

- **Method**: GET
- **Path**: api/v1/resident/meters-and-billing/get-receipt-details
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/ServiceMindResidential/ServiceMindResidentialController.cs`
- **Description**: GET api/v1/resident/meters-and-billing/get-receipt-details

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/CheckHeader

- **Method**: GET
- **Path**: api/v1/[controller]/CheckHeader
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Tools/ToolsController.cs`
- **Description**: GET api/v1/[controller]/CheckHeader

#### Parameters
- **key** (`string`) - Required
- **value** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/Health

- **Method**: GET
- **Path**: api/v1/[controller]/Health
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Tools/ToolsController.cs`
- **Description**: GET api/v1/[controller]/Health

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/Version

- **Method**: GET
- **Path**: api/v1/[controller]/Version
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Tools/ToolsController.cs`
- **Description**: GET api/v1/[controller]/Version

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/Environment

- **Method**: GET
- **Path**: api/v1/[controller]/Environment
- **Function**: `undefined`
- **File**: `TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Controllers/Tools/ToolsController.cs`
- **Description**: GET api/v1/[controller]/Environment

#### Responses
- **200**: Success response

---



## Data Schemas



## External Dependencies

### Python Packages
- **MediatR** (12.2.0)
- **Microsoft.AspNetCore.Authentication.JwtBearer** (8.0.1)
- **Microsoft.VisualStudio.Azure.Containers.Tools.Targets** (1.19.5)
- **Npgsql.EntityFrameworkCore.PostgreSQL** (8.0.4)
- **Serilog.AspNetCore** (8.0.1)
- **Serilog.Expressions** (4.0.0)
- **Serilog.Sinks.Http** (8.0.0)
- **Serilog.Sinks.Seq** (6.0.0)
- **SkiaSharp** (2.88.8)
- **SkiaSharp.NativeAssets.Linux.NoDependencies** (2.88.8)
- **Swashbuckle.AspNetCore** (6.5.0)
- **Swashbuckle.AspNetCore.Annotations** (6.5.0)
- **System.IdentityModel.Tokens.Jwt** (7.2.0)
- **FluentValidation** (11.9.0)
- **Microsoft.AspNetCore.Http.Features** (5.0.17)
- **Microsoft.Extensions.Configuration.UserSecrets** (6.0.1)
- **MediatR** (12.2.0)
- **Dapper** (2.1.35)
- **Microsoft.EntityFrameworkCore** (8.0.8)
- **Microsoft.EntityFrameworkCore.Relational** (8.0.8)
- **Microsoft.Extensions.Caching.StackExchangeRedis** (9.0.0)
- **Microsoft.Extensions.Configuration.Abstractions** (8.0.0)
- **Microsoft.Extensions.Http** (8.0.0)
- **Microsoft.Extensions.Options.ConfigurationExtensions** (8.0.0)
- **Npgsql.EntityFrameworkCore.PostgreSQL** (8.0.4)
- **SkiaSharp** (2.88.8)
- **Microsoft.NET.Test.Sdk** (17.9.0)
- **Moq** (4.20.70)
- **NUnit** (4.1.0)
- **NUnit3TestAdapter** (4.5.0)
- **RichardSzalay.MockHttp** (7.0.0)


### External APIs


## Summary

- ✅ **Total Endpoints**: 352
- ✅ **HTTP Methods**: GET, POST, PATCH, PUT, DELETE
- ✅ **Authentication**: No
- ✅ **Documentation**: Yes
- ✅ **Schemas**: 0
- ✅ **Dependencies**: 31

---

*Generated by API Documentation and Inventory System - 7/23/2025* 