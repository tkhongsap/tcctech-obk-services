# API Inventory: {{SERVICE_NAME}}

## Service Overview

- **Service Name**: {{SERVICE_NAME}}
- **Framework**: {{FRAMEWORK}}
- **Language**: {{LANGUAGE}}
- **Analysis Date**: {{ANALYSIS_DATE}}
- **Total Endpoints**: {{TOTAL_ENDPOINTS}}

## Technology Stack

- **Framework**: {{FRAMEWORK}} {{FRAMEWORK_VERSION}}
- **Language**: {{LANGUAGE}}
- **Dependencies**: {{TOTAL_DEPENDENCIES}} packages
- **External APIs**: {{EXTERNAL_API_COUNT}}

## API Endpoints

{{#ENDPOINTS}}
### {{METHOD}} {{PATH}}

- **Method**: {{METHOD}}
- **Path**: {{PATH}}
- **Function**: `{{FUNCTION_NAME}}`
- **File**: `{{FILE}}`
- **Description**: {{DESCRIPTION}}

{{#PARAMETERS}}
#### Parameters
{{#PARAM_LIST}}
- **{{PARAM_NAME}}** ({{PARAM_TYPE}}) - {{PARAM_REQUIRED}} - {{PARAM_DESCRIPTION}}
{{/PARAM_LIST}}
{{/PARAMETERS}}

{{#RESPONSES}}
#### Responses
{{#RESPONSE_LIST}}
- **{{STATUS_CODE}}**: {{RESPONSE_DESCRIPTION}}
  ```json
  {{RESPONSE_EXAMPLE}}
  ```
{{/RESPONSE_LIST}}
{{/RESPONSES}}

{{#AUTHENTICATION}}
#### Authentication
- **Type**: {{AUTH_TYPE}}
- **Description**: {{AUTH_DESCRIPTION}}
{{/AUTHENTICATION}}

---

{{/ENDPOINTS}}

## Data Schemas

{{#SCHEMAS}}
### {{SCHEMA_NAME}}

{{#SCHEMA_DESCRIPTION}}
**Description**: {{SCHEMA_DESCRIPTION}}
{{/SCHEMA_DESCRIPTION}}

**File**: `{{SCHEMA_FILE}}`

#### Fields
{{#SCHEMA_FIELDS}}
- **{{FIELD_NAME}}** (`{{FIELD_TYPE}}`) - {{FIELD_REQUIRED}}{{#FIELD_DEFAULT}} - Default: `{{FIELD_DEFAULT}}`{{/FIELD_DEFAULT}}
{{/SCHEMA_FIELDS}}

---

{{/SCHEMAS}}

## External Dependencies

### Python Packages
{{#PYTHON_PACKAGES}}
- **{{PACKAGE_NAME}}** ({{PACKAGE_VERSION}})
{{/PYTHON_PACKAGES}}

### External APIs
{{#EXTERNAL_APIS}}
- **{{API_METHOD}} {{API_URL}}** - Used in `{{API_FILE}}`
{{/EXTERNAL_APIS}}

## Summary

- ✅ **Total Endpoints**: {{TOTAL_ENDPOINTS}}
- ✅ **HTTP Methods**: {{HTTP_METHODS}}
- ✅ **Authentication**: {{HAS_AUTHENTICATION}}
- ✅ **Documentation**: {{HAS_DOCUMENTATION}}
- ✅ **Schemas**: {{TOTAL_SCHEMAS}}
- ✅ **Dependencies**: {{TOTAL_DEPENDENCIES}}

---

*Generated by API Documentation and Inventory System - {{ANALYSIS_DATE}}* 