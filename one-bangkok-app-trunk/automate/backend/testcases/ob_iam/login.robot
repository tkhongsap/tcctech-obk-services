*** Settings ***
Documentation  API Testing in Robot Framework
Resource    ${CURDIR}/../../resources/imports.robot
Resource    ${CURDIR}/../../keywords/api/ob_iam/otp_keywords.robot
Resource    ${CURDIR}/../../keywords/api/ob_iam/login_keywords.robot
Resource    ${CURDIR}/../../keywords/common/common_keywords.robot
Resource    ${CURDIR}/../../keywords/database/ob_iam/ob_iam_db_keywords.robot


# Resource    ${CURDIR}/../../../keywords/api/fx_exchange/fx_get_account_info_keywords.robot
Variables   ${CURDIR}/../../resources/testdata/${env}/ob_iam_testdata.yaml
Force tags    ob-iam

*** Test Cases ***

TC001 To verify request POST: API should be login successfully
    [documentation]  To verify login
    Request otp     967505222  phone
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Verify response from request otp with database      ${json_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    Verify response from validate otp with database     ${json_response}
    Login  967505222  phone  ${json_response["data"]["otp"]["id"]}
    HTTP status should be    200    ${ob_iam_login_response}
    Verify response from login with database     ${json_response}
    [TearDown]  Run Keywords   Delete reference from database    ${ob_iam_request_otp_response.json()["data"]["otp"]["reference"]}
    ...     AND     Delete token from database  ${json_response["data"]["token"]["token"]}

TC002 To verify request POST: API should be login failed
    [documentation]  To verify login
    Request otp     +66967505222  phone
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Verify response from request otp with database      ${json_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    Verify response from validate otp with database     ${json_response}
    Login  +66967505222  phone  ${json_response["data"]["otp"]["id"]}
    HTTP status should be    401    ${ob_iam_login_response}
    Error message should be return correctly    ${ob_iam.login.error.login_failed_code}    ${ob_iam.login.error.login_failed_message}
    [TearDown]  Delete reference from database    ${ob_iam_request_otp_response.json()["data"]["otp"]["reference"]}
