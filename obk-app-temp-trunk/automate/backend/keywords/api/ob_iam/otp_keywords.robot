*** Settings ***
# Resource    ${CURDIR}/fx_get_transaction_info_keywords.robot
# Resource    ${CURDIR}/fx_confirm_keywords.robot
# Resource    ${CURDIR}/fx_calculate_keywords.robot
# Variables   ${CURDIR}../../../../resources/testdata/${env}/fx_exchange_testdata.yaml
# Resource    ${CURDIR}../../resources/imports.robot
Resource    ${CURDIR}/../../database/ob_iam/ob_iam_db_keywords.robot

*** Keywords ***
Request otp
    [Arguments]   ${identifier}   ${provider}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${identity}=    Create Dictionary   identifier=${identifier}    provider=${provider}
    ${body}=    Create Dictionary    identity=${identity}
    create Session  ob_iam_request_otp  ${ob_iam_host}    disable_warnings=1
    ${response}=  POST On Session  ob_iam_request_otp  ${ob_iam_request_otp_url}      json=${body}        headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_request_otp_response}    ${response}

Verify response from request otp with database
    [Arguments]     ${ob_iam_request_otp_response}
    Query otp reference from database  ${ob_iam_request_otp_response["data"]["otp"]["reference"]}
    Run Keyword If  "${result}" != "None"   Should Be Equal As Strings  ${result[0][0]}    ${ob_iam_request_otp_response["data"]["otp"]["reference"]}

Validate otp
    [Arguments]   ${ob_iam_request_otp_response}   ${code}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${otp}=     Create Dictionary   code=${code}   reference=${ob_iam_request_otp_response["data"]["otp"]["reference"]}
    ${body}=    Create Dictionary   otp=${otp}
    create Session  ob_iam_validate_otp  ${ob_iam_host}    disable_warnings=1
    ${response}=  POST On Session  ob_iam_validate_otp  ${ob_iam_validate_otp_url}      json=${body}        headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_validate_otp_response}    ${response}

Verify response from validate otp with database
    [Arguments]     ${ob_iam_validate_otp_response}
    Query otp id from database  ${ob_iam_validate_otp_response["data"]["otp"]["id"]}
    Run Keyword If  "${result}" != "None"   Should Be Equal As Strings  ${result[0][0]}    ${ob_iam_validate_otp_response["data"]["otp"]["id"]}