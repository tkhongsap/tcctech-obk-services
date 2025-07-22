*** Settings ***
Resource    ${CURDIR}/../../resources/imports.robot

*** Keywords ***
HTTP status should be
    [Arguments]    ${expected_http_code}    ${response}
    Should Be Equal As Integers    ${response.status_code}    ${expected_http_code}
    Set Test Variable    ${json_response}    ${response.json()}

Error message should be return correctly
    [Arguments]    ${error_code}    ${error_message}
    Should Be Equal As Strings    ${error_code}    ${json_response['error']['code']}
    Should Be Equal As Strings    ${error_message}    ${json_response['error']['message']}

Error message only should be return correctly
    [Arguments]    ${error_message}    
    Should Be Equal As Strings    ${error_message}    ${json_response['message']}   

#TODO: Remove when fix error case to return both code and message
Error code should be return correctly
    [Arguments]    ${error_code}    
    Should Be Equal As Strings    ${error_code}    ${json_response['error']['code']}

Current date
    ${get_date_and_time}=    Get Current Date
    ${date}    Get Substring    ${get_date_and_time}    0    10
    [Return]    ${date}

Current date and time
    ${get_date_and_time}=    Get Current Date
    ${date}    Get Substring    ${get_date_and_time}    0    10
    ${time}    Get Substring    ${get_date_and_time}    11    23
    ${date_time}    Strip String    ${date}T${time}Z
    [Return]    ${date_time}

Get specific date and time from current date by format
    [Arguments]    ${date_format}    ${adjust_date}
    ${current_date}=   Get Current Date     result_format=${date_format}
    ${adjust_date}=   Add Time To Date    ${current_date}    ${adjust_date}
    ${output_date}=    Convert Date    ${adjust_date}    result_format=${date_format}
    [Return]    ${output_date}

Compare between two date should be equal
    [Arguments]  ${first_year}   ${first_month}     ${first_day}    ${first_hour}    ${first_minute}   ${first_second}    ${second_year}   ${second_month}     ${second_day}    ${second_hour}    ${second_minute}    ${second_second}
    ${str_second_min} =   Convert To String   ${second_minute}
    @{words} =   Split String    ${str_second_min}
    ${chk_min} =     Remove String       ${words}[0]    ,    0
    ${conv_min} =    Convert To Number      ${chk_min}

    Run Keyword If  ((${conv_min} <= 0) and (${conv_min} >= 9))     Fatal Error

    ##### year #####
    ${diff_year}=    Evaluate    ${first_year} - ${second_year}
    Run Keyword If   ${diff_year} > 1      Fatal Error

    ##### month #####
    ${diff_month}=    Evaluate    ${first_month} - ${second_month}
    Run Keyword If   ${diff_month} > 1     Fatal Error

    ##### day #####
    ${diff_day}=    Evaluate    ${first_day} - ${second_day}
    Run Keyword If   ${diff_day} > 1       Fatal Error

    ##### hour #####
    ${diff_hour}=    Evaluate    ${first_hour} - ${second_hour}
    Run Keyword If   ${diff_hour} > 1      Fatal Error

    ##### minute #####
    ${str_first_minute} =   Convert To String    ${first_minute}
    ${str_second_minute} =   Convert To String    ${second_minute}
    Compare between two minutes should be equal     ${str_first_minute}   ${str_second_minute}

    ##### second #####
    ${str_first_second} =   Convert To String    ${first_second}
    ${str_second_second} =   Convert To String    ${second_second}
    Compare between two seconds should be equal     ${str_first_second}   ${str_second_second}

Compare between two minutes should be equal
    [Arguments]   ${first_min}   ${second_min}
    @{split_first_min} =   Split String    ${first_min}
    @{split_second_min} =   Split String    ${second_min}
    ${convert_first_min} =    Remove String       ${split_first_min}[0]    ,    0
    ${convert_second_min} =     Remove String       ${split_second_min}[0]    ,    0
    ${first_min} =    Convert To Number      ${convert_first_min}
    ${second_min} =    Convert To Number     ${convert_second_min}

    Run Keyword If  ((${first_min} <= 0) and (${first_min} >= 9))     Fatal Error
    Run Keyword If  ((${second_min} <= 0) and (${second_min} >= 9))       Fatal Error

    ${diff_minute} =    Evaluate    ${first_min} - ${second_min}
    Run Keyword If   ${diff_minute} > 1    Fatal Error

Compare between two seconds should be equal
    [Arguments]   ${first_sec}   ${second_sec}
    @{split_first_sec} =   Split String    ${first_sec}
    @{split_second_sec} =   Split String    ${second_sec}
    ${convert_first_sec} =    Remove String       ${split_first_sec}[0]    ,    0
    ${convert_second_sec} =     Remove String       ${split_second_sec}[0]    ,    0
    ${first_sec} =    Convert To Number      ${convert_first_sec}
    ${second_sec} =    Convert To Number     ${convert_second_sec}

    Run Keyword If  ((${first_sec} <= 0) and (${first_sec} >= 9))     Fatal Error
    Run Keyword If  ((${second_sec} <= 0) and (${second_sec} >= 9))       Fatal Error

    ${diff_sec} =    Evaluate    ${first_sec} - ${second_sec}
    Run Keyword If   ${diff_sec} > 15    Fatal Error

Get header
    [Arguments]     ${source_identifier}    ${token}
    ${header}=    Create Dictionary    Content-Type=application/json    x-access-token=${Empty}  
    Run Keyword If      "${env}" == "local"     Query account id by identifier  ${source_identifier}
    Run Keyword If      "${env}" == "local"     Set To Dictionary   ${header}   x-account-id=${result[0][0]}
    Set To Dictionary   ${header}   x-access-token=${token}
    [Return]    ${header}

Truncate
    [Arguments]     ${value}    ${presision}
    ${presision}=  Evaluate  ${presision} + 1
    ${truncate}=  Evaluate  '${value}'[0:'${value}'.find('.') + ${presision}]
    [Return]    ${truncate}