import * as React from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import '~/extensions/String';
import AppNavigation, {StackNavigation} from '~/navigations/AppNavigation';
import {NotifierWrapper} from 'react-native-notifier';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import withCountTap from '~/components/CountTap';

Sentry.init({
  dsn: 'https://4514161039becd6a5d9bd096e757e5cf@o4507492216340480.ingest.us.sentry.io/4507502527774720',

  tracesSampleRate: 1.0,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

export const navigationRef = createNavigationContainerRef<StackNavigation>();

const WrappedAppNavigation = withCountTap(AppNavigation);

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NotifierWrapper>
          <SafeAreaProvider>
            <WrappedAppNavigation />
          </SafeAreaProvider>
        </NotifierWrapper>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default App;
