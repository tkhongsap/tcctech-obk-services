/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Spacing, Text, textWeightVariantTextEditor} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Screen} from '~/components/templates';
import SustainabilityLayout1 from '../components/SustainabilityLayout1';
import LinearGradient from 'react-native-linear-gradient';
import SustainabilityLayout2 from '../components/SustainabilityLayout2';
import {
  IBannerItem,
  IBannerSustain,
  IContentLayout,
} from '../components/ISustainability';
import SustainabilityLayout3 from '../components/SustainabilityLayout3';
import {Fetch} from '~/utils/fetch/fetch';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {AnimtedAppBar} from '~/components/molecules/AnimtedAppBar';
import Swiper from 'react-native-swiper';
import RenderHtml from 'react-native-render-html';
import {
  HTMLRenderTextClassStyles,
  HTMLRenderTextTagsStyles,
  replaceTextHtml,
} from '../components/HtmlRenderTextClassStyles';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import {activeOpacity} from '~/constants';
import {HomeHeaderBGWhite} from '~/features/home/components/HomeHeaderBGWhite';
import {useHookstate} from '@hookstate/core';
import {logScreenView} from '~/utils/logGA';

const SustainabilityScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const currentLanguage =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  const nHeightHeader = Platform.OS === 'ios' ? 115 : 65;
  let scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, nHeightHeader);
  const translateY = diffClamp.interpolate({
    inputRange: [0, nHeightHeader],
    outputRange: [0, -nHeightHeader],
  });
  let nWidth = Dimensions.get('window').width;
  const nBannerHeight = 500;

  const [objBanner, setObjBanner] = useState<IBannerSustain>({
    lstBannerA: [],

    sPathBannerRole1B: '',
    sTextBannerRole1B1: null,
    sTextBannerRole1B2: null,

    sPathBannerRole2B: '',
    sTextBannerRole2B1: null,
    sTextBannerRole2B2: null,

    sPathBannerC: '',
    sTextBannerC1: null,
    sTextBannerC2: null,

    sPathCoverLayoutC: '',
    nTimeSlideBanner: null,
  });

  const [lstContent, setLstContent] = useState<IContentLayout[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const GetContent = useCallback(async () => {
    let objParam = {
      sLanguage: currentLanguage || 'en',
    };

    const res = await Fetch('GetContent', objParam);
    return res;
  }, [currentLanguage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetContent()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          setObjBanner(resp.objBanner as IBannerSustain);
          setLstContent(resp.lstMainContent as IContentLayout[]);
        }
        setRefreshing(false);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetContent]);

  const handlePressBanner = (objBannerItem: IBannerItem) => {
    if (objBannerItem.nType === 1) {
      navigation.navigate('NormalContentScreen', {
        id: objBannerItem.sID,
        isBanner: true,
      });
    } else {
      handleOpenURL(objBannerItem.sLinkToURL + '');
    }
  };

  const handleOpenURL = (sURL: string) => {
    navigation.navigate('NotificationDeeplink', {
      url: sURL,
    });
  };

  useEffect(() => {
    GetContent()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          setObjBanner(resp.objBanner as IBannerSustain);
          setLstContent(resp.lstMainContent as IContentLayout[]);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetContent, currentLanguage]);

  const styles = StyleSheet.create({
    subBox: {
      width: Dimensions.get('window').width / 2 - 16,
      height: 80,
      borderRadius: 10,
    },
    subBoxFont: {
      fontSize: 18,
      lineHeight: 18,
      color: 'white',
      textAlign: 'center',
    },
    linearGradient: {
      flex: 1,
    },
    wrapperBanner: {
      height: nBannerHeight,
      backgroundColor: 'grey',
    },
  });

  useEffect(() => {}, [languageSelected]);

  useEffect(() => {
    logScreenView('SustainabilityScreen');
  }, []);

  return (
    <Screen>
      <StatusBar barStyle={'dark-content'} />
      <AnimtedAppBar translateY={translateY} height={nHeightHeader}>
        <HomeHeaderBGWhite isDark isRefreshing={refreshing} />
      </AnimtedAppBar>
      <ScrollView
        bounces={true}
        scrollEventThrottle={16}
        onScroll={e => {
          scrollY.setValue(
            e.nativeEvent.contentOffset.y < 0
              ? 0
              : e.nativeEvent.contentOffset.y,
          );
        }}
        className={'w-full'}
        testID="sustainability-scroll-view-id"
        contentContainerStyle={{paddingBottom: insets.bottom}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Pressable>
          <Spacing height={nHeightHeader} />
          <View>
            {/* PR Banner */}
            {!refreshing && objBanner.lstBannerA.length > 0 ? (
              <Swiper
                style={styles.wrapperBanner}
                autoplay
                autoplayTimeout={objBanner.nTimeSlideBanner ?? 3}
                loop={true}
                dot={
                  <View
                    style={{
                      backgroundColor: '#454541',
                      width: 25,
                      height: 3,
                      borderRadius: 4,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3,
                    }}
                  />
                }
                activeDot={
                  <View
                    style={{
                      backgroundColor: '#f5f5f4',
                      width: 100,
                      height: 3,
                      borderRadius: 4,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3,
                    }}
                  />
                }>
                {objBanner.lstBannerA.map(item => (
                  <View key={item.sID}>
                    <TouchableOpacity
                      activeOpacity={activeOpacity}
                      key={item.sImagePath}
                      onPress={() => handlePressBanner(item)}>
                      <FastImage
                        source={{
                          uri: item.sImagePath + '',
                          priority: FastImage.priority.low,
                        }}
                        style={{
                          width: Dimensions.get('window').width,
                          height: nBannerHeight,
                        }}>
                        <View
                          className="absolute bottom-[0] w-full"
                          style={{height: 200}}>
                          <LinearGradient
                            colors={[
                              'rgba(255, 255, 255, 0)',
                              'rgba(0, 0, 0, 0.4)',
                              'rgba(0, 0, 0, 1)',
                            ]}
                            style={styles.linearGradient}
                          />
                        </View>
                        {item.sText && (
                          <View className="absolute bottom-[10%] w-full">
                            <RenderHtml
                              contentWidth={nWidth}
                              classesStyles={HTMLRenderTextClassStyles}
                              tagsStyles={HTMLRenderTextTagsStyles}
                              source={{
                                html: replaceTextHtml(item.sText + ''),
                              }}
                              systemFonts={Object.values(
                                textWeightVariantTextEditor,
                              )}
                            />
                          </View>
                        )}
                      </FastImage>
                    </TouchableOpacity>
                  </View>
                ))}
              </Swiper>
            ) : (
              <View
                style={{
                  width: '100%',
                  height: nBannerHeight,
                  backgroundColor: 'gray',
                }}
              />
            )}

            <Spacing height={15} />

            {/* Walking & Digital Libraly */}
            <View
              style={{flexDirection: 'row', justifyContent: 'center', gap: 8}}>
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={() => {
                  navigation.navigate('WalkingSearchScreen');
                }}>
                <View>
                  <FastImage
                    source={{
                      uri: objBanner?.sPathBannerRole1B + '',
                      priority: FastImage.priority.low,
                    }}
                    style={styles.subBox}>
                    <View
                      className="absolute bottom-[0] w-full"
                      style={{height: 80}}>
                      <LinearGradient
                        colors={[
                          'rgba(4,55,20, 0.5)',
                          'rgba(4,55,20, 0.5)',
                          'rgba(4,55,20, 0.5)',
                        ]}
                        style={styles.linearGradient}
                      />
                    </View>
                    <View
                      className={`absolute ${
                        objBanner?.sTextBannerRole1B1 &&
                        objBanner?.sTextBannerRole1B2
                          ? 'top-[22]'
                          : 'top-[32]'
                      } items-center w-full`}>
                      {objBanner?.sTextBannerRole1B1 && (
                        <Text weight="bold" style={styles.subBoxFont}>
                          {objBanner?.sTextBannerRole1B1}
                        </Text>
                      )}
                      {objBanner?.sTextBannerRole1B2 && (
                        <Text weight="bold" style={styles.subBoxFont}>
                          {objBanner?.sTextBannerRole1B2}
                        </Text>
                      )}
                    </View>
                  </FastImage>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={() => navigation.navigate('DigitalLibraryScreen')}>
                <View>
                  <FastImage
                    source={{
                      uri: objBanner?.sPathBannerC + '',
                      priority: FastImage.priority.low,
                    }}
                    style={styles.subBox}>
                    <View
                      className="absolute bottom-[0] w-full"
                      style={{height: 80}}>
                      <LinearGradient
                        colors={[
                          'rgba(13,49,49, 0.5)',
                          'rgba(13,49,49, 0.5)',
                          'rgba(13,49,49, 0.5)',
                        ]}
                        style={styles.linearGradient}
                      />
                    </View>
                    <View
                      className={`absolute ${
                        objBanner?.sTextBannerC1 && objBanner?.sTextBannerC2
                          ? 'top-[22]'
                          : 'top-[32]'
                      } items-center w-full`}>
                      {objBanner?.sTextBannerC1 && (
                        <Text weight="bold" style={styles.subBoxFont}>
                          {objBanner?.sTextBannerC1}
                        </Text>
                      )}
                      {objBanner?.sTextBannerC2 && (
                        <Text weight="bold" style={styles.subBoxFont}>
                          {objBanner?.sTextBannerC2}
                        </Text>
                      )}
                    </View>
                  </FastImage>
                </View>
              </TouchableOpacity>
            </View>

            {/* List Content */}
            {lstContent.map((item, index) =>
              item.nLayoutType === 1 ? (
                <View key={item.sTitle}>
                  {lstContent[index - 1]?.nLayoutType !== 3 ? (
                    <Spacing height={35} />
                  ) : (
                    <Spacing height={20} />
                  )}
                  <SustainabilityLayout1
                    nLayoutType={item.nLayoutType}
                    sTitle={item.sTitle}
                    sIntroduce={item.sIntroduce}
                    lstSub={item.lstSub}
                  />
                  {lstContent.length === index + 1 && <Spacing height={15} />}
                </View>
              ) : item.nLayoutType === 2 ? (
                <View key={item.sTitle}>
                  {lstContent[index - 1]?.nLayoutType !== 3 ? (
                    <Spacing height={35} />
                  ) : (
                    <Spacing height={20} />
                  )}
                  <SustainabilityLayout2
                    nLayoutType={item.nLayoutType}
                    sTitle={item.sTitle}
                    sIntroduce={item.sIntroduce}
                    lstSub={item.lstSub}
                  />
                  {lstContent.length === index + 1 && <Spacing height={15} />}
                </View>
              ) : item.nLayoutType === 3 ? (
                <View key={item.sTitle}>
                  {lstContent[index - 1]?.nLayoutType !== 3 && (
                    <Spacing height={35} />
                  )}
                  <SustainabilityLayout3
                    nLayoutType={item.nLayoutType}
                    sLayoutBackground={item.sLayoutBackground}
                    sTitle={item.sTitle}
                    sIntroduce={item.sIntroduce}
                    lstSub={item.lstSub}
                  />
                </View>
              ) : (
                <></>
              ),
            )}
          </View>
        </Pressable>
      </ScrollView>
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

export default SustainabilityScreen;
