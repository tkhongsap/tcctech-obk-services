import {
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Text, Spacing} from '~/components/atoms';
import t from '~/utils/text';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {Header} from '../components/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import getTheme from '~/utils/themes/themeUtils';
import {isTablet} from '../utils/device';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import RenderHtml from 'react-native-render-html';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DatetimeParser from '../utils/reformatter/datetime';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AnnouncementDetailScreen'
>;

type AnnouncementDetail = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  content: string;
  dateTime: string;
  announcementDate: string;
};
type ImageDimension = {
  width: number;
  height: number;
};

const AnnouncementDetailScreen = ({
  route: {
    params: {id, title},
  },
}: Props) => {
  const {width} = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [announcement, setAnnouncement] = useState<AnnouncementDetail>();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const navigation = useNavigation();
  const [imageDimension, setImageDimension] = useState<ImageDimension>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const {data} = await serviceMindService.announcementDetail(id);
        if (data.data?.imageUrl) {
          const dimension = await getImageDimension(data.data.imageUrl);
          setImageDimension(dimension);
        }
        setAnnouncement(data.data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tagsStyles = useMemo(
    () => ({
      p: {
        color: '#292929',
        width: '100%',
        marginBottom: 0,
        lineHeight: 30,
        fontSize: 16,
      },
      h1: {
        color: '#292929',
        margin: 0,
      },
      h2: {
        color: '#292929',
        margin: 0,
      },
      h3: {
        color: '#292929',
        margin: 0,
      },
      h4: {
        color: '#292929',
        margin: 0,
      },
      h5: {
        color: '#292929',
        margin: 0,
      },
      h6: {
        color: '#292929',
        margin: 0,
      },
      li: {
        marginTop: -20,
      },
    }),
    [],
  );

  const defaultTextProps = {
    style: {
      fontFamily: 'OneBangkok-Regular',
    },
  };

  const parseDateFormat = (timestamp: number) => {
    try {
      return `${DatetimeParser.toDMY({language, timestamp})} ${
        language === 'en' ? 'at ' : ''
      }${DatetimeParser.toHM({language, timestamp})}`;
    } catch (error) {
      return '';
    }
  };

  const onPressImage = () => {
    navigation.navigate('ResidentialAnnouncementImagePreviewScreen', {
      imageUrl: announcement?.imageUrl ?? '',
    });
  };

  const getImageDimension = (uri: string): Promise<ImageDimension> => {
    return new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve({width, height});
      });
    });
  };

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t(
          'Residential__Announcement__News_And_Announcement',
          'News & Announcement',
        )}
        titleColor="dark-gray"
        bgColor="bg-white"
      />
      <View className="w-full">{/* <Unit /> */}</View>
      <ScrollView
        className={
          isTablet
            ? getTheme('w-[780px] h-full bg-white px-[16px]')
            : getTheme('w-full h-full bg-white px-[16px]')
        }>
        <Text weight="bold" size="H3" color="dark-gray" className="mt-6">
          {title}
        </Text>
        {announcement?.announcementDate !== undefined && (
          <Text
            size="B2"
            className={getTheme(
              'text-subtitle-muted break-all text-[#989898]',
            )}>
            {parseDateFormat(parseInt(announcement.announcementDate))}
          </Text>
        )}
        <View>
          <View className={getTheme('pb-10')}>
            <Spacing height={16} />
            {!isLoading && announcement?.imageUrl && imageDimension && (
              <TouchableOpacity onPress={onPressImage}>
                <Image
                  className="w-full"
                  resizeMode="contain"
                  source={{uri: announcement.imageUrl}}
                  style={{
                    aspectRatio: imageDimension.width / imageDimension.height,
                  }}
                />
              </TouchableOpacity>
            )}
            {announcement?.content && (
              <RenderHtml
                contentWidth={width}
                source={{
                  html: announcement.content,
                }}
                tagsStyles={tagsStyles}
                defaultTextProps={defaultTextProps}
              />
            )}
          </View>
        </View>
        {Platform.OS === 'ios' && <Spacing height={120} />}
      </ScrollView>
    </ScreenContainer>
  );
};

export default AnnouncementDetailScreen;
