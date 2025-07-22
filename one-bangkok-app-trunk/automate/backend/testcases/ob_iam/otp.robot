

*** Settings ***
Documentation  API Testing in Robot Framework
Resource    ${CURDIR}/../../resources/imports.robot
Resource    ${CURDIR}/../../keywords/api/ob_iam/otp_keywords.robot
Resource    ${CURDIR}/../../keywords/common/common_keywords.robot
Resource    ${CURDIR}/../../keywords/database/ob_iam/ob_iam_db_keywords.robot


# Resource    ${CURDIR}/../../../keywords/api/fx_exchange/fx_get_account_info_keywords.robot
Variables   ${CURDIR}/../../resources/testdata/${env}/ob_iam_testdata.yaml
Force tags    ob-iam

*** Test Cases ***
TC001 To verify request POST: API should be request otp successfully
    [documentation]  To verify request otp
    Request otp     +66967505222  phone
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Verify response from request otp with database      ${json_response}
    [TearDown]   Delete reference from database    ${json_response["data"]["otp"]["reference"]}

TC002 To verify request POST: API should be request otp unsucessfully when senfing wrong provider type
    [documentation]  To verify request otp unsuccess
    Request otp     +66967505222  phones
    HTTP status should be    500    ${ob_iam_request_otp_response}
    Error message should be return correctly    ${ob_iam.otp.error.wrong_provider_code}    ${ob_iam.otp.error.wrong_provider_message}

TC003 To verify request POST: API should be validate otp successfully 
    [documentation]  To verify validate otp
    Request otp     +66967505222  phone
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Verify response from request otp with database      ${json_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    Verify response from validate otp with database     ${json_response}
    [TearDown]   Delete reference from database    ${ob_iam_request_otp_response.json()["data"]["otp"]["reference"]}

TC004 To verify request POST: API should be validate otp unsuccessfull because wrong code 
    [documentation]  To verify validate otp
    Request otp     +66967505222  phone
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Verify response from request otp with database      ${json_response}
    Validate otp    ${json_response}    000001
    HTTP status should be    500    ${ob_iam_validate_otp_response}
    Error message should be return correctly    ${ob_iam.otp.error.wrong_verify_otp_code}    ${ob_iam.otp.error.wrong_verify_otp_message}
    [TearDown]   Delete reference from database    ${ob_iam_request_otp_response.json()["data"]["otp"]["reference"]}
