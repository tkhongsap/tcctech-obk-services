import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import {Header} from '~/components/molecules';
import {RootStackParamList} from '~/navigations/AppNavigation';

type AccessLocalInformationUrllProps = NativeStackScreenProps<
  RootStackParamList,
  'AccessLocalInformationUrl',
  ''
>;

export const AccessLocalInformationUrl = ({
  route: {
    params: {url},
  },
}: AccessLocalInformationUrllProps) => {
  return (
    <View style={{flex: 1}}>
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
