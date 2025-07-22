import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Linking, ScrollView, View} from 'react-native';
import Markdown from 'react-native-marked';
import {Screen} from '~/components';
import {Spacing, Text} from '~/components/atoms';
import {Header, StickyButton} from '~/components/molecules';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import getTheme from '~/utils/themes/themeUtils';
import {WebView} from 'react-native-webview';
import {useIsFocused} from '@react-navigation/native';
import {useEffect} from 'react';
import {logScreenView} from '~/utils/logGA';

type AccessLocalInformationContentDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'AccessLocalInformationContentDetail'
>;

export const AccessLocalInformationContentDetail = ({
  route: {
    params: {headerText, content, link},
  },
}: AccessLocalInformationContentDetailProps) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      logScreenView(headerText);
    }
  }, [isFocused, headerText]);
  return (
    <View className={getTheme('h-screen w-screen bg-default')}>
      <Header leftAction="goBack" title={headerText} />
      <ScrollView className="px-4 py-6">
        <Markdown
          flatListProps={{scrollEnabled: false}}
          value={content}
          styles={{text: {fontFamily: 'OneBangkok-Regular'}}}
        />
        <Spacing height={24} />
      </ScrollView>
      <StickyButton title={link.name} rightIcon="next" onPress={link.onPress} />
    </View>
  );
};
