import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useEffect} from 'react';
import {Dimensions, Linking, ScrollView, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import t from '~/utils/text';
import {Spacing, Text, textWeightVariantTextEditor} from '~/components/atoms';
import {Header, StickyButton} from '~/components/molecules';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {logScreenView} from '~/utils/logGA';
import getTheme from '~/utils/themes/themeUtils';
import Markdown from 'react-native-marked';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isNull, isUndefined} from 'lodash';
import RenderHtml from 'react-native-render-html';
import {
  HTMLRenderTextClassStyles,
  HTMLRenderTextTagsStyles,
  replaceTextHtml,
} from '../../sustainability/components/HtmlRenderTextClassStyles';

type EventDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'EventDetail'
>;

export const EventDetail = ({
  route: {
    params: {title, description, textOverlay, image, tags, button},
  },
}: EventDetailProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  let nWidth = Dimensions.get('window').width;

  useEffect(() => {
    logScreenView('EventDetail');
  }, []);

  const goToAnnoucement = useCallback(() => {
    navigation.navigate('AnnouncementScreen', {
      type: 'error',
      title: t('General__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Announcement__Error_generic__Body',
        'Please wait and try again soon.',
      ),
      buttonText: t('General__Back_to_notification', 'Back to notification'),
      screenHook: 'MessageDetailScreen',
    });
  }, [navigation]);

  const handlePress = async () => {
    const url = button?.url;
    try {
      if (!isUndefined(url) && !isNull(url)) {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          navigation.navigate('DeeplinkWebview', {url});
        } else {
          goToAnnoucement();
        }
      }
    } catch (error) {
      goToAnnoucement();
    }
  };

  return (
    <View className={`${getTheme('bg-default h-screen w-screen')}`}>
      <Header leftAction="goBack" title={title} />
      <ScrollView contentContainerStyle={{paddingBottom: insets.bottom}}>
        <FastImage
          source={{uri: image}}
          style={{
            width: '100%',
            height: 240,
          }}>
          <View className="absolute bottom-0 w-full">
            <View className="flex flex-col ml-4 p-4">
              <RenderHtml
                contentWidth={nWidth}
                classesStyles={HTMLRenderTextClassStyles}
                tagsStyles={HTMLRenderTextTagsStyles}
                source={{
                  html: replaceTextHtml(textOverlay + ''),
                }}
                systemFonts={Object.values(textWeightVariantTextEditor)}
              />
            </View>
          </View>
        </FastImage>
        <Spacing height={30} />
        <View className="px-4">
          <View>
            <Text weight="bold" color="jet-black">
              {t('General__Description', 'Description')}
            </Text>
            <Markdown
              flatListProps={{scrollEnabled: false}}
              value={description}
              styles={{text: {fontFamily: 'OneBangkok-Regular'}}}
            />
          </View>
          <Spacing height={24} />
          <View className="space-y-1">
            <Text weight="bold" color="dark-gray">
              {t('Mc_Tag', 'Tag')}
            </Text>
            <View className="flex flex-row flex-wrap gap-2">
              {tags.map(item => (
                <View className="flex-shrink-1 p-2.5 rounded-full border border-[#4F4F4F]">
                  <Text
                    size="C1"
                    weight="medium"
                    className="capitalize text-[#4F4F4F]">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Spacing height={24} />
      </ScrollView>
      {button && (
        <StickyButton
          title={button.name}
          onPress={handlePress}
          rightIcon="next"
        />
      )}
    </View>
  );
};
