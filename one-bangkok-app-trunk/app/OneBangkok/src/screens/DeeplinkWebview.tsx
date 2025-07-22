import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { Header } from '~/components/molecules';
import { RootStackParamList } from '~/navigations/AppNavigation';
import React = require('react');

type NotificationDeeplinkProps = NativeStackScreenProps<
  RootStackParamList,
  'DeeplinkWebview',
  ''
>;

const DeeplinkWebview = ({
  route: {
    params: { url },
  },
}: NotificationDeeplinkProps) => {
  return (
    <View className="flex-1">
      <Header leftAction="goBack" />
      <WebView
        scalesPageToFit={true}
        className="flex-1 w-full"
        source={{
          uri: url,
        }}
      />
    </View>
  );
};

export default DeeplinkWebview;