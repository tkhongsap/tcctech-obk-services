*** Settings ***
# Resource    ${CURDIR}/fx_get_transaction_info_keywords.robot
# Resource    ${CURDIR}/fx_confirm_keywords.robot
# Resource    ${CURDIR}/fx_calculate_keywords.robot
# Variables   ${CURDIR}../../../../resources/testdata/${env}/fx_exchange_testdata.yaml
# Resource    ${CURDIR}../../resources/imports.robot
Resource    ${CURDIR}/../../database/ob_iam/ob_iam_db_keywords.robot

*** Keywords ***

Prepare account internal
    [Arguments]     ${identifier}
    ${profile}=     Prepare profile     rungwat   naksuwan   1994-11-09T07:11:48.097Z
    ${identities}=      Prepare internal identity  ${identifier}    email
    Register account    ${identities}  ${profile}   vincent1234
    HTTP status should be  200  ${ob_iam_register_response}
    ${token}=   Validate register response

Prepare account external
    [Arguments]     ${identifier}   ${provider_type}
    ${profile}=     Prepare profile     rungwat   naksuwan   1994-11-09T07:11:48.097Z
    ${identities}=      Prepare external identity  ${identifier}    sso    1234   ${provider_type}
    Register account    ${identities}  ${profile}   ${Empty}
    HTTP status should be  200  ${ob_iam_register_response}
    ${token}=   Validate register response

Prepare profile
    [Arguments]     ${firstname}    ${lastname}   ${dob}
    ${profile}=     Create Dictionary   first_name=${firstname}     last_name=${lastname}     gender=prefernottosay  dob=${dob}
    [Return]    ${profile}

Prepare external identity
    [Arguments]     ${identifier}   ${provider}     ${uid}      ${provider_type}
    ${identities}    Create List
    ${metaObj}=     Create Dictionary   
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}    uid=${uid}      provider_type=${provider_type}      meta=${metaObj}
    Append To List  ${identities}    ${identity}
    [Return]    ${identities}

Prepare internal identity
    [Arguments]     ${identifier}   ${provider}
    ${identities}    Create List
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}
    Append To List  ${identities}    ${identity}
    [Return]    ${identities}

Register account
    [Arguments]   ${identities}   ${profile}    ${password}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${body}=      Create Dictionary   identities=${identities}    profile=${profile}    password=${password}
    create Session  ob_iam_register  ${ob_iam_host}    disable_warnings=1
    ${response}=  POST On Session  ob_iam_register  ${ob_iam_register_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_register_response}    ${response}

Validate register response
    ${token}=   Set Variable    ${json_response["data"]["token"]["value"]}
    Should Not Be Empty     ${token}
    [Return]    ${token}

Signin sso
    [Arguments]     ${identifier}   ${provider}     ${type}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}  type=${type}
    ${body}=      Create Dictionary   identity=${identity}
    create Session  ob_iam_signin_sso  ${ob_iam_host}    disable_warnings=1
    ${response}=  POST On Session  ob_iam_signin_sso  ${ob_iam_signin_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_register_response}    ${response}

Signin password
    [Arguments]     ${identifier}   ${provider}     ${password}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}
    ${body}=      Create Dictionary   identity=${identity}  password=${password}
    create Session  ob_iam_signin_sso  ${ob_iam_host}    disable_warnings=1
    ${response}=  POST On Session  ob_iam_signin_sso  ${ob_iam_signin_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_register_response}    ${response}

Signin password with 2fa
    [Arguments]     ${identifier}   ${provider}     ${password}     ${id}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}
    ${otp}=     Create Dictionary   id=${id}
    ${body}=      Create Dictionary   identity=${identity}  password=${password}    otp=${otp}
    create Session  ob_iam_signin_sso  ${ob_iam_host}    disable_warnings=1
    ${response}=  POST On Session  ob_iam_signin_sso  ${ob_iam_signin_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_register_response}    ${response}

Signin sso with 2fa
    [Arguments]     ${identifier}   ${provider}     ${type}     ${id}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}  type=${type}
    ${otp}=     Create Dictionary   id=${id}
    ${body}=      Create Dictionary   identity=${identity}      otp=${otp}
    create Session  ob_iam_signin_sso  ${ob_iam_host}    disable_warnings=1
    ${response}=  POST On Session  ob_iam_signin_sso  ${ob_iam_signin_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_2fa_response}    ${response}

Reactivate sso account
    [Arguments]     ${identifier}   ${provider}     ${type}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}  type=${type}
    ${body}=      Create Dictionary   identity=${identity}     
    create Session  ob_iam_reactivate_sso  ${ob_iam_host}    disable_warnings=1
    ${response}=  PUT On Session  ob_iam_reactivate_sso  ${ob_iam_reactivate_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_reactivate_response}    ${response}

Reactivate sso account with 2fa
    [Arguments]     ${identifier}   ${provider}     ${type}     ${id}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}  type=${type}
    ${otp}=         Create Dictionary   id=${id}
    ${body}=      Create Dictionary   identity=${identity}     otp=${otp}
    create Session  ob_iam_reactivate_sso  ${ob_iam_host}    disable_warnings=1
    ${response}=  PUT On Session  ob_iam_reactivate_sso  ${ob_iam_reactivate_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_reactivate_response}    ${response}

Reactivate internal account
    [Arguments]     ${identifier}   ${provider}     ${password}
    ${header}=    Create Dictionary    Content-Type=application/json
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}
    ${body}=      Create Dictionary   identity=${identity}  password=${password}
    create Session  ob_iam_reactivate  ${ob_iam_host}    disable_warnings=1
    ${response}=  PUT On Session  ob_iam_reactivate  ${ob_iam_reactivate_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_reactivate_response}    ${response}

Prepare external account with 2fa
    [Arguments]     ${sso_account}     ${sso_type}  ${2fa_account}  ${2fa_type}
    Prepare account external     ${sso_account}     ${sso_type}
    Link External Identity    ${sso_account}  ${sso_type}  uid
    HTTP status should be    200    ${ob_iam_link_sso_response}
    Validate link external identity     True
    Signin sso   ${sso_account}  sso  ${sso_type}
    HTTP status should be    200    ${ob_iam_register_response}
    Request otp     ${2fa_account}  ${2fa_type}
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    Create identity      ${sso_account}     ${2fa_account}  ${2fa_type}     ${json_response["data"]["otp"]["id"]}   ${ob_iam_register_response.json()["data"]["token"]["value"]}
    HTTP status should be    200    ${ob_iam_create_identity_response}
    Update 2 factor authen   ${sso_account}  ${true}    ${ob_iam_register_response.json()["data"]["token"]["value"]}
    HTTP status should be    200    ${ob_iam_update_2fa_response}

Signin sso with 2fa auto
    [Arguments]     ${sso_account}     ${sso_type}  ${2fa_account}  ${2fa_type}
    Signin sso  ${sso_account}  sso  ${sso_type}
    HTTP status should be    200    ${ob_iam_register_response}
    Request otp     ${2fa_account}  ${2fa_type}
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    Signin sso with 2fa  ${sso_account}  sso  ${sso_type}   ${json_response["data"]["otp"]["id"]}

Reset password without 2fa
    [Arguments]     ${identifier}   ${provider}     ${password}     ${id}  
    ${header}=    Create Dictionary    Content-Type=application/json
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}  otp=${id}
    ${body}=      Create Dictionary   identity=${identity}  hashedPassword=${password}
    create Session  ob_iam_reset_password  ${ob_iam_host}    disable_warnings=1
    ${response}=  PUT On Session  ob_iam_reset_password  ${ob_iam_reset_password_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_reset_password_response}    ${response}

Reset password with 2fa
    [Arguments]     ${identifier}   ${provider}     ${password}     ${first_otp}    ${second_otp}  
    ${header}=    Create Dictionary    Content-Type=application/json
    ${identity}=      Create Dictionary   identifier=${identifier}    provider=${provider}  otp=${first_otp}
    ${otp}=       Create Dictionary     id=${second_otp}
    ${body}=      Create Dictionary   identity=${identity}  hashedPassword=${password}  otp=${otp}
    create Session  ob_iam_reset_password  ${ob_iam_host}    disable_warnings=1
    ${response}=  PUT On Session  ob_iam_reset_password  ${ob_iam_reset_password_url}      json=${body}       headers=${header}    expected_status=any
    Set Test Variable    ${ob_iam_reset_password_response}    ${response}