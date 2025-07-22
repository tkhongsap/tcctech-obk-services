*** Settings ***
# Resource    ${CURDIR}/fx_get_transaction_info_keywords.robot
# Resource    ${CURDIR}/fx_confirm_keywords.robot
# Resource    ${CURDIR}/fx_calculate_keywords.robot
# Variables   ${CURDIR}../../../../resources/testdata/${env}/fx_exchange_testdata.yaml
# Resource    ${CURDIR}../../resources/imports.robot
Resource    ${CURDIR}/../../database/ob_iam/ob_iam_db_keywords.robot

*** Keywords ***
Link External Identity
    [Arguments]   ${identifier}   ${provider}   ${uid}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${meta}=   Create Dictionary
    ${body}=      Create Dictionary   identifier=${identifier}    provider_type=${provider}     uid=${uid}     meta=${meta}
    create Session  ob_iam_link_external_identity  ${ob_iam_host}    disable_warnings=1
    ${response}=  POST On Session  ob_iam_link_external_identity  ${ob_iam_link_external_identity_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_link_sso_response}    ${response}

Validate link external identity
    [Arguments]    ${expected_result}
    Should Be Equal As Strings   ${json_response["data"]["result"]}  ${expected_result}