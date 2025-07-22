import analytics from '@react-native-firebase/analytics';
import {Alert} from 'react-native';

type GAKey = 'screen_name' | 'feature_name' | 'action_type' | 'bu' | 'title';

type EventParams = Partial<Record<GAKey, string | number | boolean | null>> & {
  [key: string]: any;
};


function logEvent(eventName: string, params?: EventParams) {
  const eventParams = params || {};
  

  analytics()
    .logEvent(eventName, eventParams)
    .then(() => {
      console.log(`Event successfully logged: ${eventName}`);
    })
    .catch(error => {
      console.error(`Error logging event ${eventName}:`, error);
    });
}

function logScreenView(screenName: string) {
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

function logTitleView(titleName: string) {
  analytics()
    .logEvent('title_view', {
      title_name: titleName,
    })
    .then(() => {
      console.log(`Title view logged: ${titleName}`);
    })
    .catch(error => {
      console.error(`Error logging title view ${titleName}:`, error);
    });
}

function logButtonClick(buttonName: string) {
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

export {logScreenView, logButtonClick, logEvent, logTitleView};
