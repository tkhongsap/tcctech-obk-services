import {View, SafeAreaView, Text} from 'react-native';
import React from 'react';

import {Federated} from '@callstack/repack/client';

// const Text = React.lazy(() =>
//   Federated.importModule('host', './Text').then(module => {
//     // Check for both default and named export
//     return {default: module.default || module.Text};
//   }),
// );

export default function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <React.Suspense fallback={<Text>Loading....</Text>}>
          <Text>MicroFe 1</Text>
        </React.Suspense>
      </View>
    </SafeAreaView>
  );
}
