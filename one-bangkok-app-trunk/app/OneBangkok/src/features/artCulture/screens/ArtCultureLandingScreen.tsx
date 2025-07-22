import {useHookstate} from '@hookstate/core';
import clsx from 'clsx';
import dayjs from 'dayjs';
import {map} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {Text} from '~/components/atoms';
import {AnimtedAppBar} from '~/components/molecules/AnimtedAppBar';
import Loading from '~/components/organisms/Loading';
import {Screen} from '~/components/templates';
import {bookingSettingAction} from '~/features/booking/state/booking-setting';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import {HomeHeaderBGWhite} from '~/features/home/components/HomeHeaderBGWhite';
import {ILandingPage, IProgram, mappingLandingPage} from '~/models/ArtCulture';
import {useNavigation} from '~/navigations/AppNavigation';
import {artCultureServices} from '~/services/artCultureService';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import firebaseConfigState from '~/states/firebase';
import t from '~/utils/text';
import ArtCMenuItem from '../components/ArtCMenuItem';
import LightButton from '../components/base/LightButton';
import ProgramFullDetailItem from '../components/ProgramFullDetailItem';
import ProgramSlider from '../components/ProgramSlider';
import {logScreenView, logEvent} from '~/utils/logGA';

const ArtCultureLandingScreen = () => {
  const navigation = useNavigation();

  const nHeightHeader = Platform.OS === 'ios' ? 115 : 65;
  let scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, nHeightHeader);
  const translateY = diffClamp.interpolate({
    inputRange: [0, nHeightHeader],
    outputRange: [0, -nHeightHeader],
  });

  const enableArtCultureMap = firebaseConfigState.enable_art_culture_map.value;

  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const loadedContent = useRef('');

  const [content, setContent] = useState<ILandingPage>();
  const [programFilter, setProgramFilter] = useState<number | null>(null);
  const [availableBookingProgram, setAvailableBookingProgram] = useState<
    Record<number, boolean>
  >({});

  const fetchContent = () => {
    artCultureServices
      .fetchLandingPage(languageSelected)
      .then(res => {
        const {data} = res.data;
        setContent(mappingLandingPage(languageSelected, data));
        return data;
      })
      .then(data => {
        return bookingSettingAction.fetchAvailablePrograms(
          map(data.programs, 'id'),
          dayjs(),
        );
      })
      .then(availablePrograms => {
        setAvailableBookingProgram(availablePrograms);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (!loadedContent.current || loadedContent.current !== languageSelected) {
      loadedContent.current = languageSelected;
      fetchContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageSelected]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchContent();
    setRefreshing(false);
  };

  useEffect(() => {
    logScreenView('ArtCultureLandingScreen');
  }, []);

  return (
    <Screen>
      <StatusBar barStyle={'dark-content'} />
      <AnimtedAppBar translateY={translateY} height={nHeightHeader}>
        <HomeHeaderBGWhite isDark isRefreshing={refreshing} />
      </AnimtedAppBar>
      {content ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full"
          bounces={true}
          scrollEventThrottle={16}
          onScroll={e => {
            scrollY.setValue(
              e.nativeEvent.contentOffset.y < 0
                ? 0
                : e.nativeEvent.contentOffset.y,
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            {content.highlightPrograms.length > 0 && (
              <View style={{paddingTop: nHeightHeader}}>
                <ProgramSlider
                  items={content.highlightPrograms}
                  autoplay={content.highlightAutoPlay || 5}
                  artCTypes={content.artCTypes}
                />
              </View>
            )}

            {content.sectionOrder.map(section => {
              if (section === 'art+c') {
                return (
                  <View key={`lading-section-item-${section}`}>
                    {content.artCTypes.length > 0 && (
                      <View className="w-full px-2 pt-10">
                        <View className="px-2">
                          <Text className="text-2xl font-obMedium">
                            {content.translation.content.artCTitle}
                          </Text>
                          <Text className="text-vp-pass-desc-light">
                            {content.translation.content.artCDesc}
                          </Text>
                        </View>

                        <View className="flex flex-row flex-wrap justify-between w-full pt-4">
                          {content.artCTypes.map(item => (
                            <ArtCMenuItem
                              key={`lading-page-art-c-menu-item-${item.id}`}
                              item={item}
                            />
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              }

              if (enableArtCultureMap && section === 'map') {
                return (
                  <View
                    key={`lading-section-item-${section}`}
                    className="pt-10">
                    <View className="px-4">
                      <Text className="text-2xl font-obMedium">
                        {content.translation.content.artMapTitle}
                      </Text>
                      <Text className="text-vp-pass-desc-light">
                        {content.translation.content.artMapDesc}
                      </Text>
                    </View>

                    <Pressable
                      className="w-full pt-4"
                      onPress={() => {
                        const eventParams = {
                          title_name: content.translation.content.artMapTitle,
                          screen_name: 'ArtCultureLandingScreen',
                          feature_name: 'Art Map',
                          action_type: 'click',
                          bu: 'Art & Culture',
                        };

                        logEvent('button_click', eventParams);
                        navigation.navigate('ArtCultureArtMapScreen');
                      }}>
                      <Image
                        source={require('../../../assets/artc/map-thumbnail.png')}
                        className="w-full"
                        style={{height: Dimensions.get('screen').width / 1.95}}
                      />
                    </Pressable>
                  </View>
                );
              }

              if (section === 'programs') {
                return (
                  <View
                    key={`lading-section-item-${section}`}
                    className="w-full pt-10">
                    <View className="w-full px-4">
                      <Text className="text-2xl font-obMedium">
                        {content.translation.content.programTitle}
                      </Text>
                      <Text className="text-vp-pass-desc-light">
                        {content.translation.content.programDesc}
                      </Text>
                    </View>

                    <ScrollView
                      className="pl-2 pt-4"
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <Pressable
                        className={clsx([
                          'ml-2 px-3 border border-jet-black-light',
                          programFilter === null && 'bg-jet-black-light',
                        ])}
                        onPress={() => setProgramFilter(null)}>
                        <Text
                          className={clsx([
                            programFilter === null && 'text-white',
                          ])}>
                          {t('ArtCulture__All', 'All')}
                        </Text>
                      </Pressable>

                      {content.artCTypes.map(item => {
                        const isTypeHasProgram = content.programs.some(
                          pItem => pItem.artCTypeId === item.id,
                        );

                        if (!isTypeHasProgram) {
                          return null;
                        }

                        return (
                          <Pressable
                            key={`lading-page-program-filter-${item.id}`}
                            className={clsx([
                              'ml-2 px-3 border border-jet-black-light',
                              programFilter === item.id && 'bg-jet-black-light',
                            ])}
                            onPress={() => setProgramFilter(item.id)}>
                            <Text
                              className={clsx([
                                programFilter === item.id && 'text-white',
                              ])}>
                              {item.artCTranslation.title}
                            </Text>
                          </Pressable>
                        );
                      })}
                      <View className="w-4" />
                    </ScrollView>

                    {content.programs.filter(
                      item => item.artCTypeId === programFilter,
                    ).length > 0 || !programFilter ? (
                      <View>
                        {content.programs && content.programs.length > 0 ? (
                          <ScrollView
                            className="pt-10"
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {programFilter ? (
                              <>
                                {content.programs.map(
                                  (item: IProgram) =>
                                    item.artCTypeId === programFilter && (
                                      <ProgramFullDetailItem
                                        key={`lading-page-program-full-detail-w-filter-${item.artCTypeId}-${item.id}`}
                                        item={{
                                          ...item,
                                          isGetTicketAvailable:
                                            availableBookingProgram[item.id],
                                        }}
                                      />
                                    ),
                                )}
                              </>
                            ) : (
                              <>
                                {content.programs.map((item: IProgram) => (
                                  <ProgramFullDetailItem
                                    key={`lading-page-program-full-detail-${item.artCTypeId}-${item.id}`}
                                    item={{
                                      ...item,
                                      isGetTicketAvailable:
                                        availableBookingProgram[item.id],
                                    }}
                                  />
                                ))}
                              </>
                            )}
                            <View className="w-4" />
                          </ScrollView>
                        ) : (
                          <View className="w-full px-4 py-12">
                            <Text className="text-vp-pass-desc-light text-center">
                              {t(
                                'ArtCulture__No_Programs_In_Type',
                                'There is no programs',
                              )}
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View className="w-full px-4 py-12">
                        <Text className="text-vp-pass-desc-light text-center">
                          {t(
                            'ArtCulture__No_Programs_In_Type',
                            'There is no programs',
                          )}
                        </Text>
                      </View>
                    )}
                    <View className="pt-3 px-4">
                      {content.programs && content.programs.length > 0 ? (
                        <LightButton
                          onPress={() => {
                            navigation.navigate(
                              'ArtCultureSearchProgramScreen',
                            );
                          }}>
                          {t(
                            'ArtCulture__View_All_Programs',
                            'View All Program',
                          )}
                        </LightButton>
                      ) : (
                        <View />
                      )}
                    </View>
                  </View>
                );
              }
            })}

            <View className="pt-8">
              <View className="flex flex-row items-center w-full bg-dark-gray-light">
                <View className="w-[65%] pt-6 pb-8 pl-4">
                  <Text className="text-lg leading-7 text-white font-obMedium">
                    {t(
                      'ArtCulture__Landing_Faq_Title',
                      'Frequent Asked Questions',
                    )}
                  </Text>
                  <Text className="text-vp-pass-desc-light text-sm pb-3">
                    {t(
                      'ArtCulture__Landing_Faq_Sub_Title',
                      'Quick answers to questions you might have',
                    )}
                  </Text>
                  <Pressable
                    className="w-full border border-light-silver-light rounded-md py-2 px-4"
                    onPress={() => {
                      navigation.navigate('ArtCultureFaqsScreen');
                    }}>
                    <Text className="text-sm text-white text-center font-obMedium">
                      {t('ArtCulture__Landing_View_Faq', 'View FAQ')}
                    </Text>
                  </Pressable>
                </View>
                <View className="relative w-[35%] h-[110%] ml-6 -mt-4">
                  <Image
                    className="absolute top-0 right-0 w-full h-full"
                    source={require('../../../assets/artc/faq-img.png')}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </Pressable>
        </ScrollView>
      ) : (
        <View className="relative w-full h-4/5 bg-default-light flex items-center justify-center">
          <Loading isLoading={true} />
        </View>
      )}

      <FloatingStickyMenu
        type="obNewIcon"
        width={30}
        height={30}
        color="white"
        rotation={0}
      />
    </Screen>
  );
};

export default ArtCultureLandingScreen;
