/* eslint-disable react-native/no-inline-styles */
import {useHookstate} from '@hookstate/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import clsx from 'clsx';
import {t} from 'i18next';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {Text} from '~/components/atoms';
import ArtCBackHeader from '~/features/artCulture/components/ArtCBackHeader';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {artCultureServices} from '~/services/artCultureService';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import authenState from '~/states/authen/authenState';
import firebaseConfigState from '~/states/firebase';
import {numberFormatter} from '~/utils/number';
import {logScreenView, logEvent} from '~/utils/logGA';
import MemberOnlyModal from '~/features/artCulture/components/MemberOnlyModal';
import {useFocusEffect} from '@react-navigation/native';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'WalkingSelectRouteScreen'
>;

export interface IRouteItem {
  id: number;
  time: number;
  title: string;
  subTitle: string;
  description: string;
  mins: string;
  distance: number;
  calories: string;
  steps: string;
  thumbnail: string;
  image: string;
  routeIds: string[];
}

const WalkingSelectRouteScreen = ({
  route: {
    params: {timeValue},
  },
}: Props) => {
  const navigation = useNavigation();

  const enabledBookmarkContent =
    firebaseConfigState.enable_bookmark_wmm_dgl_content.value;

  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const [content, setContent] = useState<IRouteItem[]>([]);
  // const [selectedMap, setSelectedMap] = useState<number | null>(null);

  const fetchContent = async () => {
    let items: IRouteItem[] = [];

    await artCultureServices
      .fetchWalkingMeetingMaps(languageSelected)
      .then(res => {
        const {data} = res.data;
        items = data.filter((item: IRouteItem) => item.time === timeValue);
      })
      .catch(err => {
        console.error(err);
      });

    if (items.length === 0) {
      navigation.goBack();
    }

    setContent(items);
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeValue]);

  const [bookmarkRouteIds, setBookmarkRouteIds] = useState<string[]>([]);
  const [isFetchBookmarkDone, setIsFetchBookmarkDone] =
    useState<boolean>(false);
  const fetchBookmark = () => {
    artCultureServices
      .getBookmarkByType('walking_meeting_map_route')
      .then(res => {
        const {data} = res.data;
        setBookmarkRouteIds(data.map((item: any) => item.contentId));
      })
      .catch(error => {
        console.warn('error =>', error);
      })
      .finally(() => {
        setIsFetchBookmarkDone(true);
      });
  };

  useEffect(() => {
    if (authenState && authenState.token.value) {
      fetchBookmark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenState]);

  const [isMemberOnlyModalVisible, setIsMemberOnlyModalVisible] =
    useState(false);
  const handleBookmarkAction = (itemId: string) => {
    if (!authenState.token.value) {
      setIsMemberOnlyModalVisible(true);
      return;
    }

    if (!isFetchBookmarkDone) {
      return;
    }

    if (bookmarkRouteIds.includes(`${itemId}`)) {
      artCultureServices
        .deleteBookmark('walking_meeting_map_route', itemId)
        .then(() => {
          setBookmarkRouteIds(
            bookmarkRouteIds.filter(item => item !== `${itemId}`),
          );
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    } else {
      artCultureServices
        .createBookmark('walking_meeting_map_route', itemId)
        .then(() => {
          setBookmarkRouteIds([...bookmarkRouteIds, `${itemId}`]);
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (authenState && authenState.token.value && enabledBookmarkContent) {
        fetchBookmark();
      }
    }, [enabledBookmarkContent]),
  );

  useEffect(() => {
    logScreenView('WalkingSelectRouteScreen');
  }, []);

  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />

      {isMemberOnlyModalVisible && (
        <MemberOnlyModal onClose={() => setIsMemberOnlyModalVisible(false)} />
      )}

      <ArtCBackHeader
        title={t('Sustain_Walking_Page_Title', 'Walking Meeting Map')}
      />
      <View className="relative" style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full h-screen pb-[84px]"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            <View className="py-4 px-4">
              <Text className="text-2xl font-obMedium">
                {t('Select_Route', 'Select Route')}
              </Text>
            </View>

            <View className="px-4 pt-4">
              {content.map((item, index) => (
                <Pressable
                  key={`${item.time}-${index}`}
                  className={clsx(['p-4 border mb-4 border-line-light'])}
                  onPress={() => {
                    const eventSelectRoute = {
                      title_name: item.title,
                      screen_name: 'WalkingSelectRouteScreen',
                      feature_name: '[Option 1] Static Walking Meeting map',
                      action_type: 'click',
                      bu: 'Sustainability',
                    };
                    logEvent('button_click', eventSelectRoute);

                    navigation.navigate('WalkingMapRouteScreen', {
                      id: item.id,
                    });
                  }}>
                  <View className="flex flex-row justify-between w-full pb-4 border-b border-line-light">
                    <View className="flex-shrink">
                      <Text className="font-obMedium pr-4">{item.title}</Text>
                    </View>

                    <View className="flex-shrink-0">
                      <Text className="font-obMedium">
                        {numberFormatter(`${item.distance}`, 0)}{' '}
                        {t('Meter', 'm')}
                      </Text>
                    </View>
                  </View>

                  <View className="relative mt-4">
                    {enabledBookmarkContent ? (
                      <Pressable
                        className="absolute top-0 right-2 z-10 flex flex-row items-center justify-center bg-white-fade-light w-[40px] h-[40px] ml-2 mt-2 rounded-[4px]"
                        onPress={() => handleBookmarkAction(`${item.id}`)}>
                        <Image
                          source={
                            bookmarkRouteIds.includes(`${item.id}`)
                              ? require('../../../assets/artc/icons/icon-star-solid.png')
                              : require('../../../assets/artc/icons/icon-star-outline.png')
                          }
                          className="w-[20px] h-[20px]"
                        />
                      </Pressable>
                    ) : (
                      <View />
                    )}

                    <Image
                      className="w-full h-[200px]"
                      source={{uri: item.thumbnail}}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};

export default WalkingSelectRouteScreen;
