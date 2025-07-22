*** Settings ***
# Resource    ${CURDIR}/fx_get_transaction_info_keywords.robot
# Resource    ${CURDIR}/fx_confirm_keywords.robot
# Resource    ${CURDIR}/fx_calculate_keywords.robot
# Variables   ${CURDIR}../../../../resources/testdata/${env}/fx_exchange_testdata.yaml
# Resource    ${CURDIR}../../resources/imports.robot
Resource    ${CURDIR}/../../database/ob_iam/ob_iam_db_keywords.robot

*** Keywords ***
Delete account
    [Arguments]   ${identifier}   ${token}
    ${header}=    Get header  ${identifier}  ${token}
    create Session  ob_iam_delete_account  ${ob_iam_host}    disable_warnings=1
    ${response}=  DELETE On Session  ob_iam_delete_account  ${ob_iam_account}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_delete_account_response}    ${response}
