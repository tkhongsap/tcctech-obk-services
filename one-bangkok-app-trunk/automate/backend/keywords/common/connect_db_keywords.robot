*** Settings ***
Resource    ${CURDIR}/../../resources/imports.robot

*** Keywords ***
Connect to ob iam database
    Connect To Database    psycopg2    ${ob_iam_database.name}    ${user_pass_database.username}    ${user_pass_database.password}    ${ob_iam_database.host}    ${ob_iam_database.port}
