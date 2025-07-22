# API Inventory: obk-operation-backend-dev

## Service Overview

- **Service Name**: obk-operation-backend-dev
- **Framework**: .NET
- **Language**: C#
- **Analysis Date**: 7/23/2025
- **Total Endpoints**: 306

## Technology Stack

- **Framework**: .NET {{FRAMEWORK_VERSION}}
- **Language**: C#
- **Dependencies**: 44 packages
- **External APIs**: 0

## API Endpoints

### GET api/v1/Polygon

- **Method**: GET
- **Path**: api/v1/Polygon
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/AOCHMap/MapPolygonController.cs`
- **Description**: GET api/v1/Polygon

#### Responses
- **200**: Success response

---

### POST api/v1/[controller]/UpsertLocations

- **Method**: POST
- **Path**: api/v1/[controller]/UpsertLocations
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/BatchCall/BatchCallController.cs`
- **Description**: POST api/v1/[controller]/UpsertLocations

#### Responses
- **200**: Success response

---

### GET api/v1/AppConfig/{name}

- **Method**: GET
- **Path**: api/v1/AppConfig/{name}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/AppConfig/AppConfigController.cs`
- **Description**: GET api/v1/AppConfig/{name}

#### Parameters
- **name** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/HomeContent/RemoteConfig

- **Method**: GET
- **Path**: api/v1/HomeContent/RemoteConfig
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/HomeContent/HomeContentController.cs`
- **Description**: GET api/v1/HomeContent/RemoteConfig

#### Responses
- **200**: Success response

---

### GET api/v1/HomeContent/Versions

- **Method**: GET
- **Path**: api/v1/HomeContent/Versions
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/HomeContent/HomeContentController.cs`
- **Description**: GET api/v1/HomeContent/Versions

#### Parameters
- **id** (`string`) - Required
- **query** (`GetVersionsQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/HomeContent/Version/{id}

- **Method**: GET
- **Path**: api/v1/HomeContent/Version/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/HomeContent/HomeContentController.cs`
- **Description**: GET api/v1/HomeContent/Version/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/HomeContent/Upload

- **Method**: POST
- **Path**: api/v1/HomeContent/Upload
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/HomeContent/HomeContentController.cs`
- **Description**: POST api/v1/HomeContent/Upload

#### Responses
- **200**: Success response

---

### POST api/v1/HomeContent/Publish

- **Method**: POST
- **Path**: api/v1/HomeContent/Publish
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/HomeContent/HomeContentController.cs`
- **Description**: POST api/v1/HomeContent/Publish

#### Responses
- **200**: Success response

---

### GET api/v1/HomeContent/LatestVersion

- **Method**: GET
- **Path**: api/v1/HomeContent/LatestVersion
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/HomeContent/HomeContentController.cs`
- **Description**: GET api/v1/HomeContent/LatestVersion

#### Responses
- **200**: Success response

---

### GET api/v1/Members

- **Method**: GET
- **Path**: api/v1/Members
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: GET api/v1/Members

#### Parameters
- **query** (`GetMembersQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/MembersOpsApp

- **Method**: GET
- **Path**: api/v1/MembersOpsApp
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: GET api/v1/MembersOpsApp

#### Parameters
- **query** (`GetMembersOpsAppQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/MembersOpsApp/isActive

- **Method**: POST
- **Path**: api/v1/MembersOpsApp/isActive
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: POST api/v1/MembersOpsApp/isActive

#### Parameters
- **command** (`IsActiveAccountCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/MembersOpsApp/UnblockAccount

- **Method**: POST
- **Path**: api/v1/MembersOpsApp/UnblockAccount
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: POST api/v1/MembersOpsApp/UnblockAccount

#### Parameters
- **command** (`UnblockAccountCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Member/{id}

- **Method**: GET
- **Path**: api/v1/Member/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: GET api/v1/Member/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/MemberAndSOC/{id}

- **Method**: GET
- **Path**: api/v1/MemberAndSOC/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: GET api/v1/MemberAndSOC/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/MemberAndSOCWithOutActive/{id}

- **Method**: GET
- **Path**: api/v1/MemberAndSOCWithOutActive/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: GET api/v1/MemberAndSOCWithOutActive/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Member/KeyCloakId/{id}

- **Method**: GET
- **Path**: api/v1/Member/KeyCloakId/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: GET api/v1/Member/KeyCloakId/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Member/InviteMember

- **Method**: POST
- **Path**: api/v1/Member/InviteMember
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: POST api/v1/Member/InviteMember

#### Parameters
- **command** (`InviteMemberCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Member/ResendInvite

- **Method**: POST
- **Path**: api/v1/Member/ResendInvite
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: POST api/v1/Member/ResendInvite

#### Responses
- **200**: Success response

---

### PUT api/v1/Member

- **Method**: PUT
- **Path**: api/v1/Member
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: PUT api/v1/Member

#### Parameters
- **command** (`UpdateMemberCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Member/Active

- **Method**: PUT
- **Path**: api/v1/Member/Active
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: PUT api/v1/Member/Active

#### Parameters
- **command** (`UpdateMemberCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Member/Status

- **Method**: PUT
- **Path**: api/v1/Member/Status
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: PUT api/v1/Member/Status

#### Parameters
- **command** (`UpdateStatusMemberCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Member/Role

- **Method**: PUT
- **Path**: api/v1/Member/Role
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: PUT api/v1/Member/Role

#### Parameters
- **command** (`UpdateMemberWithRoleCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Member/InviteMember

- **Method**: GET
- **Path**: api/v1/Member/InviteMember
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: GET api/v1/Member/InviteMember

#### Responses
- **200**: Success response

---

### GET api/v1/Member/GetMembersByRole/{roleId}

- **Method**: GET
- **Path**: api/v1/Member/GetMembersByRole/{roleId}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: GET api/v1/Member/GetMembersByRole/{roleId}

#### Parameters
- **roleId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Member/ForgotPassword

- **Method**: POST
- **Path**: api/v1/Member/ForgotPassword
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: POST api/v1/Member/ForgotPassword

#### Parameters
- **command** (`ForgotPasswordCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Member/ResetPassword

- **Method**: POST
- **Path**: api/v1/Member/ResetPassword
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: POST api/v1/Member/ResetPassword

#### Parameters
- **command** (`ResetPasswordCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Member/VerifyResetPasswordToken/{id}

- **Method**: GET
- **Path**: api/v1/Member/VerifyResetPasswordToken/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/MemberManagement/MemberManagementController.cs`
- **Description**: GET api/v1/Member/VerifyResetPasswordToken/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Menu

- **Method**: POST
- **Path**: api/v1/Menu
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/Menu/MenuController.cs`
- **Description**: POST api/v1/Menu

#### Parameters
- **query** (`GetMenuQuery`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/DirectoryContact/List

- **Method**: GET
- **Path**: api/v1/DirectoryContact/List
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/Office/DirectoryContact/DirectoryContactController.cs`
- **Description**: GET api/v1/DirectoryContact/List

#### Parameters
- **query** (`GetDirectoryContactsQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/DirectoryContact/{id}

- **Method**: GET
- **Path**: api/v1/DirectoryContact/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/Office/DirectoryContact/DirectoryContactController.cs`
- **Description**: GET api/v1/DirectoryContact/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/DirectoryContact/Category

- **Method**: POST
- **Path**: api/v1/DirectoryContact/Category
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/Office/DirectoryContact/DirectoryContactController.cs`
- **Description**: POST api/v1/DirectoryContact/Category

#### Parameters
- **req** (`CreateDirectoryContactCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/DirectoryContact/Category

- **Method**: PUT
- **Path**: api/v1/DirectoryContact/Category
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/Office/DirectoryContact/DirectoryContactController.cs`
- **Description**: PUT api/v1/DirectoryContact/Category

#### Parameters
- **req** (`UpdateDirectoryContactCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/DirectoryContact/category/{id}

- **Method**: DELETE
- **Path**: api/v1/DirectoryContact/category/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/Office/DirectoryContact/DirectoryContactController.cs`
- **Description**: DELETE api/v1/DirectoryContact/category/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/DirectoryContact/Number

- **Method**: PUT
- **Path**: api/v1/DirectoryContact/Number
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/Office/DirectoryContact/DirectoryContactController.cs`
- **Description**: PUT api/v1/DirectoryContact/Number

#### Parameters
- **req** (`EditNumberCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Roles

- **Method**: GET
- **Path**: api/v1/Roles
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/RoleManagement/RoleMangementController.cs`
- **Description**: GET api/v1/Roles

#### Parameters
- **ID** (`string`) - Required
- **query** (`GetRolesQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Role/{ID}

- **Method**: GET
- **Path**: api/v1/Role/{ID}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/RoleManagement/RoleMangementController.cs`
- **Description**: GET api/v1/Role/{ID}

#### Parameters
- **ID** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Role/Privileges

- **Method**: GET
- **Path**: api/v1/Role/Privileges
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/RoleManagement/RoleMangementController.cs`
- **Description**: GET api/v1/Role/Privileges

#### Responses
- **200**: Success response

---

### POST api/v1/Role

- **Method**: POST
- **Path**: api/v1/Role
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/RoleManagement/RoleMangementController.cs`
- **Description**: POST api/v1/Role

#### Parameters
- **command** (`CreateRoleCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Role

- **Method**: PUT
- **Path**: api/v1/Role
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/RoleManagement/RoleMangementController.cs`
- **Description**: PUT api/v1/Role

#### Parameters
- **command** (`UpdateRoleCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Role/Status

- **Method**: PUT
- **Path**: api/v1/Role/Status
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/RoleManagement/RoleMangementController.cs`
- **Description**: PUT api/v1/Role/Status

#### Parameters
- **command** (`UpdateStatusRoleCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Role/Privilege

- **Method**: POST
- **Path**: api/v1/Role/Privilege
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/RoleManagement/RoleMangementController.cs`
- **Description**: POST api/v1/Role/Privilege

#### Parameters
- **request** (`CreatePrivilegeCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/Role/Remove/{roleId}

- **Method**: DELETE
- **Path**: api/v1/Role/Remove/{roleId}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/RoleManagement/RoleMangementController.cs`
- **Description**: DELETE api/v1/Role/Remove/{roleId}

#### Parameters
- **roleId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/user/profile

- **Method**: GET
- **Path**: api/v1/operation/user/profile
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/User/UserController.cs`
- **Description**: GET api/v1/operation/user/profile

#### Parameters
- **kcusername** (`string`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/user/Users

- **Method**: GET
- **Path**: api/v1/operation/user/Users
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/User/UserController.cs`
- **Description**: GET api/v1/operation/user/Users

#### Parameters
- **query** (`GetAllAccountQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/user/MozartSupTech

- **Method**: GET
- **Path**: api/v1/operation/user/MozartSupTech
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/User/UserController.cs`
- **Description**: GET api/v1/operation/user/MozartSupTech

#### Responses
- **200**: Success response

---

### GET api/v1/operation/user/AhocDataUserMozart

- **Method**: GET
- **Path**: api/v1/operation/user/AhocDataUserMozart
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/User/UserController.cs`
- **Description**: GET api/v1/operation/user/AhocDataUserMozart

#### Responses
- **200**: Success response

---

### POST api/v1/operation/user/Role

- **Method**: POST
- **Path**: api/v1/operation/user/Role
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/User/UserController.cs`
- **Description**: POST api/v1/operation/user/Role

#### Parameters
- **request** (`UpdateRoleOpsAppCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/user/OpsappPermission

- **Method**: GET
- **Path**: api/v1/operation/user/OpsappPermission
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/User/UserController.cs`
- **Description**: GET api/v1/operation/user/OpsappPermission

#### Responses
- **200**: Success response

---

### POST api/v1/operation/user/UpsertFCM

- **Method**: POST
- **Path**: api/v1/operation/user/UpsertFCM
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/User/UserController.cs`
- **Description**: POST api/v1/operation/user/UpsertFCM

#### Parameters
- **request** (`UpsertFCMCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/user/UserClientSite

- **Method**: GET
- **Path**: api/v1/operation/user/UserClientSite
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/CMS/User/UserController.cs`
- **Description**: GET api/v1/operation/user/UserClientSite

#### Parameters
- **kcusername** (`string`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/GetDefaultIcon/{defaultIcon}

- **Method**: GET
- **Path**: api/v1/[controller]/GetDefaultIcon/{defaultIcon}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/LBSController/LBSController.cs`
- **Description**: GET api/v1/[controller]/GetDefaultIcon/{defaultIcon}

#### Parameters
- **defaultIcon** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/[controller]/UploadDefaultIcon

- **Method**: POST
- **Path**: api/v1/[controller]/UploadDefaultIcon
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/LBSController/LBSController.cs`
- **Description**: POST api/v1/[controller]/UploadDefaultIcon

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/GetBeacons

- **Method**: GET
- **Path**: api/v1/[controller]/GetBeacons
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/LBSController/LBSController.cs`
- **Description**: GET api/v1/[controller]/GetBeacons

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/GetBeaconByUUID/{UUID}

- **Method**: GET
- **Path**: api/v1/[controller]/GetBeaconByUUID/{UUID}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/LBSController/LBSController.cs`
- **Description**: GET api/v1/[controller]/GetBeaconByUUID/{UUID}

#### Parameters
- **UUID** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/GetBoundaryOBK

- **Method**: GET
- **Path**: api/v1/[controller]/GetBoundaryOBK
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/LBSController/LBSController.cs`
- **Description**: GET api/v1/[controller]/GetBoundaryOBK

#### Responses
- **200**: Success response

---

### POST api/v1/Marcom/MarcomBanner/Publish

- **Method**: POST
- **Path**: api/v1/Marcom/MarcomBanner/Publish
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: POST api/v1/Marcom/MarcomBanner/Publish

#### Responses
- **200**: Success response

---

### POST api/v1/Marcom/MarcomBanner/Delete

- **Method**: POST
- **Path**: api/v1/Marcom/MarcomBanner/Delete
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: POST api/v1/Marcom/MarcomBanner/Delete

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/MarcomBanner/{id}

- **Method**: GET
- **Path**: api/v1/Marcom/MarcomBanner/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/MarcomBanner/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/MarcomBanner

- **Method**: GET
- **Path**: api/v1/Marcom/MarcomBanner
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/MarcomBanner

#### Parameters
- **query** (`GetAllMarcomBannerManagementQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/PRBannerManagement/GetInitial

- **Method**: GET
- **Path**: api/v1/Marcom/PRBannerManagement/GetInitial
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/PRBannerManagement/GetInitial

#### Parameters
- **query** (`InitialMarcomBannerQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/Marcom/Marcom/ChangeOrder

- **Method**: POST
- **Path**: api/v1/Marcom/Marcom/ChangeOrder
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: POST api/v1/Marcom/Marcom/ChangeOrder

#### Responses
- **200**: Success response

---

### POST api/v1/Marcom/Event/Publish

- **Method**: POST
- **Path**: api/v1/Marcom/Event/Publish
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: POST api/v1/Marcom/Event/Publish

#### Responses
- **200**: Success response

---

### POST api/v1/Marcom/Event/Delete

- **Method**: POST
- **Path**: api/v1/Marcom/Event/Delete
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: POST api/v1/Marcom/Event/Delete

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/Event/{id}

- **Method**: GET
- **Path**: api/v1/Marcom/Event/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/Event/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/Event

- **Method**: GET
- **Path**: api/v1/Marcom/Event
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/Event

#### Parameters
- **query** (`GetAllEventQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/Marcom/Explore/Publish

- **Method**: POST
- **Path**: api/v1/Marcom/Explore/Publish
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: POST api/v1/Marcom/Explore/Publish

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/Explore

- **Method**: GET
- **Path**: api/v1/Marcom/Explore
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/Explore

#### Parameters
- **query** (`GetAllExploreQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/Explore/{id}

- **Method**: GET
- **Path**: api/v1/Marcom/Explore/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/Explore/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Marcom/Explore/Delete

- **Method**: POST
- **Path**: api/v1/Marcom/Explore/Delete
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: POST api/v1/Marcom/Explore/Delete

#### Responses
- **200**: Success response

---

### POST api/v1/Marcom/Happening/Publish

- **Method**: POST
- **Path**: api/v1/Marcom/Happening/Publish
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: POST api/v1/Marcom/Happening/Publish

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/Category

- **Method**: GET
- **Path**: api/v1/Marcom/Category
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/Category

#### Parameters
- **query** (`GetAllCategoryQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/Happening/{id}

- **Method**: GET
- **Path**: api/v1/Marcom/Happening/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/Happening/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/Content

- **Method**: GET
- **Path**: api/v1/Marcom/Content
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/Content

#### Parameters
- **query** (`GetAllContentQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Marcom/Happening/Category

- **Method**: GET
- **Path**: api/v1/Marcom/Happening/Category
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: GET api/v1/Marcom/Happening/Category

#### Parameters
- **query** (`CategoryListQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/Marcom/Happening/Delete

- **Method**: POST
- **Path**: api/v1/Marcom/Happening/Delete
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: POST api/v1/Marcom/Happening/Delete

#### Responses
- **200**: Success response

---

### POST api/v1/Marcom/Marcom/SaveConfig

- **Method**: POST
- **Path**: api/v1/Marcom/Marcom/SaveConfig
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarComController.cs`
- **Description**: POST api/v1/Marcom/Marcom/SaveConfig

#### Responses
- **200**: Success response

---

### POST api/v1/MarcomMobile/GetContent

- **Method**: POST
- **Path**: api/v1/MarcomMobile/GetContent
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarcomMobileController.cs`
- **Description**: POST api/v1/MarcomMobile/GetContent

#### Responses
- **200**: Success response

---

### POST api/v1/MarcomMobile/GetWhatHappenAll

- **Method**: POST
- **Path**: api/v1/MarcomMobile/GetWhatHappenAll
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarcomMobileController.cs`
- **Description**: POST api/v1/MarcomMobile/GetWhatHappenAll

#### Responses
- **200**: Success response

---

### POST api/v1/MarcomMobile/GetContentDetail

- **Method**: POST
- **Path**: api/v1/MarcomMobile/GetContentDetail
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarcomMobileController.cs`
- **Description**: POST api/v1/MarcomMobile/GetContentDetail

#### Responses
- **200**: Success response

---

### POST api/v1/MarcomMobile/ClearCache

- **Method**: POST
- **Path**: api/v1/MarcomMobile/ClearCache
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/MarCom/MarcomMobileController.cs`
- **Description**: POST api/v1/MarcomMobile/ClearCache

#### Responses
- **200**: Success response

---

### POST api/mobile/v1/authentication/Login

- **Method**: POST
- **Path**: api/mobile/v1/authentication/Login
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/Authentication/AuthenticationController.cs`
- **Description**: POST api/mobile/v1/authentication/Login

#### Parameters
- **data** (`LoginCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/mobile/v1/authentication/Register

- **Method**: POST
- **Path**: api/mobile/v1/authentication/Register
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/Authentication/AuthenticationController.cs`
- **Description**: POST api/mobile/v1/authentication/Register

#### Parameters
- **command** (`CreateUserKCCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/mobile/v1/authentication/OauthToken

- **Method**: GET
- **Path**: api/mobile/v1/authentication/OauthToken
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/Authentication/AuthenticationController.cs`
- **Description**: GET api/mobile/v1/authentication/OauthToken

#### Responses
- **200**: Success response

---

### POST api/mobile/v1/authentication/Login

- **Method**: POST
- **Path**: api/mobile/v1/authentication/Login
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/Authentication/AuthenticationController.cs`
- **Description**: POST api/mobile/v1/authentication/Login

#### Parameters
- **data** (`LoginCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/mobile/v1/authentication/Register

- **Method**: POST
- **Path**: api/mobile/v1/authentication/Register
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/Authentication/AuthenticationController.cs`
- **Description**: POST api/mobile/v1/authentication/Register

#### Parameters
- **command** (`CreateUserKCCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/mobile/v1/authentication/OauthToken

- **Method**: GET
- **Path**: api/mobile/v1/authentication/OauthToken
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/Authentication/AuthenticationController.cs`
- **Description**: GET api/mobile/v1/authentication/OauthToken

#### Responses
- **200**: Success response

---

### GET api/mobile/v1/authentication/KeycloalToken

- **Method**: GET
- **Path**: api/mobile/v1/authentication/KeycloalToken
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/Authentication/AuthenticationController.cs`
- **Description**: GET api/mobile/v1/authentication/KeycloalToken

#### Responses
- **200**: Success response

---

### POST api/mobile/v1/TimeSheet/StampTimeSheet

- **Method**: POST
- **Path**: api/mobile/v1/TimeSheet/StampTimeSheet
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/TimeSheet/TimeSheetController.cs`
- **Description**: POST api/mobile/v1/TimeSheet/StampTimeSheet

#### Parameters
- **data** (`StampTimeSheetCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/mobile/v1/TimeSheet/Check

- **Method**: GET
- **Path**: api/mobile/v1/TimeSheet/Check
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/TimeSheet/TimeSheetController.cs`
- **Description**: GET api/mobile/v1/TimeSheet/Check

#### Parameters
- **data** (`CheckTimeSheetQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/mobile/v1/masterdata/CaseIncident

- **Method**: POST
- **Path**: api/mobile/v1/masterdata/CaseIncident
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/SOC/SOCController.cs`
- **Description**: POST api/mobile/v1/masterdata/CaseIncident

#### Parameters
- **command** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/mobile/v1/WorkList/TodoList

- **Method**: GET
- **Path**: api/mobile/v1/WorkList/TodoList
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListController.cs`
- **Description**: GET api/mobile/v1/WorkList/TodoList

#### Parameters
- **data** (`GetTodoListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/mobile/v1/WorkList/WorkListDetail

- **Method**: GET
- **Path**: api/mobile/v1/WorkList/WorkListDetail
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListController.cs`
- **Description**: GET api/mobile/v1/WorkList/WorkListDetail

#### Parameters
- **data** (`GetWorkListDetailQuery`) - Optional

#### Responses
- **200**: Success response

---

### PUT api/mobile/v1/WorkList/SubmitWork

- **Method**: PUT
- **Path**: api/mobile/v1/WorkList/SubmitWork
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListController.cs`
- **Description**: PUT api/mobile/v1/WorkList/SubmitWork

#### Parameters
- **data** (`SubmitWorkCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/mobile/v1/WorkList/SubmitHistory

- **Method**: GET
- **Path**: api/mobile/v1/WorkList/SubmitHistory
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListController.cs`
- **Description**: GET api/mobile/v1/WorkList/SubmitHistory

#### Parameters
- **data** (`SubmitWorkCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/mobile/v1/WorkList/RejectWork

- **Method**: POST
- **Path**: api/mobile/v1/WorkList/RejectWork
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListController.cs`
- **Description**: POST api/mobile/v1/WorkList/RejectWork

#### Parameters
- **data** (`RejectWorkCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/mobile/v1/WorkList/AcknowledgeWork

- **Method**: POST
- **Path**: api/mobile/v1/WorkList/AcknowledgeWork
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListController.cs`
- **Description**: POST api/mobile/v1/WorkList/AcknowledgeWork

#### Parameters
- **data** (`AcknowledgeWorkCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/mobile/v1/WorkListSecurity/TodoList

- **Method**: GET
- **Path**: api/mobile/v1/WorkListSecurity/TodoList
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListSecurityController.cs`
- **Description**: GET api/mobile/v1/WorkListSecurity/TodoList

#### Parameters
- **data** (`GetTodoListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/mobile/v1/WorkListSecurity/WorkListSecurityDetail

- **Method**: GET
- **Path**: api/mobile/v1/WorkListSecurity/WorkListSecurityDetail
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListSecurityController.cs`
- **Description**: GET api/mobile/v1/WorkListSecurity/WorkListSecurityDetail

#### Parameters
- **data** (`GetWorkListSecurityDetailQuery`) - Optional

#### Responses
- **200**: Success response

---

### PUT api/mobile/v1/WorkListSecurity/SubmitWork

- **Method**: PUT
- **Path**: api/mobile/v1/WorkListSecurity/SubmitWork
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListSecurityController.cs`
- **Description**: PUT api/mobile/v1/WorkListSecurity/SubmitWork

#### Parameters
- **data** (`SubmitWorkCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/mobile/v1/WorkListSecurity/SubmitHistory

- **Method**: GET
- **Path**: api/mobile/v1/WorkListSecurity/SubmitHistory
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListSecurityController.cs`
- **Description**: GET api/mobile/v1/WorkListSecurity/SubmitHistory

#### Parameters
- **data** (`SubmitWorkCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/mobile/v1/WorkListSecurity/RejectWork

- **Method**: POST
- **Path**: api/mobile/v1/WorkListSecurity/RejectWork
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListSecurityController.cs`
- **Description**: POST api/mobile/v1/WorkListSecurity/RejectWork

#### Parameters
- **data** (`RejectWorkCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/mobile/v1/WorkListSecurity/AcknowledgeWork

- **Method**: POST
- **Path**: api/mobile/v1/WorkListSecurity/AcknowledgeWork
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Mobile/WorkList/WorkListSecurityController.cs`
- **Description**: POST api/mobile/v1/WorkListSecurity/AcknowledgeWork

#### Parameters
- **data** (`AcknowledgeWorkCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Attendant/import

- **Method**: POST
- **Path**: api/v1/Attendant/import
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Attendance/AttendanceController.cs`
- **Description**: POST api/v1/Attendant/import

#### Parameters
- **command** (`ImportLogCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/common/GetImageData

- **Method**: GET
- **Path**: api/v1/common/GetImageData
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Common/CommonController.cs`
- **Description**: GET api/v1/common/GetImageData

#### Parameters
- **command** (`GetImageQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/cronjob/SyncPPM

- **Method**: POST
- **Path**: api/v1/cronjob/SyncPPM
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/CronJob/CronJobController.cs`
- **Description**: POST api/v1/cronjob/SyncPPM

#### Parameters
- **command** (`UpsertPPMCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Tasks

- **Method**: GET
- **Path**: api/v1/Tasks
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/Tasks

#### Parameters
- **query** (`GetTaskListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Task/{id}

- **Method**: GET
- **Path**: api/v1/Task/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/Task/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Task/status

- **Method**: PUT
- **Path**: api/v1/Task/status
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/Task/status

#### Parameters
- **command** (`UpdateTaskStatusCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/TaskSubTasks/create

- **Method**: POST
- **Path**: api/v1/TaskSubTasks/create
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/TaskSubTasks/create

#### Parameters
- **command** (`CreateTaskSubtaskCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/TaskSubTasks/update

- **Method**: PUT
- **Path**: api/v1/TaskSubTasks/update
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/TaskSubTasks/update

#### Parameters
- **command** (`UpdateTaskSubtaskCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Subtasks

- **Method**: GET
- **Path**: api/v1/Subtasks
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/Subtasks

#### Parameters
- **query** (`GetSubtaskQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/Task/CheckDuplicate

- **Method**: POST
- **Path**: api/v1/Task/CheckDuplicate
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/Task/CheckDuplicate

#### Parameters
- **query** (`CheckTaskDuplicateQuery`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Action/Status

- **Method**: PUT
- **Path**: api/v1/Action/Status
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/Action/Status

#### Parameters
- **command** (`UpdateStatusActionCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Subtask/Status

- **Method**: PUT
- **Path**: api/v1/Subtask/Status
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/Subtask/Status

#### Parameters
- **command** (`UpdateStatusSubtaskCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Actions

- **Method**: GET
- **Path**: api/v1/Actions
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/Actions

#### Parameters
- **query** (`GetActionListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Action/{id}

- **Method**: GET
- **Path**: api/v1/Action/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/Action/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Action

- **Method**: POST
- **Path**: api/v1/Action
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/Action

#### Parameters
- **command** (`CreateActionCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Action

- **Method**: PUT
- **Path**: api/v1/Action
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/Action

#### Parameters
- **command** (`UpdateActionCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/Action/{actionId}

- **Method**: DELETE
- **Path**: api/v1/Action/{actionId}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: DELETE api/v1/Action/{actionId}

#### Parameters
- **actionId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/ActionTypes

- **Method**: GET
- **Path**: api/v1/ActionTypes
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/ActionTypes

#### Parameters
- **query** (`GetActionTypeListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/ActionType/{id}

- **Method**: GET
- **Path**: api/v1/ActionType/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/ActionType/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/ActionType

- **Method**: POST
- **Path**: api/v1/ActionType
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/ActionType

#### Parameters
- **command** (`CreateActionTypeCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/ActionType

- **Method**: PUT
- **Path**: api/v1/ActionType
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/ActionType

#### Parameters
- **command** (`UpdateActionTypeCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/ActionType/{actionId}

- **Method**: DELETE
- **Path**: api/v1/ActionType/{actionId}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: DELETE api/v1/ActionType/{actionId}

#### Parameters
- **actionId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/ActivityProcedures

- **Method**: GET
- **Path**: api/v1/ActivityProcedures
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/ActivityProcedures

#### Parameters
- **query** (`GetActivityProcedureListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/ActivityProcedure/{id}

- **Method**: GET
- **Path**: api/v1/ActivityProcedure/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/ActivityProcedure/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/ActivityProcedure/CheckDuplicate

- **Method**: POST
- **Path**: api/v1/ActivityProcedure/CheckDuplicate
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/ActivityProcedure/CheckDuplicate

#### Responses
- **200**: Success response

---

### POST api/v1/ActivityProcedure

- **Method**: POST
- **Path**: api/v1/ActivityProcedure
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/ActivityProcedure

#### Responses
- **200**: Success response

---

### PUT api/v1/ActivityProcedure/{id}

- **Method**: PUT
- **Path**: api/v1/ActivityProcedure/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/ActivityProcedure/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/ActivityProcedure/{id}

- **Method**: DELETE
- **Path**: api/v1/ActivityProcedure/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: DELETE api/v1/ActivityProcedure/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/SchedulePlans

- **Method**: GET
- **Path**: api/v1/SchedulePlans
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/SchedulePlans

#### Parameters
- **query** (`GetSchedulePlanListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/SchedulePlan/{id}

- **Method**: GET
- **Path**: api/v1/SchedulePlan/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/SchedulePlan/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/SchedulePlan

- **Method**: POST
- **Path**: api/v1/SchedulePlan
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/SchedulePlan

#### Parameters
- **command** (`CreateSchedulePlanCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/SchedulePlan

- **Method**: PUT
- **Path**: api/v1/SchedulePlan
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/SchedulePlan

#### Parameters
- **command** (`UpdateSchedulePlanCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/SchedulePlan/{actionId}

- **Method**: DELETE
- **Path**: api/v1/SchedulePlan/{actionId}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: DELETE api/v1/SchedulePlan/{actionId}

#### Parameters
- **actionId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/SchedulePlan/process

- **Method**: POST
- **Path**: api/v1/SchedulePlan/process
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/SchedulePlan/process

#### Parameters
- **command** (`ProcessSchedulePlanCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Shift

- **Method**: GET
- **Path**: api/v1/Shift
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/Shift

#### Parameters
- **query** (`GetShiftListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Shift/{id}

- **Method**: GET
- **Path**: api/v1/Shift/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/Shift/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Shift

- **Method**: POST
- **Path**: api/v1/Shift
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/Shift

#### Parameters
- **command** (`CreateShiftCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Shift

- **Method**: PUT
- **Path**: api/v1/Shift
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/Shift

#### Parameters
- **command** (`UpdateShiftCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/Shift/{id}

- **Method**: DELETE
- **Path**: api/v1/Shift/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: DELETE api/v1/Shift/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/ManPower

- **Method**: GET
- **Path**: api/v1/ManPower
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/ManPower

#### Parameters
- **query** (`GetShiftManPowerListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/ManPower/{id}

- **Method**: GET
- **Path**: api/v1/ManPower/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/ManPower/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/ManPower/upsert

- **Method**: POST
- **Path**: api/v1/ManPower/upsert
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/ManPower/upsert

#### Parameters
- **command** (`UpsertShiftManPowerCommandCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/ManPower/{id}

- **Method**: DELETE
- **Path**: api/v1/ManPower/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: DELETE api/v1/ManPower/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/Location

- **Method**: POST
- **Path**: api/v1/Location
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: POST api/v1/Location

#### Parameters
- **command** (`CreateLocationCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/Location/{id}

- **Method**: DELETE
- **Path**: api/v1/Location/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: DELETE api/v1/Location/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Location

- **Method**: GET
- **Path**: api/v1/Location
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/Location

#### Parameters
- **query** (`GetLocationListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Location/{id}

- **Method**: GET
- **Path**: api/v1/Location/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/Location/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/Location

- **Method**: PUT
- **Path**: api/v1/Location
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/Location

#### Parameters
- **command** (`UpdateLocationCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/User/Member

- **Method**: GET
- **Path**: api/v1/User/Member
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/User/Member

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/authentication/Login

- **Method**: POST
- **Path**: api/v1/operation/mobile/authentication/Login
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Authentication/AuthenticationController.cs`
- **Description**: POST api/v1/operation/mobile/authentication/Login

#### Parameters
- **data** (`LoginCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/authentication/RefreshToken

- **Method**: POST
- **Path**: api/v1/operation/mobile/authentication/RefreshToken
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Authentication/AuthenticationController.cs`
- **Description**: POST api/v1/operation/mobile/authentication/RefreshToken

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/authentication/Register

- **Method**: POST
- **Path**: api/v1/operation/mobile/authentication/Register
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Authentication/AuthenticationController.cs`
- **Description**: POST api/v1/operation/mobile/authentication/Register

#### Parameters
- **command** (`CreateUserKCCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/authentication/OauthToken

- **Method**: GET
- **Path**: api/v1/operation/mobile/authentication/OauthToken
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Authentication/AuthenticationController.cs`
- **Description**: GET api/v1/operation/mobile/authentication/OauthToken

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/authentication/UATLogin

- **Method**: POST
- **Path**: api/v1/operation/mobile/authentication/UATLogin
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Authentication/AuthenticationController.cs`
- **Description**: POST api/v1/operation/mobile/authentication/UATLogin

#### Parameters
- **request** (`UATLoginCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/authentication/Logout

- **Method**: POST
- **Path**: api/v1/operation/mobile/authentication/Logout
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Authentication/AuthenticationController.cs`
- **Description**: POST api/v1/operation/mobile/authentication/Logout

#### Parameters
- **data** (`LogoutCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/operation/mobile/authentication/EventsLog

- **Method**: PUT
- **Path**: api/v1/operation/mobile/authentication/EventsLog
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Authentication/AuthenticationController.cs`
- **Description**: PUT api/v1/operation/mobile/authentication/EventsLog

#### Parameters
- **command** (`CreateEventlogCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/cwo/Detail

- **Method**: GET
- **Path**: api/v1/operation/mobile/cwo/Detail
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: GET api/v1/operation/mobile/cwo/Detail

#### Parameters
- **cwoid** (`int`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/cwo/Assign/Technician

- **Method**: POST
- **Path**: api/v1/operation/mobile/cwo/Assign/Technician
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: POST api/v1/operation/mobile/cwo/Assign/Technician

#### Parameters
- **request** (`AssignTechnicianCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/cwo/Reject/Technician

- **Method**: POST
- **Path**: api/v1/operation/mobile/cwo/Reject/Technician
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: POST api/v1/operation/mobile/cwo/Reject/Technician

#### Parameters
- **request** (`RejectTechnicianCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/cwo/Reject/Supervisor

- **Method**: POST
- **Path**: api/v1/operation/mobile/cwo/Reject/Supervisor
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: POST api/v1/operation/mobile/cwo/Reject/Supervisor

#### Parameters
- **request** (`RejectSupervisorCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/cwo/Acknowledge

- **Method**: POST
- **Path**: api/v1/operation/mobile/cwo/Acknowledge
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: POST api/v1/operation/mobile/cwo/Acknowledge

#### Parameters
- **request** (`TechnicainAcknowledgeCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/cwo/Pause

- **Method**: POST
- **Path**: api/v1/operation/mobile/cwo/Pause
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: POST api/v1/operation/mobile/cwo/Pause

#### Parameters
- **request** (`PauseWorkCWOCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/cwo/Resume

- **Method**: POST
- **Path**: api/v1/operation/mobile/cwo/Resume
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: POST api/v1/operation/mobile/cwo/Resume

#### Parameters
- **request** (`ResumeWorkCWOCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/cwo/Completed

- **Method**: POST
- **Path**: api/v1/operation/mobile/cwo/Completed
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: POST api/v1/operation/mobile/cwo/Completed

#### Parameters
- **request** (`CompleteCWOCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/cwo/Close

- **Method**: POST
- **Path**: api/v1/operation/mobile/cwo/Close
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: POST api/v1/operation/mobile/cwo/Close

#### Parameters
- **request** (`CloseCWOCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/cwo/Rework

- **Method**: POST
- **Path**: api/v1/operation/mobile/cwo/Rework
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: POST api/v1/operation/mobile/cwo/Rework

#### Parameters
- **request** (`ReworkCWOCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/cwo/Transactions/{cwoId}

- **Method**: GET
- **Path**: api/v1/operation/mobile/cwo/Transactions/{cwoId}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: GET api/v1/operation/mobile/cwo/Transactions/{cwoId}

#### Parameters
- **cwoId** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/cwo/Options

- **Method**: GET
- **Path**: api/v1/operation/mobile/cwo/Options
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: GET api/v1/operation/mobile/cwo/Options

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/cwo/Component

- **Method**: GET
- **Path**: api/v1/operation/mobile/cwo/Component
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: GET api/v1/operation/mobile/cwo/Component

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/cwo/Supervisor

- **Method**: GET
- **Path**: api/v1/operation/mobile/cwo/Supervisor
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: GET api/v1/operation/mobile/cwo/Supervisor

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/cwo/SyncCWO

- **Method**: POST
- **Path**: api/v1/operation/mobile/cwo/SyncCWO
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/CWO/CWOController.cs`
- **Description**: POST api/v1/operation/mobile/cwo/SyncCWO

#### Parameters
- **command** (`UpsertCWOCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/Case/SyncCase

- **Method**: POST
- **Path**: api/v1/operation/mobile/Case/SyncCase
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Case/CaseController.cs`
- **Description**: POST api/v1/operation/mobile/Case/SyncCase

#### Parameters
- **command** (`UpsertCasesCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/Case/List

- **Method**: GET
- **Path**: api/v1/operation/mobile/Case/List
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Case/CaseController.cs`
- **Description**: GET api/v1/operation/mobile/Case/List

#### Parameters
- **query** (`GetCaseListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/Case/{id}

- **Method**: GET
- **Path**: api/v1/operation/mobile/Case/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Case/CaseController.cs`
- **Description**: GET api/v1/operation/mobile/Case/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/Case/CaseTasks/List

- **Method**: GET
- **Path**: api/v1/operation/mobile/Case/CaseTasks/List
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Case/CaseController.cs`
- **Description**: GET api/v1/operation/mobile/Case/CaseTasks/List

#### Parameters
- **query** (`GetCaseTasksListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/Case/CaseTasks/{id}

- **Method**: GET
- **Path**: api/v1/operation/mobile/Case/CaseTasks/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Case/CaseController.cs`
- **Description**: GET api/v1/operation/mobile/Case/CaseTasks/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/Case/CaseTask/Update

- **Method**: POST
- **Path**: api/v1/operation/mobile/Case/CaseTask/Update
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Case/CaseController.cs`
- **Description**: POST api/v1/operation/mobile/Case/CaseTask/Update

#### Parameters
- **command** (`UpdateTaskCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/Case/Create/Options

- **Method**: GET
- **Path**: api/v1/operation/mobile/Case/Create/Options
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Case/CaseController.cs`
- **Description**: GET api/v1/operation/mobile/Case/Create/Options

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/Case/Create/Location

- **Method**: GET
- **Path**: api/v1/operation/mobile/Case/Create/Location
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Case/CaseController.cs`
- **Description**: GET api/v1/operation/mobile/Case/Create/Location

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/Case/Adhoc/CreateMedia

- **Method**: POST
- **Path**: api/v1/operation/mobile/Case/Adhoc/CreateMedia
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Case/CaseController.cs`
- **Description**: POST api/v1/operation/mobile/Case/Adhoc/CreateMedia

#### Parameters
- **command** (`UploadMediaCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/document/Upload

- **Method**: POST
- **Path**: api/v1/operation/mobile/document/Upload
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Document/DocumentController.cs`
- **Description**: POST api/v1/operation/mobile/document/Upload

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/document/Upload/Video

- **Method**: POST
- **Path**: api/v1/operation/mobile/document/Upload/Video
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Document/DocumentController.cs`
- **Description**: POST api/v1/operation/mobile/document/Upload/Video

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/document/GetFiles/{objectType}

- **Method**: GET
- **Path**: api/v1/operation/mobile/document/GetFiles/{objectType}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Document/DocumentController.cs`
- **Description**: GET api/v1/operation/mobile/document/GetFiles/{objectType}

#### Parameters
- **objectType** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/document/GetFiles/{objectType}/{objectKey}

- **Method**: GET
- **Path**: api/v1/operation/mobile/document/GetFiles/{objectType}/{objectKey}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Document/DocumentController.cs`
- **Description**: GET api/v1/operation/mobile/document/GetFiles/{objectType}/{objectKey}

#### Parameters
- **objectType** (`string`) - Required
- **objectKey** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/document/GetImage/{id}

- **Method**: GET
- **Path**: api/v1/operation/mobile/document/GetImage/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Document/DocumentController.cs`
- **Description**: GET api/v1/operation/mobile/document/GetImage/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/guard-tour/Tasks

- **Method**: GET
- **Path**: api/v1/operation/mobile/guard-tour/Tasks
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/operation/mobile/guard-tour/Tasks

#### Parameters
- **id** (`string`) - Required
- **query** (`GetTaskListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/guard-tour/Task/{id}

- **Method**: GET
- **Path**: api/v1/operation/mobile/guard-tour/Task/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/operation/mobile/guard-tour/Task/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/operation/mobile/guard-tour/Task/status

- **Method**: PUT
- **Path**: api/v1/operation/mobile/guard-tour/Task/status
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/operation/mobile/guard-tour/Task/status

#### Parameters
- **command** (`UpdateTaskStatusCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/guard-tour/Subtasks

- **Method**: GET
- **Path**: api/v1/operation/mobile/guard-tour/Subtasks
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/GuardTour/GuardTourController.cs`
- **Description**: GET api/v1/operation/mobile/guard-tour/Subtasks

#### Parameters
- **query** (`GetSubtaskQuery`) - Optional

#### Responses
- **200**: Success response

---

### PUT api/v1/operation/mobile/guard-tour/Action/Status

- **Method**: PUT
- **Path**: api/v1/operation/mobile/guard-tour/Action/Status
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/operation/mobile/guard-tour/Action/Status

#### Parameters
- **command** (`UpdateStatusActionCommand`) - Required

#### Responses
- **200**: Success response

---

### PUT api/v1/operation/mobile/guard-tour/Subtask/Status

- **Method**: PUT
- **Path**: api/v1/operation/mobile/guard-tour/Subtask/Status
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/GuardTour/GuardTourController.cs`
- **Description**: PUT api/v1/operation/mobile/guard-tour/Subtask/Status

#### Parameters
- **command** (`UpdateStatusSubtaskCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/Supervisor

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/Supervisor
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/Supervisor

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/Technician

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/Technician
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/Technician

#### Parameters
- **query** (`TechnicianQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/CaseIncident/EventType

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/CaseIncident/EventType
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/CaseIncident/EventType

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/CaseIncident/Location

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/CaseIncident/Location
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/CaseIncident/Location

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/OpsAppRoles

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/OpsAppRoles
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/OpsAppRoles

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/Locations

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/Locations
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/Locations

#### Parameters
- **query** (`LocationsByTypeQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/Location

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/Location
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/Location

#### Parameters
- **query** (`LocationByRefIdQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/FunctionRoles

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/FunctionRoles
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/FunctionRoles

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/CWOTypes

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/CWOTypes
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/CWOTypes

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/PrombleTypes

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/PrombleTypes
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/PrombleTypes

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/Priority

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/Priority
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/Priority

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/Asset

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/Asset
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/Asset

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/ClientSite

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/ClientSite
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/ClientSite

#### Parameters
- **query** (`ClientSiteQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/masterdata/ClientSiteByMID

- **Method**: GET
- **Path**: api/v1/operation/mobile/masterdata/ClientSiteByMID
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/MasterData/MasterDataController.cs`
- **Description**: GET api/v1/operation/mobile/masterdata/ClientSiteByMID

#### Parameters
- **mid** (`Guid`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/notification/Announce

- **Method**: POST
- **Path**: api/v1/operation/mobile/notification/Announce
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Notification/NotificationController.cs`
- **Description**: POST api/v1/operation/mobile/notification/Announce

#### Parameters
- **request** (`SendAnnounceCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/notification/Send

- **Method**: POST
- **Path**: api/v1/operation/mobile/notification/Send
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Notification/NotificationController.cs`
- **Description**: POST api/v1/operation/mobile/notification/Send

#### Parameters
- **request** (`SendFCMNotiCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/notification/ReadNotification

- **Method**: POST
- **Path**: api/v1/operation/mobile/notification/ReadNotification
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Notification/NotificationController.cs`
- **Description**: POST api/v1/operation/mobile/notification/ReadNotification

#### Parameters
- **request** (`ReadNotificationCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/notification/{id}

- **Method**: GET
- **Path**: api/v1/operation/mobile/notification/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Notification/NotificationController.cs`
- **Description**: GET api/v1/operation/mobile/notification/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/notification/ChangeAppLangues

- **Method**: POST
- **Path**: api/v1/operation/mobile/notification/ChangeAppLangues
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Notification/NotificationController.cs`
- **Description**: POST api/v1/operation/mobile/notification/ChangeAppLangues

#### Parameters
- **req** (`ChangeLanguestDeviceCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/notification/Remove/{deviceid}

- **Method**: POST
- **Path**: api/v1/operation/mobile/notification/Remove/{deviceid}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Notification/NotificationController.cs`
- **Description**: POST api/v1/operation/mobile/notification/Remove/{deviceid}

#### Parameters
- **deviceid** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/notification/Remove/Device

- **Method**: POST
- **Path**: api/v1/operation/mobile/notification/Remove/Device
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/Notification/NotificationController.cs`
- **Description**: POST api/v1/operation/mobile/notification/Remove/Device

#### Parameters
- **request** (`RemoveDeviceAndTokenCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/ppm/Detail

- **Method**: GET
- **Path**: api/v1/operation/mobile/ppm/Detail
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: GET api/v1/operation/mobile/ppm/Detail

#### Parameters
- **id** (`int`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/ppm/Assign/Technician

- **Method**: POST
- **Path**: api/v1/operation/mobile/ppm/Assign/Technician
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: POST api/v1/operation/mobile/ppm/Assign/Technician

#### Parameters
- **request** (`AssignTechnicianPPMCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/ppm/Reject/Supervisor

- **Method**: POST
- **Path**: api/v1/operation/mobile/ppm/Reject/Supervisor
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: POST api/v1/operation/mobile/ppm/Reject/Supervisor

#### Parameters
- **request** (`RejectSupervisorPPMCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/ppm/Reject/Technician

- **Method**: POST
- **Path**: api/v1/operation/mobile/ppm/Reject/Technician
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: POST api/v1/operation/mobile/ppm/Reject/Technician

#### Parameters
- **request** (`RejectTechnicianPPMCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/ppm/Acknowledge

- **Method**: POST
- **Path**: api/v1/operation/mobile/ppm/Acknowledge
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: POST api/v1/operation/mobile/ppm/Acknowledge

#### Parameters
- **request** (`AcknowlegePPMCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/ppm/Task/Update

- **Method**: POST
- **Path**: api/v1/operation/mobile/ppm/Task/Update
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: POST api/v1/operation/mobile/ppm/Task/Update

#### Parameters
- **request** (`TaskUpdatePPMCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/ppm/Completed

- **Method**: POST
- **Path**: api/v1/operation/mobile/ppm/Completed
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: POST api/v1/operation/mobile/ppm/Completed

#### Parameters
- **request** (`CompletedPPMCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/ppm/Close

- **Method**: POST
- **Path**: api/v1/operation/mobile/ppm/Close
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: POST api/v1/operation/mobile/ppm/Close

#### Parameters
- **request** (`ClosePPMCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/ppm/Rework

- **Method**: POST
- **Path**: api/v1/operation/mobile/ppm/Rework
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: POST api/v1/operation/mobile/ppm/Rework

#### Parameters
- **request** (`ReworkPPMCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/ppm/Comment

- **Method**: GET
- **Path**: api/v1/operation/mobile/ppm/Comment
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: GET api/v1/operation/mobile/ppm/Comment

#### Parameters
- **id** (`int`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/ppm/Transaction

- **Method**: GET
- **Path**: api/v1/operation/mobile/ppm/Transaction
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: GET api/v1/operation/mobile/ppm/Transaction

#### Parameters
- **id** (`int`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/ppm/ConfirmCompleted

- **Method**: POST
- **Path**: api/v1/operation/mobile/ppm/ConfirmCompleted
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/PPM/PPMController.cs`
- **Description**: POST api/v1/operation/mobile/ppm/ConfirmCompleted

#### Parameters
- **request** (`ConfirmCompletePPMCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/SOC/Detail

- **Method**: GET
- **Path**: api/v1/operation/mobile/SOC/Detail
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/SOC/SOCController.cs`
- **Description**: GET api/v1/operation/mobile/SOC/Detail

#### Parameters
- **id** (`int`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/SOC/CaseIncidentList

- **Method**: GET
- **Path**: api/v1/operation/mobile/SOC/CaseIncidentList
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/SOC/SOCController.cs`
- **Description**: GET api/v1/operation/mobile/SOC/CaseIncidentList

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/SOC/CaseIncidentDetail/{id}

- **Method**: GET
- **Path**: api/v1/operation/mobile/SOC/CaseIncidentDetail/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/SOC/SOCController.cs`
- **Description**: GET api/v1/operation/mobile/SOC/CaseIncidentDetail/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/SOC/CreateCaseIncident

- **Method**: POST
- **Path**: api/v1/operation/mobile/SOC/CreateCaseIncident
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/SOC/SOCController.cs`
- **Description**: POST api/v1/operation/mobile/SOC/CreateCaseIncident

#### Parameters
- **data** (`CreateCaseIncidentCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/SOC/CaseIncident/{caseId}/Tasks

- **Method**: GET
- **Path**: api/v1/operation/mobile/SOC/CaseIncident/{caseId}/Tasks
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/SOC/SOCController.cs`
- **Description**: GET api/v1/operation/mobile/SOC/CaseIncident/{caseId}/Tasks

#### Parameters
- **caseId** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/SOC/CompleteTaskCaseIncident

- **Method**: POST
- **Path**: api/v1/operation/mobile/SOC/CompleteTaskCaseIncident
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/SOC/SOCController.cs`
- **Description**: POST api/v1/operation/mobile/SOC/CompleteTaskCaseIncident

#### Parameters
- **data** (`CompleteTaskCaseIncidentCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/SOC/UpdateTaskCaseIncident

- **Method**: POST
- **Path**: api/v1/operation/mobile/SOC/UpdateTaskCaseIncident
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/SOC/SOCController.cs`
- **Description**: POST api/v1/operation/mobile/SOC/UpdateTaskCaseIncident

#### Parameters
- **data** (`UpdateTaskCaseIncidentCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/user/profile

- **Method**: GET
- **Path**: api/v1/operation/mobile/user/profile
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: GET api/v1/operation/mobile/user/profile

#### Parameters
- **kcusername** (`string`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/user/Users

- **Method**: GET
- **Path**: api/v1/operation/mobile/user/Users
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: GET api/v1/operation/mobile/user/Users

#### Parameters
- **query** (`GetAllAccountQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/user/MozartSupTech

- **Method**: GET
- **Path**: api/v1/operation/mobile/user/MozartSupTech
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: GET api/v1/operation/mobile/user/MozartSupTech

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/user/AhocDataUserMozart

- **Method**: GET
- **Path**: api/v1/operation/mobile/user/AhocDataUserMozart
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: GET api/v1/operation/mobile/user/AhocDataUserMozart

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/user/Role

- **Method**: POST
- **Path**: api/v1/operation/mobile/user/Role
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: POST api/v1/operation/mobile/user/Role

#### Parameters
- **request** (`UpdateRoleOpsAppCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/user/OpsappPermission

- **Method**: GET
- **Path**: api/v1/operation/mobile/user/OpsappPermission
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: GET api/v1/operation/mobile/user/OpsappPermission

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/user/UpsertFCM

- **Method**: POST
- **Path**: api/v1/operation/mobile/user/UpsertFCM
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: POST api/v1/operation/mobile/user/UpsertFCM

#### Parameters
- **request** (`UpsertFCMCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/operation/mobile/user/UserClientSite

- **Method**: GET
- **Path**: api/v1/operation/mobile/user/UserClientSite
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: GET api/v1/operation/mobile/user/UserClientSite

#### Parameters
- **kcusername** (`string`) - Optional

#### Responses
- **200**: Success response

---

### PUT api/v1/operation/mobile/user/ChangePasswordByUser

- **Method**: PUT
- **Path**: api/v1/operation/mobile/user/ChangePasswordByUser
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: PUT api/v1/operation/mobile/user/ChangePasswordByUser

#### Parameters
- **command** (`ChangePasswordMBCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/user/UserClockIn

- **Method**: POST
- **Path**: api/v1/operation/mobile/user/UserClockIn
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: POST api/v1/operation/mobile/user/UserClockIn

#### Parameters
- **command** (`UserClockInCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/operation/mobile/user/UserClockOut

- **Method**: POST
- **Path**: api/v1/operation/mobile/user/UserClockOut
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/Mobile/User/UserController.cs`
- **Description**: POST api/v1/operation/mobile/user/UserClockOut

#### Parameters
- **command** (`UserClockOutCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/operation/v1/Work/AttendWork

- **Method**: POST
- **Path**: api/operation/v1/Work/AttendWork
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/OpApp/OpAppController.cs`
- **Description**: POST api/operation/v1/Work/AttendWork

#### Parameters
- **qrcode** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/operation/v1/Work/QRCODE/Generate

- **Method**: POST
- **Path**: api/operation/v1/Work/QRCODE/Generate
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/OpApp/OpAppController.cs`
- **Description**: POST api/operation/v1/Work/QRCODE/Generate

#### Parameters
- **data** (`GenerateQRCodeCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/operation/v1/Work/QRCODE

- **Method**: GET
- **Path**: api/operation/v1/Work/QRCODE
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/OpApp/OpAppController.cs`
- **Description**: GET api/operation/v1/Work/QRCODE

#### Responses
- **200**: Success response

---

### POST api/operation/v1/Work/QRScan/TimeCardEntries

- **Method**: POST
- **Path**: api/operation/v1/Work/QRScan/TimeCardEntries
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/OpApp/OpAppController.cs`
- **Description**: POST api/operation/v1/Work/QRScan/TimeCardEntries

#### Parameters
- **data** (`CheckTimeCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/ResetPasswordByAdmin/ResetPasswordToDefault

- **Method**: POST
- **Path**: api/v1/ResetPasswordByAdmin/ResetPasswordToDefault
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/ResetPassWordCMS/ResetPassWordCMSController.cs`
- **Description**: POST api/v1/ResetPasswordByAdmin/ResetPasswordToDefault

#### Parameters
- **command** (`ResetPasswordCMSCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/ActivityProcedureByTask/GetTaskActivity

- **Method**: GET
- **Path**: api/v1/ActivityProcedureByTask/GetTaskActivity
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/TaskActivityProcedure/TaskActivityProcedureController.cs`
- **Description**: GET api/v1/ActivityProcedureByTask/GetTaskActivity

#### Responses
- **200**: Success response

---

### POST api/v1/ActivityProcedureByTask/CreateActivityProcedure/ByTask

- **Method**: POST
- **Path**: api/v1/ActivityProcedureByTask/CreateActivityProcedure/ByTask
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/TaskActivityProcedure/TaskActivityProcedureController.cs`
- **Description**: POST api/v1/ActivityProcedureByTask/CreateActivityProcedure/ByTask

#### Responses
- **200**: Success response

---

### GET api/v1/usageMonitoring/Staff

- **Method**: GET
- **Path**: api/v1/usageMonitoring/Staff
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: GET api/v1/usageMonitoring/Staff

#### Parameters
- **data** (`GetStaffListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/usageMonitoring/Staff/{sfid}

- **Method**: GET
- **Path**: api/v1/usageMonitoring/Staff/{sfid}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: GET api/v1/usageMonitoring/Staff/{sfid}

#### Parameters
- **sfid** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/usageMonitoring/Staff/upsert

- **Method**: POST
- **Path**: api/v1/usageMonitoring/Staff/upsert
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: POST api/v1/usageMonitoring/Staff/upsert

#### Parameters
- **command** (`UpsertStaffCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/usageMonitoring/Staff/{sfid}

- **Method**: DELETE
- **Path**: api/v1/usageMonitoring/Staff/{sfid}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: DELETE api/v1/usageMonitoring/Staff/{sfid}

#### Parameters
- **sfid** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/usageMonitoring/EventsLog

- **Method**: GET
- **Path**: api/v1/usageMonitoring/EventsLog
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: GET api/v1/usageMonitoring/EventsLog

#### Parameters
- **max** (`int`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/usageMonitoring/Staff/Component

- **Method**: GET
- **Path**: api/v1/usageMonitoring/Staff/Component
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: GET api/v1/usageMonitoring/Staff/Component

#### Parameters
- **data** (`GetStaffByComponentQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/usageMonitoring/Roster

- **Method**: GET
- **Path**: api/v1/usageMonitoring/Roster
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: GET api/v1/usageMonitoring/Roster

#### Parameters
- **query** (`GetRosterListQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/usageMonitoring/Roster/Staff

- **Method**: GET
- **Path**: api/v1/usageMonitoring/Roster/Staff
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: GET api/v1/usageMonitoring/Roster/Staff

#### Parameters
- **query** (`GetRosterStaffQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/usageMonitoring/Roster/{roid}

- **Method**: GET
- **Path**: api/v1/usageMonitoring/Roster/{roid}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: GET api/v1/usageMonitoring/Roster/{roid}

#### Parameters
- **roid** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/usageMonitoring/Roster/upsert

- **Method**: POST
- **Path**: api/v1/usageMonitoring/Roster/upsert
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: POST api/v1/usageMonitoring/Roster/upsert

#### Parameters
- **command** (`UpsertRosterCommand`) - Required

#### Responses
- **200**: Success response

---

### DELETE api/v1/usageMonitoring/Roster/{id}

- **Method**: DELETE
- **Path**: api/v1/usageMonitoring/Roster/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: DELETE api/v1/usageMonitoring/Roster/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/usageMonitoring/Summary

- **Method**: GET
- **Path**: api/v1/usageMonitoring/Summary
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: GET api/v1/usageMonitoring/Summary

#### Parameters
- **query** (`SummaryQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/usageMonitoring/SyncSummary

- **Method**: GET
- **Path**: api/v1/usageMonitoring/SyncSummary
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Operation/UsageMonitoring/UsageMonitoringController.cs`
- **Description**: GET api/v1/usageMonitoring/SyncSummary

#### Parameters
- **query** (`SyncSummaryQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/operation/v1/report/Attendant

- **Method**: GET
- **Path**: api/operation/v1/report/Attendant
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Report/ReportController.cs`
- **Description**: GET api/operation/v1/report/Attendant

#### Parameters
- **query** (`GetReportAttendantQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/operation/v1/report/CheckInCheckOut

- **Method**: GET
- **Path**: api/operation/v1/report/CheckInCheckOut
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Report/ReportController.cs`
- **Description**: GET api/operation/v1/report/CheckInCheckOut

#### Parameters
- **query** (`GetReportCheckInCheckOutQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/operation/v1/report/GuardTour/TaskDetail

- **Method**: GET
- **Path**: api/operation/v1/report/GuardTour/TaskDetail
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Report/ReportController.cs`
- **Description**: GET api/operation/v1/report/GuardTour/TaskDetail

#### Parameters
- **query** (`TaskDetailReportQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/operation/v1/report/OperationOnBorad/Members

- **Method**: GET
- **Path**: api/operation/v1/report/OperationOnBorad/Members
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Report/ReportController.cs`
- **Description**: GET api/operation/v1/report/OperationOnBorad/Members

#### Parameters
- **query** (`OperationUserReportQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/SustainabilityMobile/GetContent

- **Method**: POST
- **Path**: api/v1/SustainabilityMobile/GetContent
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Mobile/SustainabilityMobileController.cs`
- **Description**: POST api/v1/SustainabilityMobile/GetContent

#### Responses
- **200**: Success response

---

### POST api/v1/SustainabilityMobile/GetContentDetail

- **Method**: POST
- **Path**: api/v1/SustainabilityMobile/GetContentDetail
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Mobile/SustainabilityMobileController.cs`
- **Description**: POST api/v1/SustainabilityMobile/GetContentDetail

#### Responses
- **200**: Success response

---

### POST api/v1/SustainabilityMobile/GetDigitalLibraryCategory

- **Method**: POST
- **Path**: api/v1/SustainabilityMobile/GetDigitalLibraryCategory
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Mobile/SustainabilityMobileController.cs`
- **Description**: POST api/v1/SustainabilityMobile/GetDigitalLibraryCategory

#### Responses
- **200**: Success response

---

### POST api/v1/SustainabilityMobile/GetDigitalLibraryFile

- **Method**: POST
- **Path**: api/v1/SustainabilityMobile/GetDigitalLibraryFile
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Mobile/SustainabilityMobileController.cs`
- **Description**: POST api/v1/SustainabilityMobile/GetDigitalLibraryFile

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/upload

- **Method**: POST
- **Path**: api/v1/Sustainability/upload
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/upload

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/Banner/Publish

- **Method**: POST
- **Path**: api/v1/Sustainability/Banner/Publish
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/Banner/Publish

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/GetBanner

- **Method**: POST
- **Path**: api/v1/Sustainability/GetBanner
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/GetBanner

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/DigitalLibrary/Delete

- **Method**: POST
- **Path**: api/v1/Sustainability/DigitalLibrary/Delete
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/DigitalLibrary/Delete

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/DigitalLibrary/Publish

- **Method**: POST
- **Path**: api/v1/Sustainability/DigitalLibrary/Publish
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/DigitalLibrary/Publish

#### Responses
- **200**: Success response

---

### GET api/v1/Sustainability/DigitalLibrary/{id}

- **Method**: GET
- **Path**: api/v1/Sustainability/DigitalLibrary/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: GET api/v1/Sustainability/DigitalLibrary/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Sustainability/DigitalLibrary

- **Method**: GET
- **Path**: api/v1/Sustainability/DigitalLibrary
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: GET api/v1/Sustainability/DigitalLibrary

#### Parameters
- **query** (`GetAllDigitalLibraryQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/ContentManagement/Delete

- **Method**: POST
- **Path**: api/v1/Sustainability/ContentManagement/Delete
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/ContentManagement/Delete

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/ContentManagement/Publish

- **Method**: POST
- **Path**: api/v1/Sustainability/ContentManagement/Publish
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/ContentManagement/Publish

#### Responses
- **200**: Success response

---

### GET api/v1/Sustainability/ContentManagement/{id}

- **Method**: GET
- **Path**: api/v1/Sustainability/ContentManagement/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: GET api/v1/Sustainability/ContentManagement/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Sustainability/ContentManagement

- **Method**: GET
- **Path**: api/v1/Sustainability/ContentManagement
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: GET api/v1/Sustainability/ContentManagement

#### Parameters
- **query** (`GetAllContentManagementQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/Sustainability/ChangeOrder

- **Method**: POST
- **Path**: api/v1/Sustainability/Sustainability/ChangeOrder
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/Sustainability/ChangeOrder

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/PRBannerManagement/Delete

- **Method**: POST
- **Path**: api/v1/Sustainability/PRBannerManagement/Delete
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/PRBannerManagement/Delete

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/PRBannerManagement/Publish

- **Method**: POST
- **Path**: api/v1/Sustainability/PRBannerManagement/Publish
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/PRBannerManagement/Publish

#### Responses
- **200**: Success response

---

### GET api/v1/Sustainability/PRBannerManagement/{id}

- **Method**: GET
- **Path**: api/v1/Sustainability/PRBannerManagement/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: GET api/v1/Sustainability/PRBannerManagement/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/Sustainability/PRBannerManagement

- **Method**: GET
- **Path**: api/v1/Sustainability/PRBannerManagement
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: GET api/v1/Sustainability/PRBannerManagement

#### Parameters
- **query** (`GetAllPRBannerManagementQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Sustainability/ContentManagement/MainMenu

- **Method**: GET
- **Path**: api/v1/Sustainability/ContentManagement/MainMenu
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: GET api/v1/Sustainability/ContentManagement/MainMenu

#### Parameters
- **query** (`MainContentManagementQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/Sustainability/PRBannerManagement/GetInitial

- **Method**: GET
- **Path**: api/v1/Sustainability/PRBannerManagement/GetInitial
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: GET api/v1/Sustainability/PRBannerManagement/GetInitial

#### Parameters
- **query** (`InitialPRBannerQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/Sustainability/Sustainability/SaveConfig

- **Method**: POST
- **Path**: api/v1/Sustainability/Sustainability/SaveConfig
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Sustainability/Web/SustainabilityController.cs`
- **Description**: POST api/v1/Sustainability/Sustainability/SaveConfig

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/CheckHeader

- **Method**: GET
- **Path**: api/v1/[controller]/CheckHeader
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Tools/ToolsController.cs`
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
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Tools/ToolsController.cs`
- **Description**: GET api/v1/[controller]/Health

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/Version

- **Method**: GET
- **Path**: api/v1/[controller]/Version
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Tools/ToolsController.cs`
- **Description**: GET api/v1/[controller]/Version

#### Responses
- **200**: Success response

---

### GET api/v1/[controller]/Environment

- **Method**: GET
- **Path**: api/v1/[controller]/Environment
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Tools/ToolsController.cs`
- **Description**: GET api/v1/[controller]/Environment

#### Responses
- **200**: Success response

---

### GET api/v1/urgent/event

- **Method**: GET
- **Path**: api/v1/urgent/event
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Urgent/UrgentController.cs`
- **Description**: GET api/v1/urgent/event

#### Parameters
- **data** (`SREventQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/urgent/event

- **Method**: POST
- **Path**: api/v1/urgent/event
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Urgent/UrgentController.cs`
- **Description**: POST api/v1/urgent/event

#### Parameters
- **command** (`EventCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/urgent/problem

- **Method**: GET
- **Path**: api/v1/urgent/problem
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Urgent/UrgentController.cs`
- **Description**: GET api/v1/urgent/problem

#### Parameters
- **data** (`ProblemQuery`) - Optional

#### Responses
- **200**: Success response

---

### POST api/v1/urgent/problem

- **Method**: POST
- **Path**: api/v1/urgent/problem
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Urgent/UrgentController.cs`
- **Description**: POST api/v1/urgent/problem

#### Parameters
- **command** (`ProblemCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/urgent/service-request

- **Method**: GET
- **Path**: api/v1/urgent/service-request
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Urgent/UrgentController.cs`
- **Description**: GET api/v1/urgent/service-request

#### Parameters
- **data** (`ServiceRequestQuery`) - Optional

#### Responses
- **200**: Success response

---

### GET api/v1/urgent/service-request/{id}

- **Method**: GET
- **Path**: api/v1/urgent/service-request/{id}
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Urgent/UrgentController.cs`
- **Description**: GET api/v1/urgent/service-request/{id}

#### Parameters
- **id** (`string`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/urgent/service-request/upsert

- **Method**: POST
- **Path**: api/v1/urgent/service-request/upsert
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Urgent/UrgentController.cs`
- **Description**: POST api/v1/urgent/service-request/upsert

#### Parameters
- **command** (`UpsertServiceRequestCommand`) - Required

#### Responses
- **200**: Success response

---

### POST api/v1/urgent/Upload

- **Method**: POST
- **Path**: api/v1/urgent/Upload
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Urgent/UrgentController.cs`
- **Description**: POST api/v1/urgent/Upload

#### Responses
- **200**: Success response

---

### POST api/v1/urgent/Upload-multiple

- **Method**: POST
- **Path**: api/v1/urgent/Upload-multiple
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Urgent/UrgentController.cs`
- **Description**: POST api/v1/urgent/Upload-multiple

#### Parameters
- **command** (`UploadMultipleCommand`) - Required

#### Responses
- **200**: Success response

---

### GET api/v1/urgent/location

- **Method**: GET
- **Path**: api/v1/urgent/location
- **Function**: `undefined`
- **File**: `TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Controllers/Urgent/UrgentController.cs`
- **Description**: GET api/v1/urgent/location

#### Responses
- **200**: Success response

---



## Data Schemas



## External Dependencies

### Python Packages
- **Autofac** (8.0.0)
- **Autofac.Extensions.DependencyInjection** (9.0.0)
- **MediatR** (12.2.0)
- **Microsoft.AspNetCore.Authentication.JwtBearer** (8.0.1)
- **Microsoft.VisualStudio.Azure.Containers.Tools.Targets** (1.19.5)
- **Npgsql.EntityFrameworkCore.PostgreSQL** (8.0.3)
- **Serilog.AspNetCore** (8.0.1)
- **Serilog.Expressions** (4.0.0)
- **Serilog.Sinks.Http** (8.0.0)
- **Serilog.Sinks.Seq** (6.0.0)
- **Swashbuckle.AspNetCore** (6.5.0)
- **Swashbuckle.AspNetCore.Annotations** (6.5.0)
- **System.IdentityModel.Tokens.Jwt** (7.2.0)
- **AWSSDK.Extensions.NETCore.Setup** (3.7.300)
- **AWSSDK.SimpleEmail** (3.7.300.52)
- **DotNetCore.NPOI** (1.2.3)
- **FirebaseAdmin** (3.1.0)
- **FluentValidation** (11.9.0)
- **MailKit** (4.3.0)
- **Microsoft.AspNetCore.Http** (2.2.2)
- **Microsoft.EntityFrameworkCore** (8.0.1)
- **Microsoft.EntityFrameworkCore.DynamicLinq** (8.3.10)
- **MimeKit** (4.3.0)
- **Refit** (7.0.0)
- **System.IdentityModel.Tokens.Jwt** (7.2.0)
- **System.Linq.Dynamic.Core** (1.3.10)
- **MediatR** (12.2.0)
- **Autofac.Extensions.DependencyInjection** (9.0.0)
- **EFCore.NamingConventions** (8.0.3)
- **Microsoft.EntityFrameworkCore** (8.0.1)
- **Microsoft.Extensions.Caching.StackExchangeRedis** (8.0.10)
- **Microsoft.Extensions.Configuration.Abstractions** (8.0.0)
- **Minio** (6.0.1)
- **Npgsql.EntityFrameworkCore.PostgreSQL** (8.0.0)
- **Refit** (7.0.0)
- **Refit.HttpClientFactory** (7.0.0)
- **Refit.Newtonsoft.Json** (7.0.0)
- **Microsoft.EntityFrameworkCore** (8.0.1)
- **Microsoft.EntityFrameworkCore.InMemory** (8.0.1)
- **Microsoft.NET.Test.Sdk** (17.8.0)
- **Moq** (4.20.70)
- **NUnit** (4.0.1)
- **NUnit3TestAdapter** (4.5.0)
- **coverlet.collector** (6.0.0)


### External APIs


## Summary

- ✅ **Total Endpoints**: 306
- ✅ **HTTP Methods**: GET, POST, PUT, DELETE
- ✅ **Authentication**: No
- ✅ **Documentation**: Yes
- ✅ **Schemas**: 0
- ✅ **Dependencies**: 44

---

*Generated by API Documentation and Inventory System - 7/23/2025* 