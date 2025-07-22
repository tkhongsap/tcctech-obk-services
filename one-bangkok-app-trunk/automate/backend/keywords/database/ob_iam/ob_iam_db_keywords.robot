*** Settings ***
Resource    ${CURDIR}/../../../resources/imports.robot

*** Keywords ***
Query otp reference from database
    [Arguments]     ${reference}
    Connect to ob iam database
    ${query_results_otp}=    Query    SELECT reference FROM otp WHERE reference = '${reference}'
    Set Test Variable    ${result}    ${query_results_otp}
    Disconnect from database

Query otp id from database
    [Arguments]     ${id}
    Connect to ob iam database
    ${query_results_otp}=    Query    SELECT id FROM otp WHERE id = '${id}'
    Set Test Variable    ${result}    ${query_results_otp}
    Disconnect from database

Query token value from database
    [Arguments]     ${token}
    Connect to ob iam database
    ${query_results_token}=    Query    SELECT token FROM token WHERE token = '${token}'
    Set Test Variable    ${result}    ${query_results_token}
    Disconnect from database

Delete reference from database
    [Arguments]    ${reference}
    Connect to ob iam database
    ${query_result} =   Execute Sql String    DELETE FROM otp WHERE reference = '${reference}';
    Disconnect From Database

Delete token from database
    [Arguments]    ${token}
    Connect to ob iam database
    ${query_result} =   Execute Sql String    DELETE FROM token WHERE token = '${token}';
    Disconnect From Database

Delete account from database
    [Arguments]     ${identifier}
    Connect to ob iam database
    ${query_result} =   Execute Sql String      DELETE FROM account USING identity WHERE account.id = identity.account_id AND identity.identifier = '${identifier}';
    Disconnect From Database

Query account id by identifier
    [Arguments]     ${identifier}
    Connect to ob iam database
    ${query_results_account}=    Query    SELECT account_id FROM identity WHERE identifier = '${identifier}'
    Set Test Variable    ${result}    ${query_results_account}
    Disconnect From Database

Delete otp from database
    [Arguments]     ${identifier}
    Connect to ob iam database
    ${query_result} =   Execute Sql String      DELETE FROM otp WHERE identifier = '${identifier}';
    Disconnect From Database
