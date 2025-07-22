*** Settings ***
Documentation  API Testing in Robot Framework
Resource    ${CURDIR}/../../resources/imports.robot
Resource    ${CURDIR}/../../keywords/api/ob_iam/otp_keywords.robot
Resource    ${CURDIR}/../../keywords/api/ob_iam/login_keywords.robot
Resource    ${CURDIR}/../../keywords/api/ob_iam/external_identity_keywords.robot
Resource    ${CURDIR}/../../keywords/api/ob_iam/auth_keywords.robot
Resource    ${CURDIR}/../../keywords/api/ob_iam/identity_keywords.robot
Resource    ${CURDIR}/../../keywords/api/ob_iam/setting_keywords.robot
Resource    ${CURDIR}/../../keywords/api/ob_iam/account_keywords.robot
Resource    ${CURDIR}/../../keywords/common/common_keywords.robot
Resource    ${CURDIR}/../../keywords/database/ob_iam/ob_iam_db_keywords.robot


# Resource    ${CURDIR}/../../../keywords/api/fx_exchange/fx_get_account_info_keywords.robot
Variables   ${CURDIR}/../../resources/testdata/${env}/ob_iam_testdata.yaml
Force tags    ob-iam

*** Test Cases ***

TC001 Register with sso
    [documentation]  To Register account with sso
    Link External Identity   rungwat.n@gmail.com  apple  uid
    HTTP status should be    200    ${ob_iam_link_sso_response}
    Validate link external identity     False
    ${profile}=     Prepare profile     rungwat   naksuwan   1994-11-09T07:11:48.097Z
    ${identities}=      Prepare external identity  rungwat.n@gmail.com  sso  123  google
    Register account    ${identities}  ${profile}   ${Empty}
    HTTP status should be  200  ${ob_iam_register_response}
    ${token}=   Validate register response
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC002 Link sso without internal identity
    [documentation]  Link sso without internal identity result is false then go to sign up flow
    Prepare account internal  rungwat.n@gmail.com
    Link External Identity   rungwat.nak@mtel.com  apple  uid
    HTTP status should be    200    ${ob_iam_link_sso_response}
    Validate link external identity     False
    # not add external identity 
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC003 Link sso with internal identity
    [documentation]  Link sso without internal identity result is true link account
    Prepare account internal  rungwat.n@gmail.com
    Link External Identity   rungwat.n@gmail.com  apple  uid
    HTTP status should be    200    ${ob_iam_link_sso_response}
    Validate link external identity     True
    # add external identity
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC004 Link sso with internal indentity and external identity - not same external identity
    [documentation]  Link sso with internal and external identity result is true link account
    Prepare account external    rungwat.n@gmail.com     google
    Prepare account internal    rungwat.nak@mtel.co.th
    Link External Identity   rungwat.nak@mtel.co.th  apple  uid
    HTTP status should be    200    ${ob_iam_link_sso_response}
    Validate link external identity     True
    # add external identity
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND     Delete account from database    rungwat.nak@mtel.co.th
    ...     AND  Delete otp from database   +66967505222

TC005 Link sso with external identity - same external identity
    [documentation]  Link sso with internal and external identity same external identity result is true
    Prepare account external    rungwat.n@gmail.com     google
    Link External Identity   rungwat.n@gmail.com  google  uid
    HTTP status should be    200    ${ob_iam_link_sso_response}
    Validate link external identity     True
    # Not add external identity
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC006 Signin with sso success
    [documentation]  Signin with sso success
    Prepare account external    rungwat.n@gmail.com     google
    Link External Identity   rungwat.n@gmail.com  google  uid
    HTTP status should be    200    ${ob_iam_link_sso_response}
    Validate link external identity     True
    Signin sso  rungwat.n@gmail.com  sso  google
    HTTP status should be    200    ${ob_iam_register_response}
    ${token}=   Validate register response
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC007 Signin with sso not success
    [documentation]  Signin with sso not success
    Prepare account internal  rungwat.n@gmail.com
    Signin sso  rungwat.n@gmail.com  sso  google
    HTTP status should be    401    ${ob_iam_register_response}
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC008 Signin with password success
    [documentation]  Signin with email success
    Prepare account internal  rungwat.n@gmail.com
    Signin password  rungwat.n@gmail.com  email  vincent1234
    HTTP status should be    200    ${ob_iam_register_response}
    ${token}=   Validate register response
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC009 Signin with password not success
    [documentation]  Signin with email success
    Prepare account internal  rungwat.n@gmail.com
    Signin password  rungwat.n@gmail.com  email  vincent12345
    HTTP status should be    401    ${ob_iam_register_response}
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC010 Signin with sso with 2fa
    [documentation]  Signin with sso success 2fa
    Prepare external account with 2fa  rungwat.n@gmail.com  google  +66967505222  phone
    Signin sso  rungwat.n@gmail.com  sso  google
    HTTP status should be    200    ${ob_iam_register_response}
    Request otp     +66967505222  phone
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    Signin sso with 2fa  rungwat.n@gmail.com  sso  google   ${json_response["data"]["otp"]["id"]}
    HTTP status should be    200    ${ob_iam_2fa_response}
    ${token}=   Validate register response
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC011 Delete account
    [documentation]  Signin with sso success 2fa
    Prepare external account with 2fa  rungwat.n@gmail.com  google  +66967505222  phone
    Signin sso with 2fa auto  rungwat.n@gmail.com  google  +66967505222  phone
    HTTP status should be    200    ${ob_iam_2fa_response}
    ${token}=   Validate register response
    Delete account  rungwat.n@gmail.com  ${token}
    HTTP status should be    200    ${ob_iam_delete_account_response}
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC012 Reactivate with sso with 2fa
    [documentation]  Reactivate with sso success 2fa
    Prepare external account with 2fa  rungwat.n@gmail.com  google  +66967505222  phone
    Signin sso with 2fa auto  rungwat.n@gmail.com  google  +66967505222  phone
    HTTP status should be    200    ${ob_iam_2fa_response}
    ${token}=   Validate register response
    Delete account  rungwat.n@gmail.com  ${token}
    HTTP status should be    200    ${ob_iam_delete_account_response}
    Signin sso  rungwat.n@gmail.com  sso  google
    HTTP status should be    500    ${ob_iam_register_response}
    Reactivate sso account  rungwat.n@gmail.com  sso  google
    HTTP status should be    200    ${ob_iam_reactivate_response}
    Request otp     +66967505222  phone
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    Reactivate sso account with 2fa  rungwat.n@gmail.com  sso  google   ${json_response["data"]["otp"]["id"]}
    HTTP status should be    200    ${ob_iam_reactivate_response}
    ${token}=   Validate register response
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC013 Reactivate with sso
    [documentation]  Reactivate with sso
    Prepare account external    rungwat.n@gmail.com     google
    Signin sso  rungwat.n@gmail.com  sso  google
    HTTP status should be    200    ${ob_iam_register_response}
    ${token}=   Validate register response
    Delete account  rungwat.n@gmail.com  ${token}
    HTTP status should be    200    ${ob_iam_delete_account_response}
    Signin sso  rungwat.n@gmail.com  sso  google
    HTTP status should be    500    ${ob_iam_register_response}
    Reactivate sso account   rungwat.n@gmail.com  sso  google
    HTTP status should be    200    ${ob_iam_reactivate_response}
    ${token}=   Validate register response
    [Teardown]    Delete account from database    rungwat.n@gmail.com
    
TC014 Reactivate with internal account
    [documentation]  Reactivate with internal account
    Prepare account internal  rungwat.n@gmail.com
    Signin password  rungwat.n@gmail.com  email  vincent1234
    HTTP status should be    200    ${ob_iam_register_response}
    ${token}=   Validate register response
    Delete account  rungwat.n@gmail.com  ${token}
    Signin password  rungwat.n@gmail.com  email  vincent1234
    HTTP status should be    500    ${ob_iam_register_response}
    Reactivate internal account  rungwat.n@gmail.com  email  vincent1234
    HTTP status should be    200    ${ob_iam_reactivate_response}
    ${token}=   Validate register response
    [Teardown]    Delete account from database    rungwat.n@gmail.com

TC15 Forget password with internal account
    [documentation]  Forget password with internal account
    Prepare account internal  rungwat.n@gmail.com
    Request otp     rungwat.n@gmail.com  email
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    Reset password without 2fa  rungwat.n@gmail.com  email  vincent@2023     ${json_response["data"]["otp"]["id"]}
    HTTP status should be    200    ${ob_iam_reset_password_response}
    ${token}=   Validate register response
    Signin password  rungwat.n@gmail.com  email  vincent@2023
    HTTP status should be    200    ${ob_iam_register_response}
    ${token}=   Validate register response
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   rungwat.n@gmail.com

TC16 Forget password with internal account 2fa
    [documentation]  Forget password with internal account 2fa
    Prepare external account with 2fa  rungwat.n@gmail.com  google  +66967505222  phone
    Request otp     rungwat.n@gmail.com  email
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    ${first_otp}=    Set Variable    ${json_response["data"]["otp"]["id"]}
    Reset password without 2fa  rungwat.n@gmail.com  email  vincent@2023     ${json_response["data"]["otp"]["id"]}
    HTTP status should be    200    ${ob_iam_reset_password_response}
    Request otp     +66967505222  phone
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    ${second_otp}=    Set Variable    ${json_response["data"]["otp"]["id"]}
    Reset password with 2fa  rungwat.n@gmail.com  email  vincent@2023     ${first_otp}  ${second_otp}
    HTTP status should be    200    ${ob_iam_reset_password_response}
    ${token}=   Validate register response
    Signin password  rungwat.n@gmail.com  email  vincent@2023
    HTTP status should be    200    ${ob_iam_register_response}
    Request otp     +66967505222  phone
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    Signin password with 2fa  rungwat.n@gmail.com  email  vincent@2023  ${json_response["data"]["otp"]["id"]}
    HTTP status should be    200    ${ob_iam_register_response}
    ${token}=   Validate register response
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   rungwat.n@gmail.com
    ...     AND  Delete otp from database   +66967505222

TC017 Forget password with sso
    [documentation]  Forget password with sso account
    Prepare account external    rungwat.n@gmail.com     google
    Signin sso  rungwat.n@gmail.com  sso  google
    Request otp     rungwat.n@gmail.com  email
    HTTP status should be    200    ${ob_iam_request_otp_response}
    Validate otp    ${json_response}    000000
    HTTP status should be    200    ${ob_iam_validate_otp_response}
    Reset password without 2fa  rungwat.n@gmail.com  email  vincent@2023     ${json_response["data"]["otp"]["id"]}
    HTTP status should be    200    ${ob_iam_reset_password_response}
    ${token}=   Validate register response
    Signin password  rungwat.n@gmail.com  email  vincent@2023
    HTTP status should be    200    ${ob_iam_register_response}
    ${token}=   Validate register response
    Signin sso  rungwat.n@gmail.com  sso  google
    HTTP status should be    200    ${ob_iam_register_response}
    ${token}=   Validate register response
    [Teardown]  Run Keywords    Delete account from database    rungwat.n@gmail.com
    ...     AND  Delete otp from database   rungwat.n@gmail.com