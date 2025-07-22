*** Setting ***
Library     json
Library     Collections
Library     String
Library     DateTime
Library     RequestsLibrary
Library     OperatingSystem
Library     RabbitMq
Library     ${CURDIR}/../pythonlibs/rsaencryption.py
Library     ${CURDIR}/../pythonlibs/sha512hashing.py
Library     DatabaseLibrary
Library     ${CURDIR}/../pythonlibs/generate_uuid.py
Variables   ${CURDIR}/configs/${env}/common_configs.yaml
Variables   ${CURDIR}/configs/${env}/env_config.yaml
Variables   ${CURDIR}/configs/${env}/env_secret.yaml
# Variables   ${CURDIR}/testdata/common.yaml
Resource    ${CURDIR}/../keywords/common/connect_db_keywords.robot
Resource    ${CURDIR}/../keywords/common/common_keywords.robot
Library     ${CURDIR}/../pythonlibs/generate_cid.py
Library     ${CURDIR}/../pythonlibs/generate_number.py
Library     ${CURDIR}/../pythonlibs/generate_pin.py