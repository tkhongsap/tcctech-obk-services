import analytics from '@react-native-firebase/analytics';

function logEvent(eventName: string) {
  console.log(`Logging event: ${eventName}`);
  analytics()
    .logEvent(eventName)
    .then(() => {
      console.log(`Event successfully logged: ${eventName}`);
    })
    .catch(error => {
      console.error(`Error logging event ${eventName}:`, error);
    });
}

function logScreenView(screenName: String) {
  analytics()
    .logEvent('screen_view', {
      screen_name: screenName,
    })
    .then(() => {
      console.log(`Screen view logged: ${screenName}`);
    })
    .catch(error => {
      console.error(`Error logging screen view ${screenName}:`, error);
    });
}

function logButtonClick(buttonName: String) {
  analytics()
    .logEvent('button_click', {
      button_name: buttonName,
    })
    .then(() => {
      console.log(`Button click logged: ${buttonName}`);
    })
    .catch(error => {
      console.error(`Error logging button click ${buttonName}:`, error);
    });
}

export {logScreenView, logButtonClick, logEvent};
