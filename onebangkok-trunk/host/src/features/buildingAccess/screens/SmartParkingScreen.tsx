import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

import {Federated} from '@callstack/repack/client';
import {Header} from '~/components/molecules';

const App1 = React.lazy(() =>
  Federated.importModule('microfrontendone', './App'),
);
export default function SmartParkingScreen() {
  return (
    <View style={styles.miniAppWrapper}>
      <Header
        leftAction="goBack"
        title={'Test MicroFrontend'}
        iconHeight={25}
        iconWidth={25}
      />
      <React.Suspense fallback={<Text>Loading app1...</Text>}>
        <App1 />
      </React.Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  miniAppWrapper: {
    flex: 1,
  },
  backWrapper: {
    backgroundColor: '#E1F8DC',
    marginTop: 50,
  },
});
