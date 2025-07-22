*** Settings ***
# Resource    ${CURDIR}/fx_get_transaction_info_keywords.robot
# Resource    ${CURDIR}/fx_confirm_keywords.robot
# Resource    ${CURDIR}/fx_calculate_keywords.robot
# Variables   ${CURDIR}../../../../resources/testdata/${env}/fx_exchange_testdata.yaml
# Resource    ${CURDIR}../../resources/imports.robot
Resource    ${CURDIR}/../../database/ob_iam/ob_iam_db_keywords.robot

*** Keywords ***
Create identity
    [Arguments]   ${source_identifier}      ${identifier}   ${provider}   ${otp}    ${token}
    ${header}=    Get header  ${source_identifier}  ${token}
    ${identity}=    Create Dictionary   identifier=${identifier}    provider=${provider}    default=${true}
    ${otp}=     Create Dictionary   id=${otp}
    ${body}=    Create Dictionary    identity=${identity}   otp=${otp}
    create Session  ob_iam_create_identity  ${ob_iam_host}    disable_warnings=1
    ${response}=  POST On Session  ob_iam_create_identity  ${ob_iam_identity_url}      json=${body}        headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_create_identity_response}    ${response}