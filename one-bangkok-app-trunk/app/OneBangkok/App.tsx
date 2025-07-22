import * as React from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import '~/extensions/String';
import AppNavigation from '~/navigations/AppNavigation';
import {NotifierWrapper} from 'react-native-notifier';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import withAppState from '~/states/appState';
import {AppState} from 'react-native';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import authenAction from '~/states/authen/authenAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import {parkingAction} from '~/features/buildingAccess/store/parking';
import {
  init as initDeepLink,
  handleInitialUrl,
  navigationRef,
} from '~/helpers/deepLinking';

if (Config.SENTRY_ENABLE) {
  Sentry.init({
    dsn: Config.SENTRY_DNS,

    tracesSampleRate: 1.0,
    _experiments: {
      // profilesSampleRate is relative to tracesSampleRate.
      // Here, we'll capture profiles for 100% of transactions.
      profilesSampleRate: 1.0,
    },
    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // enableSpotlight: __DEV__,
  });
}

//const WrappedAppNavigation = withCountTap(AppNavigation);
const WrappedAppStateAppNavigation = withAppState(AppNavigation);

const App = () => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification:', notification);
        // ⚠️ Required only on iOS
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  const LAST_REFRESH_TOKEN_KEY = 'lastRefreshTokenDate';

  const dailyRefresh = async () => {
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const lastRunDate = await AsyncStorage.getItem(LAST_REFRESH_TOKEN_KEY);
      await parkingAction.clear();
      if (lastRunDate !== today) {
        console.log('📱 Renew token on:', today);
        authenAction.refreshToken();
        await AsyncStorage.setItem(LAST_REFRESH_TOKEN_KEY, today);
      }
    } catch (error) {
      console.error('Error renew token :', error);
    }
  };

  const [appState, setAppState] = React.useState(AppState.currentState);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        dailyRefresh();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const hasNavigationInitialized = React.useRef(false);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={state => {
        if (!state) return;
        const {routes} = state;
        if (
          !hasNavigationInitialized.current &&
          routes &&
          routes.length > 0 &&
          routes.find(item => item.name === 'MainPageScreen')
        ) {
          hasNavigationInitialized.current = true;
          initDeepLink();
          handleInitialUrl();
        }
      }}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NotifierWrapper>
          <SafeAreaProvider>
            <WrappedAppStateAppNavigation />
          </SafeAreaProvider>
        </NotifierWrapper>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default App;
