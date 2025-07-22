/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Linking,
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
import {
  Icon,
  Spacing,
  Text,
  textWeightVariantTextEditor,
} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Screen} from '~/components/templates';
import LinearGradient from 'react-native-linear-gradient';
import {IMainPage, IBannerItem} from '../components/IMarcom';
import {Fetch} from '~/utils/fetch/fetch';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {AnimtedAppBar} from '~/components/molecules/AnimtedAppBar';
import Swiper from 'react-native-swiper';
import SwiperV2 from 'react-native-swiper-android';
import RenderHtml from 'react-native-render-html';
import {
  HTMLRenderTextClassStyles,
  HTMLRenderTextTagsStyles,
  replaceTextHtml,
} from '../../sustainability/components/HtmlRenderTextClassStyles';
import Video, {VideoRef} from 'react-native-video';
import {IconButton, modalActions} from '~/components/molecules';
import {activeOpacity} from '~/constants';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import WhatHappenBox from '../components/WhatHappenBox';
import SpecialEventModal from '../components/SpecialEventModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {t} from 'i18next';
import {useHookstate} from '@hookstate/core';
import {parkingAction} from '~/features/buildingAccess/store/parking';
import {useScreenHook} from '~/services/EventEmitter';
import {WebSocketEventNames} from '~/screens/WebSocketEvent';
import {HomeHeader} from '~/features/home/components';
// import Orientation from 'react-native-orientation-locker';
import {logScreenView, logEvent} from '~/utils/logGA';
import messaging from '@react-native-firebase/messaging';
import {isEmpty} from 'lodash';
import {StackActions} from '@react-navigation/native';
import {MessageGetIndexResult} from 'ob-notification-sdk/dist/api';
import notificationAction from '~/features/notification/store';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import T from '~/utils/text';
import firebaseConfigState from '~/states/firebase';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import {memberState} from '~/features/buildingAccess/store/member';
import * as OB_PARKING_SDK from 'ob-parking-sdk';
import {ParkingDetailsGetParkingDetailUid200Response} from 'ob-parking-sdk/dist/api';
import {hideLoading, showLoading} from '~/states/loadingState';

const MainPageScreen = () => {
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
  let nWidthTemp = Dimensions.get('window').width;
  let nHeightTemp = Dimensions.get('window').height;
  let nWidth = nWidthTemp > nHeightTemp ? nHeightTemp : nWidthTemp;
  let nBannerHeight = 240;
  let nStatusBarIosHeight = 48;

  const videoRef = useRef<VideoRef>(null);
  const videoRefAndroid = useRef<VideoRef>(null);
  const [sIDPlay, setSIDPlay] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [parkingDetail, setParkingDetail] =
    useState<ParkingDetailsGetParkingDetailUid200Response>();
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const [objMainPage, setObjMainPage] = useState<IMainPage>({
    lstEvent: [],
    lstBanner: [],
    lstWhatHappen: [],
    lstExplore: [],
    nTimeSlideBanner: 3,
    canCheckDontShowEvent: false,
  });

  const [refreshing, setRefreshing] = useState(false);
  const nExploreBoxHeight = 130;

  const GetContent = useCallback(async () => {
    let objParam = {
      sLanguage: currentLanguage || 'en',
    };

    const res = await Fetch('GetContent', objParam, true);
    return res;
  }, [currentLanguage]);

  const togglePlay = (sID: string) => {
    setSIDPlay(sID);
  };

  const togglePaused = () => {
    setSIDPlay(null);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(true);

    if (Platform.OS === 'ios') {
      videoRef?.current?.presentFullscreenPlayer();
    } else {
      if (objMainPage.lstBanner.length > 1 && sIDPlay) {
        setSIDPlay(null);
        setTimeout(() => {
          videoRefAndroid?.current?.presentFullscreenPlayer();
        }, 200);
      } else {
        videoRefAndroid?.current?.presentFullscreenPlayer();
      }
    }
    // Orientation.lockToLandscape();
  };
  const toggleNotFullScreen = () => {
    setSIDPlay(null);
    setIsFullScreen(false);

    if (Platform.OS === 'ios') {
      videoRef?.current?.dismissFullscreenPlayer();
      // Orientation.unlockAllOrientations();
    } else {
      videoRefAndroid?.current?.dismissFullscreenPlayer();
      // Orientation.lockToPortrait();
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetContent()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          let lstResult = resp as IMainPage;
          //Check Show Event
          let lstDontShowAsync = await AsyncStorage.getItem(
            'lstNotShowSpecialEvent',
          );
          if (lstDontShowAsync) {
            let lstDontShowID = JSON.parse(lstDontShowAsync);
            lstDontShowID.forEach((sID: string) => {
              lstResult.lstEvent = lstResult.lstEvent.filter(
                f => f.sID !== sID,
              );
            });
          }
          setObjMainPage(lstResult as IMainPage);
        }
        setRefreshing(false);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetContent]);

  const handlePressBanner = (objBannerItem: IBannerItem) => {
    const eventParams = {
      title_name: objBannerItem.sTitle,
      screen_name: 'MainPageScreen',
      feature_name: 'Hero Banner',
      action_type: 'click',
      bu: 'MarCom',
    };

    logEvent('button_click', eventParams);

    if (objBannerItem.nType === 1) {
      navigation.navigate('MarcomContentScreen', {
        id: objBannerItem.sID,
        sMode: 'Banner',
        isBanner: true,
      });
    } else if (objBannerItem.nType === 2) {
      handleOpenURL(objBannerItem.sLinkToURL + '');
    } else {
      return null;
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
          let lstResult = resp as IMainPage;
          //Check Show Event
          let lstDontShowAsync = await AsyncStorage.getItem(
            'lstNotShowSpecialEvent',
          );
          if (lstDontShowAsync) {
            let lstDontShowID = JSON.parse(lstDontShowAsync);
            lstDontShowID.forEach((sID: string) => {
              lstResult.lstEvent = lstResult.lstEvent.filter(
                f => f.sID !== sID,
              );
            });
          }
          setObjMainPage(lstResult as IMainPage);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetContent, currentLanguage]);

  useEffect(() => {}, [languageSelected]);

  const delay = (ms: number | undefined) =>
    new Promise(res => setTimeout(res, ms));

  useScreenHook('WebSocket Elavator Main page', async event => {
    const data = event.data;
    switch (event.name) {
      case WebSocketEventNames.LIFTCALLED:
        modalActions.hide();
        await delay(1000);
        navigation.navigate('ElevatorDestinationScreen', {
          floor: data.floor_name,
          lift: data.lift_name,
        });
        break;
      case WebSocketEventNames.PARKING_AVAILABILITY_UPDATED:
        parkingAction.setParkingLots(event.data);
        break;
      default:
        break;
    }
  });

  const handlePressExplore = (sID: string) => {
    navigation.navigate('MarcomContentScreen', {
      id: sID,
      sMode: 'Explore',
      isBanner: false,
    });
  };

  const handlePressSeeAll = () => {
    navigation.navigate('AllWhatHappenScreen');
  };

  const styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
    },
    wrapperBanner: {
      height: nBannerHeight,
      backgroundColor: 'grey',
    },
    whatHappenBox: {
      width: '100%',
      height: 120,
      borderColor: '#ededed',
      borderWidth: 2,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      borderRadius: 10,
      zIndex: 10,
    },
    whatHappenText: {
      width: Dimensions.get('window').width - 160,
      paddingTop: 4,
      paddingLeft: 10,
      paddingRight: 10,
    },
    seeAllBox: {
      width: '100%',
      height: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    divider: {
      width: '100%',
      height: 2,
      backgroundColor: '#f9fafb',
    },
    dividerLast: {
      width: '100%',
      height: 2,
      backgroundColor: '#dcdcdc',
    },

    boxTextExplore: {
      padding: 5,
    },
    imageExplore: {
      width: nExploreBoxHeight,
      height: nExploreBoxHeight,
    },
    bannerActive: {
      backgroundColor: '#f5f5f4',
      width: 100,
      height: 3,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 0,
    },
    bannerInactive: {
      backgroundColor: '#454541',
      width: 25,
      height: 3,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 0,
    },
  });

  let stylesVideo = StyleSheet.create({
    container: {
      position: 'relative',
      width: nWidth,
    },
    video: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      zIndex: 1,
      height: nBannerHeight,
      width: nWidth,
    },
  });

  const renderBanner = (ref: React.LegacyRef<VideoRef> | undefined) => {
    return objMainPage.lstBanner.map((item, index) => (
      <View key={item.sID + '_' + index}>
        <Pressable
          key={item.sImagePath}
          onPress={() => handlePressBanner(item)}>
          {!item.isImage ? (
            <View style={stylesVideo.container}>
              <Video
                source={{
                  uri: item.sImagePath,
                }}
                ref={ref}
                repeat
                onEnd={() => setSIDPlay(null)}
                onError={e => console.log('error video', e)}
                style={stylesVideo.video}
                paused={sIDPlay !== item.sID}
                resizeMode={isFullScreen ? 'none' : 'cover'}
                fullscreenAutorotate
                onFullscreenPlayerDidDismiss={() => toggleNotFullScreen()}
              />

              <View
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  height: nBannerHeight,
                  width: nWidth,
                }}>
                <LinearGradient
                  colors={[
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0.4)',
                    'rgba(0, 0, 0, 1)',
                  ]}
                  style={styles.linearGradient}
                />
              </View>
              {item.sText && (
                <View
                  className="w-full px-3"
                  style={{
                    position: 'absolute',
                    top: nBannerHeight - 65,
                    zIndex: 3,
                  }}>
                  <RenderHtml
                    contentWidth={nWidth}
                    classesStyles={HTMLRenderTextClassStyles}
                    tagsStyles={HTMLRenderTextTagsStyles}
                    source={{
                      html: replaceTextHtml(item.sText + ''),
                    }}
                    systemFonts={Object.values(textWeightVariantTextEditor)}
                  />
                </View>
              )}
              <View
                className="w-full"
                style={{
                  position: 'absolute',
                  top: 95,
                  alignItems: 'center',
                  paddingRight: 10,
                  zIndex: 3,
                }}>
                {sIDPlay !== item.sID ? (
                  <IconButton
                    width={50}
                    height={50}
                    color="white"
                    type="playIcon"
                    onPress={() => togglePlay(item.sID)}
                    rotation={0}
                  />
                ) : (
                  <IconButton
                    width={50}
                    height={50}
                    color="white"
                    type="pauseIcon"
                    onPress={() => togglePaused()}
                    rotation={0}
                  />
                )}
              </View>
              {/* Hide Full Screen */}
              {/* <View
                className="w-full"
                style={{
                  position: 'absolute',
                  top: 190,
                  alignItems: 'flex-end',
                  paddingRight: 10,
                  zIndex: 3,
                }}>
                <IconButton
                  width={35}
                  height={35}
                  color="white"
                  type="fullScreenIcon"
                  onPress={() => toggleFullScreen()}
                  rotation={0}
                />
              </View> */}
            </View>
          ) : (
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
                style={{height: 240}}>
                <LinearGradient
                  colors={[
                    'rgba(0, 0, 0, 0.1)',
                    'rgba(0, 0, 0, 0.4)',
                    'rgba(0, 0, 0, 1)',
                  ]}
                  style={styles.linearGradient}
                />
              </View>
              {item.sText && (
                <View className="absolute bottom-[20%] w-full px-3">
                  <RenderHtml
                    contentWidth={nWidth}
                    classesStyles={HTMLRenderTextClassStyles}
                    tagsStyles={HTMLRenderTextTagsStyles}
                    source={{
                      html: replaceTextHtml(item.sText + ''),
                    }}
                    systemFonts={Object.values(textWeightVariantTextEditor)}
                  />
                </View>
              )}
            </FastImage>
          )}
        </Pressable>
      </View>
    ));
  };

  useEffect(() => {
    logScreenView('MainPageScreen');
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      navigateToNotificationDetail(remoteMessage.data);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          navigateToNotificationDetail(remoteMessage.data);
        }
      });

    return unsubscribe;
  }, []);

  const navigateToNotificationDetail = async (
    notificationData:
      | {
          [key: string]: string | object;
        }
      | undefined,
  ) => {
    if (
      notificationData &&
      notificationData.id &&
      !isEmpty(notificationData.id)
    ) {
      const result = await notificationAction.getMessage(
        notificationData.id.toString(),
      );
      if (result) {
        await notificationAction.markAsRead(result.id);
        navigation.dispatch(StackActions.push('AllNotificationsScreen'));
        navigation.navigate('NotificationDetailScreen', {
          messageData: result as MessageGetIndexResult,
        });
      }
    }
    // [Self-redemption] In case receipt validate cause of dynamic reason
    else if (notificationData && notificationData.type === 'self_redemption') {
      showLoading();
      const enable_shopper = firebaseConfigState.enable_shopper.value;
      const enableParkingRedemption =
        firebaseConfigState.enable_parking_redemption.value;
      let res;

      if (enable_shopper) {
        res = await OB_BMS_SDK.client.parkingTicketsV2AllDetails();
      } else {
        res = await OB_BMS_SDK.client.parkingTicketsAllDetails(
          memberState.id.value,
        );
      }
      let parkingDetailData:
        | ParkingDetailsGetParkingDetailUid200Response
        | undefined;
      if (enableParkingRedemption && res.data.data) {
        const parkingDetailResponse =
          await OB_PARKING_SDK.client.parkingDetailsGetParkingDetailUid(
            res.data.data?.id,
          );
        parkingDetailData = parkingDetailResponse.data;
        setParkingDetail(parkingDetailResponse.data);
      }
      hideLoading();
      if (!notificationData.reason && parkingDetailData) {
        navigation.navigate('ParkingAllRecieptScreen', {
          parkingDetailId: parkingDetailData.id,
        });
      } else {
        navigation.navigate('AnnouncementScreen', {
          type: 'error',
          title: T(
            'General__Unable_proceed',
            'We’re unable to proceed with your receipt',
          ),
          message: '',
          buttonText: t('General__View_all_receipts', 'View all receipts'),
          screenHook: 'MainPageScreen',
          errorType: 'selfRedemption',
          errorReason: notificationData.reason as string,
        });
      }
    } else {
      console.log('Invalid notification data:', notificationData);
    }
  };

  useScreenHook('MainPageScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        if (event.from.params.type === 'error') {
          navigation.navigate('ParkingAllRecieptScreen', {
            parkingDetailId: parkingDetail?.id || '',
          });
          break;
        } else if (event.from.params.type === 'success') {
          navigation.navigate('ParkingTicketScreen');
        }
        break;
      default:
        break;
    }
  });

  const [isFromDeeplink, setIsFromDeeplink] = useState(false);

  useEffect(() => {
    // Check if app was launched from a deeplink
    Linking.getInitialURL().then(url => {
      if (url) {
        setIsFromDeeplink(true);
      }
    });

    // Listen for future deeplinks (when app is already open)
    const subscription = Linking.addEventListener('url', ({url}) => {
      if (url) {
        setIsFromDeeplink(true);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Screen>
      {Platform.OS === 'ios' ? (
        <View
          className={'w-full'}
          style={{
            height: nStatusBarIosHeight,
            backgroundColor: 'white',
            zIndex: 10,
          }}>
          <StatusBar barStyle={'dark-content'} />
        </View>
      ) : (
        <StatusBar barStyle={'light-content'} />
      )}

      {objMainPage.lstEvent.length > 0 && !isFromDeeplink && (
        <SpecialEventModal
          lstEvent={objMainPage.lstEvent}
          lstBanner={[]}
          lstWhatHappen={[]}
          lstExplore={[]}
          nTimeSlideBanner={objMainPage.nTimeSlideBanner}
          canCheckDontShowEvent={objMainPage.canCheckDontShowEvent}
        />
      )}

      <AnimtedAppBar translateY={translateY} height={nHeightHeader}>
        <HomeHeader isDark isRefreshing={refreshing} />
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
        testID="macom-scroll-view-id"
        contentContainerStyle={{paddingBottom: insets.bottom}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Pressable>
          <Spacing
            height={
              nHeightHeader - (Platform.OS === 'ios' ? nStatusBarIosHeight : 0)
            }
          />
          <View>
            {/* PR Banner */}
            {!refreshing && objMainPage.lstBanner.length > 0 ? (
              Platform.OS === 'ios' ? (
                <Swiper
                  key={'swiper-ios'}
                  style={styles.wrapperBanner}
                  autoplay={!sIDPlay}
                  autoplayTimeout={objMainPage.nTimeSlideBanner}
                  loop={true}
                  onIndexChanged={() => setSIDPlay(null)}
                  loadMinimal={true}
                  loadMinimalSize={objMainPage.lstBanner.length}
                  loadMinimalLoader={<Text>Loading</Text>}
                  dot={<View style={styles.bannerInactive} />}
                  activeDot={<View style={styles.bannerActive} />}>
                  {renderBanner(videoRef)}
                </Swiper>
              ) : (
                <SwiperV2
                  key={'swiper-android'}
                  style={styles.wrapperBanner}
                  autoplay={!sIDPlay}
                  autoplayTimeout={objMainPage.nTimeSlideBanner}
                  loop={true}
                  loadMinimal={!!sIDPlay}
                  onIndexChanged={() => setSIDPlay(null)}
                  dot={<View style={styles.bannerInactive} />}
                  activeDot={<View style={styles.bannerActive} />}>
                  {renderBanner(videoRefAndroid)}
                </SwiperV2>
              )
            ) : (
              <View
                style={{
                  width: '100%',
                  height: nBannerHeight,
                  backgroundColor: 'gray',
                }}
              />
            )}

            <View className="px-3">
              {/* What's happening */}
              {objMainPage.lstWhatHappen.length > 0 && (
                <View>
                  <Spacing height={40} />
                  <Text
                    weight="medium"
                    style={{
                      fontSize: 24,
                      lineHeight: currentLanguage === 'en' ? 24 : 28,
                    }}>
                    {t('Mc_WhatHappening', "What's Happening")}
                  </Text>
                  <Spacing height={20} />
                  {objMainPage.lstWhatHappen.map((item, index) => (
                    <View key={item.sID + '_' + index}>
                      <WhatHappenBox {...item} />
                      <Spacing height={10} />
                    </View>
                  ))}

                  {/* See All */}
                  <Spacing height={6} />
                  <TouchableOpacity
                    activeOpacity={activeOpacity}
                    onPress={handlePressSeeAll}>
                    <View style={styles.seeAllBox}>
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}>
                        <Text weight="medium">{t('Mc_SeeAll', 'See All')}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}>
                        <Icon type={'right'} width={18} height={18} />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Spacing height={10} />

                  <View style={styles.divider} />
                </View>
              )}

              {/* Explore One Bangkok */}
              {objMainPage.lstExplore.length > 0 && (
                <View>
                  <Spacing height={35} />
                  <Text
                    weight="medium"
                    style={{
                      fontSize: 24,
                      lineHeight: currentLanguage === 'en' ? 24 : 28,
                    }}>
                    {t('Mc_Explore', 'Explore One Bangkok')}
                  </Text>
                  <Text
                    weight="regular"
                    style={{fontSize: 14, lineHeight: 16, color: '#808080'}}>
                    {t('Mc_TheHeartOfBangkok', 'The heart of Bangkok')}
                  </Text>
                  <Spacing height={15} />
                  <ScrollView horizontal={true}>
                    <Pressable>
                      <View style={{flexDirection: 'row', gap: 10}}>
                        {objMainPage.lstExplore.map((item, index) => (
                          <View key={item.sID + '_' + index}>
                            <TouchableOpacity
                              activeOpacity={activeOpacity}
                              onPress={() => handlePressExplore(item.sID)}>
                              <View>
                                <FastImage
                                  source={{
                                    uri: item.sCoverImagePath + '',
                                    priority: FastImage.priority.low,
                                  }}
                                  style={styles.imageExplore}>
                                  <View
                                    className="absolute bottom-[0] w-full"
                                    style={{height: nExploreBoxHeight}}>
                                    <LinearGradient
                                      colors={[
                                        'rgba(0, 0, 0, 0.3)',
                                        'rgba(0, 0, 0, 0.3)',
                                      ]}
                                      style={styles.linearGradient}
                                    />
                                  </View>
                                  <View className="absolute w-full">
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        height: nExploreBoxHeight,
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        weight="medium"
                                        style={{fontSize: 16, color: 'white'}}>
                                        {item.sTitle}
                                      </Text>
                                    </View>
                                  </View>
                                </FastImage>
                              </View>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </Pressable>
                  </ScrollView>
                  <Spacing height={35} />
                  <View style={styles.dividerLast} />
                </View>
              )}
            </View>

            <Spacing height={Platform.OS === 'ios' ? 30 : 80} />
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

export default MainPageScreen;
