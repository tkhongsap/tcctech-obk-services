import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {Diverder, Header, StickyButton} from '~/components/molecules';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Content} from '~/utils/ob_sdk/services/ob_notification/index.interface';
import {Screen} from '~/components/templates';
import {get, isEmpty, isNull, isString, isUndefined} from 'lodash';
import {Spacing, Text} from '~/components/atoms';
import DateTime from '~/utils/datetime';
import getTheme from '~/utils/themes/themeUtils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import t from '~/utils/text';
import {useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import notificationAction from '../store';
import {MessageGetIndexResult} from 'ob-notification-sdk/dist/api';
import {logScreenView} from '~/utils/logGA';
import {TextValidation} from '~/utils/validation';
import WebDisplay from '~/components/molecules/notification/webDisplay';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {useHookstate} from '@hookstate/core';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NotificationDetailScreen'
>;

type contentProps = {
  message: MessageGetIndexResult;
};

const ContentWidget = ({message}: contentProps) => {
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();
  const [content, setContent] = useState<Content>();

  const findImage = (data: any) => {
    const imageUrl = get(data, 'data[0]', '');

    if (TextValidation.isImageUrl(imageUrl)) {
      return (
        <Image style={styles.image} source={{uri: imageUrl?.toString()}} />
      );
    }
    return null;
  };

  const findDataContent = (data: any) => {
    if (data.data.url) {
      return (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(data.data.url);
          }}>
          <Text className="leading-[19.2px]" color="primary">
            {data.data.message[languageSelected]}
          </Text>
        </TouchableOpacity>
      );
    } else if (isString(data.data)) {
      let dataContent = data.data;
      return <WebDisplay html={dataContent} />;
    }
    return null;
  };

  const buildTag = () => {
    const tagContent = message.tag?.map((row, index) => {
      return (
        <View
          key={`tag-${index}`}
          className={getTheme('border border-jet-black px-1 mr-2 mt-2')}>
          <Text size="C1" color="dark-gray">
            {row}
          </Text>
        </View>
      );
    });

    return tagContent;
  };

  const buildContentType = (row: any) => {
    let contentType;
    contentType = findImage(row);
    if (isNull(contentType)) {
      contentType = findDataContent(row);
    }
    return contentType;
  };

  const buildContent = () => {
    if (!isUndefined(content)) {
      const dataContent = content.map((row, index) => {
        const contentType = buildContentType(row);
        return (
          <View key={`content-${index}`}>
            <Spacing height={8} />
            {contentType}
          </View>
        );
      });

      return dataContent;
    }

    return null;
  };

  useEffect(() => {
    setContent(message.data as Content);
  }, [message]);

  return (
    <View>
      <Spacing height={16} />
      {message.thumbnail && (
        <Image
          style={styles.image}
          source={{uri: message.thumbnail?.toString()}}
        />
      )}
      <View className="px-6 pt-3">
        <Text size="H3" weight="medium">
          {message.title}
        </Text>
        <Text size="C1" weight="regular" color="muted">
          {DateTime.getDiffDateTimeText(message.created_at ?? '')}
        </Text>
        <WebDisplay html={message.sub_title} />
        <View>{buildContent()}</View>
      </View>
      {message.tag && message.tag.length > 0 && (
        <>
          <Spacing height={8} />
          <Diverder />
        </>
      )}
      <View className="px-6 flex-row row flex-wrap">{buildTag()}</View>
    </View>
  );
};

const NotificationDetailScreen = ({
  route: {
    params: {messageData, id},
  },
}: Props) => {
  const [message, setMessage] = useState<MessageGetIndexResult>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getNotificationDetail = useCallback(async () => {
    if (messageData) {
      setMessage(messageData);
    } else {
      setIsLoading(true);
      const result = await notificationAction.getMessage(id ?? '');
      if (result) {
        setMessage(result);
      }
      setIsLoading(false);
    }
  }, [id, messageData]);

  useEffect(() => {
    getNotificationDetail();
  }, [getNotificationDetail]);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const goToAnnoucement = () => {
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
  };

  const handlePress = async () => {
    const url = message?.deeplink;
    try {
      if (!isUndefined(url) && !isNull(url)) {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          await Linking.openURL(url);
        } else {
          goToAnnoucement();
        }
      }
    } catch (error) {
      goToAnnoucement();
    }
  };

  useScreenHook('MessageDetailScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        navigation.goBack();
        break;
      default:
        break;
    }
  });
  useEffect(() => {
    logScreenView('NotificationDetailScreen');
  }, []);
  return (
    <Screen isLoading={isLoading}>
      <Header leftAction="goBack" title={message?.category} />
      <ScrollView className="flex flex-col w-full">
        <Pressable>
          {!isUndefined(message) && <ContentWidget message={message} />}
        </Pressable>
        <Spacing height={21 + insets.bottom} />
      </ScrollView>
      {!isUndefined(message) &&
        !isNull(message?.deeplink) &&
        !isEmpty(message.deeplink_display_name) && (
          <StickyButton
            title={message.deeplink_display_name!}
            onPress={handlePress}
            rightIcon="next"
          />
        )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginBottom: 3,
    borderRadius: 4,
  },
});

export default NotificationDetailScreen;
