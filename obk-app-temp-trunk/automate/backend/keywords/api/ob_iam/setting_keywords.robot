*** Settings ***
# Resource    ${CURDIR}/fx_get_transaction_info_keywords.robot
# Resource    ${CURDIR}/fx_confirm_keywords.robot
# Resource    ${CURDIR}/fx_calculate_keywords.robot
# Variables   ${CURDIR}../../../../resources/testdata/${env}/fx_exchange_testdata.yaml
# Resource    ${CURDIR}../../resources/imports.robot
Resource    ${CURDIR}/../../database/ob_iam/ob_iam_db_keywords.robot

*** Keywords ***
Update 2 factor authen
    [Arguments]   ${source_identifier}  ${value}    ${token}
    ${header}=    Get header  ${source_identifier}  ${token}
    ${body}=    Create Dictionary    two_factor_authentication_enabled=${value}
    create Session  ob_iam_update_2_fa  ${ob_iam_host}    disable_warnings=1
    ${response}=  PUT On Session  ob_iam_update_2_fa  ${ob_iam_setting_url}      json=${body}        headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_update_2fa_response}    ${response}