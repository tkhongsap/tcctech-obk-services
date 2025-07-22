import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Spacing, Text} from '~/components/atoms';
import {HeadText} from '~/components/molecules';
import {Header} from '../components/Header';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {ScreenContainer} from '../components/ScreenContainer';
import getTheme from '~/utils/themes/themeUtils';
import {isTablet} from '../utils/device';
import {useResidentialUnitSelectedState} from '~/states/residentialTenant/residentialTenantState';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DatetimeParser from '../utils/reformatter/datetime';

type AnnouncementPaginate = {
  page: number;
  limit: number;
  count: number;
  total: number;
};

type AnnouncementData = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  announcementDate: string;
  pinnedToHome: string;
};

const AnnouncementsScreen = () => {
  const navigation = useNavigation();
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [announcementPaginate, setAnnouncementPaginate] =
    useState<AnnouncementPaginate | null>(null);
  const [loading, setLoading] = useState(true);
  const unitSelectedState = useResidentialUnitSelectedState();
  const {selectedProjectId} = unitSelectedState.get({noproxy: true});
  const [refreshing, setRefreshing] = useState(false);

  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const {data} = await serviceMindService.announcements(selectedProjectId);
      setAnnouncements(data.data);
      setAnnouncementPaginate(data.paginate);
    } catch (error) {
      console.error('Failed to fetch announcements', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setLoading(true);
    setRefreshing(true);
    fetchData();
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

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={loading}>
      <Header
        leftAction="goBack"
        title={t(
          'Residential__Announcement__News_And_Announcement',
          'News & Announcement',
        )}
        titleColor="dark-gray"
        bgColor="bg-white"
      />
      <ScrollView
        className={
          isTablet
            ? getTheme('w-[780px] h-full bg-white')
            : getTheme('w-full h-full bg-white')
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View className="pb-10" style={{flexDirection: 'column'}}>
          <Spacing height={40} />

          <View className="px-5 space-y-3">
            {announcements.map(
              ({id, title, imageUrl, description, announcementDate}) => (
                <View className="w-full" key={id}>
                  <View className="px-4 border flex flex-col border-line-light w-full">
                    <View className="py-6 flex flex-row justify-between items-center">
                      <TouchableOpacity
                        className="flex-1 flex-col"
                        onPress={() => {
                          navigation.navigate('AnnouncementDetailScreen', {
                            id,
                            title,
                            description,
                            imageUrl,
                          });
                        }}>
                        {imageUrl !== null && (
                          <View className="w-full mb-2">
                            <Image
                              className="w-full aspect-[3/1]"
                              resizeMode="cover"
                              source={{
                                uri: imageUrl,
                              }}></Image>
                          </View>
                        )}
                        <Text
                          weight="bold"
                          numberOfLines={1}
                          className={getTheme(
                            'w-full text-[16px] text-[#1B1B1B] font-medium',
                          )}>
                          {title}
                        </Text>
                        <Text
                          className={getTheme(
                            'text-subtitle-muted break-all text-xs text-wrap',
                          )}
                          numberOfLines={2}>
                          {description}
                        </Text>
                        {announcementDate !== undefined && (
                          <Text
                            className={getTheme(
                              'text-subtitle-muted break-all text-xs mt-1',
                            )}
                            numberOfLines={1}>
                            {parseDateFormat(parseInt(announcementDate))}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ),
            )}
          </View>
        </View>
        {Platform.OS === 'ios' && <Spacing height={120} />}
      </ScrollView>
    </ScreenContainer>
  );
};

export default AnnouncementsScreen;
