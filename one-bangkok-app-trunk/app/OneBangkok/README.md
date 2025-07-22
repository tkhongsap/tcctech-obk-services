# To develop

## Android
To develop Android using an `emulator` in your local environment, you must forward the ports using:
```bash
adb reverse tcp:8080 tcp:8080
adb reverse tcp:9090 tcp:9090
```

This allows the emulator to connect to the local services:
```env
OB_DOCUMENT_URL='http://localhost:8080/ob-document'
OB_NOTI_URL='http://localhost:8080/ob-notification'
OB_IAM_URL='http://localhost:8080/ob-iam'
OB_BMS_URL='http://localhost:8080/ob-bms'
GATEWAY_BASEURL='http://localhost:8080'
WEBSOCKET_BASEURL='ws://localhost:9090'
```

Open file `./android/app/build.gradle` then uncommend
```java
// storeFile file('debug.keystore')
// storePassword 'android'
// keyAlias 'androiddebugkey'
// keyPassword 'android'
```
and comment
```java
storeFile file(DEV_STORE_FILE)
storePassword DEV_STORE_PASSWORD
keyAlias DEV_KEY_ALIAS
keyPassword DEV_KEY_PASSWORD
```

then search and comment this line
```
def abi = output.getFilter(OutputFile.ABI)
```
and add the code below instead 
```
def abi = output.getFilter(com.android.build.api.variant.FilterConfiguration.FilterType.ABI.name())
```

## Ios
No need for extar setup