import {useHookstate} from '@hookstate/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Text} from '~/components/atoms';
import ArtCBackHeader from '~/features/artCulture/components/ArtCBackHeader';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {IRouteItem} from './WalkingSelectRouteScreen';
import ImageZoom from '~/features/residential/components/ImageZoom';
import dayjs from 'dayjs';
import {t} from 'i18next';
import clsx from 'clsx';
import {numberFormatter} from '~/utils/number';
import {artCultureServices} from '~/services/artCultureService';
import Loading from '~/components/organisms/Loading';
import firebaseConfigState from '~/states/firebase';
import WalkingMeetingMap from '../components/WalkingMeetingMap';
import {logScreenView, logEvent} from '~/utils/logGA';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'WalkingMapRouteScreen'
>;

export const MAP_STATES = {
  READY: 'ready',
  NAVIGATE: 'navigate',
  BEGINNING: 'beginning',
  IN_PROGRESS: 'in_progress',
  BREAK_OR_END: 'break_or_end',
  PAUSE: 'pause',
  END: 'end',
};

interface IWalkingTimestamp {
  startTimestamp: Date;
  endTimestamp?: Date;
}

const WalkingMapRouteScreen = ({
  route: {
    params: {id},
  },
}: Props) => {
  const inset = useSafeAreaInsets();
  const enableWalkingMapInteractive =
    firebaseConfigState.enable_walking_map_interactive.value;

  const navigation = useNavigation();

  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const [content, setContent] = useState<IRouteItem | null>(null);

  const fetchContent = async () => {
    let cnt: IRouteItem | null = null;
    await artCultureServices
      .fetchWalkingMeetingMap(id, languageSelected)
      .then(res => {
        const {data} = res.data;
        cnt = data;

        if (!enableWalkingMapInteractive) {
          setMapState(MAP_STATES.BEGINNING);
        }
      })
      .catch(err => {
        console.error(err);
      });

    if (!cnt) {
      navigation.goBack();
    }

    setContent(cnt);
  };

  const [mapState, setMapState] = useState<string>('ready');
  const [timestamp, setTimestamp] = useState<IWalkingTimestamp[]>([]);
  const handleMapState = (type: string) => {
    const eventParams = {
      title_name: content?.title,
      screen_name: 'WalkingMapRouteScreen',
      feature_name: '[Option 2] Interactive Walking Meeting Map',
      action_type: 'click',
      //button_name: 'Start_Walking',
      bu: 'sustainability',
    };
    logEvent('button_click', eventParams);

    if (mapState === MAP_STATES.READY && type === MAP_STATES.NAVIGATE) {
      setMapState(MAP_STATES.NAVIGATE);
    } else if (
      (mapState === MAP_STATES.READY || mapState === MAP_STATES.NAVIGATE) &&
      type === MAP_STATES.BEGINNING
    ) {
      setMapState(MAP_STATES.BEGINNING);
    } else if (mapState === MAP_STATES.BEGINNING) {
      setTimestamp([...timestamp, {startTimestamp: dayjs().toDate()}]);
      setMapState(MAP_STATES.IN_PROGRESS);
    } else if (mapState === MAP_STATES.IN_PROGRESS) {
      setMapState(MAP_STATES.BREAK_OR_END);
    } else if (mapState === MAP_STATES.BREAK_OR_END) {
      setMapState(MAP_STATES.BREAK_OR_END);
    } else if (mapState === MAP_STATES.PAUSE) {
      setTimestamp([...timestamp, {startTimestamp: dayjs().toDate()}]);
      setMapState(MAP_STATES.IN_PROGRESS);
    } else if (mapState === MAP_STATES.END) {
      navigation.navigate('WalkingSearchScreen');
    }
  };

  const onRouteArrived = () => {
    handleMapState(MAP_STATES.BEGINNING);
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [timeTracker, setTimeTracker] = useState<string>('00:00:00');
  const [distanceTracking, setDistanceTracking] = useState<string>('');
  const [displayResult, setDisplayResult] = useState<boolean>(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        (mapState === MAP_STATES.IN_PROGRESS || MAP_STATES.BREAK_OR_END) &&
        timestamp.length > 0
      ) {
        let seconds = 0;
        timestamp.forEach(item => {
          const endTimestamp = item.endTimestamp
            ? dayjs(item.endTimestamp)
            : dayjs();
          const startTimestamp = dayjs(item.startTimestamp);
          seconds += endTimestamp.diff(startTimestamp, 'second');
        });

        const formattedTime = dayjs
          .duration(seconds, 'seconds')
          .format('HH:mm:ss');
        setTimeTracker(formattedTime);

        setDistanceTracking(`${seconds * 0.733}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mapState, timestamp]);

  const [isBackToSelectRoute, setIsBackToSelectRoute] =
    useState<boolean>(false);
  useEffect(() => {
    const backAction = () => {
      setIsBackToSelectRoute(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    logScreenView('WalkingMapRouteScreen');
  }, []);

  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />

      {isBackToSelectRoute && (
        <View className="absolute w-full h-screen top-0 left-0 z-50">
          <Pressable
            className="w-full h-full absolute top-0 left-0"
            style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
            onPress={() => setIsBackToSelectRoute(false)}
          />
          <View className="bg-white absolute top-1/2 left-[5%] w-[90%] mx-auto h-[190px] -mt-[80px] rounded-lg p-4 flex flex-col justify-between">
            <Text className="text-xl font-bold text-center capitalize">
              {t('Go_Back_To_Select_Route_Title', 'Confirm to Select Route')}
            </Text>
            <Text className="pt-2 text-center">
              {t(
                'Go_Back_To_Select_Route_Desc',
                'Do you want to go to select route the time tracking would be lost?',
              )}
            </Text>
            <View className="flex flex-row justify-center pt-6 w-full">
              <View className="w-1/2 pr-2">
                <Pressable
                  className="w-full bg-muted-50-light border border-line-light py-3 px-4"
                  onPress={() => setIsBackToSelectRoute(false)}>
                  <Text className="text-center font-obMedium">
                    {t('General__Cancel', 'Cancel')}
                  </Text>
                </Pressable>
              </View>

              <View className="w-1/2 pl-2">
                <Pressable
                  className="w-full bg-white border border-jet-black-light py-3 px-4"
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Text className="text-center font-obMedium">
                    {t('General__Confirm', 'Confirm')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}

      {content && (
        <>
          {!enableWalkingMapInteractive && (
            <ArtCBackHeader
              title={content.title}
              hideBackBtn={
                mapState !== MAP_STATES.READY && mapState !== MAP_STATES.END
              }
            />
          )}

          <View className="relative h-full w-full" style={{flex: 1}}>
            {mapState === MAP_STATES.END && !displayResult && (
              <View
                className="absolute w-full h-full flex items-center justify-center z-50"
                style={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
                <Loading isLoading={true} />
              </View>
            )}

            {mapState !== MAP_STATES.READY &&
              mapState !== MAP_STATES.NAVIGATE &&
              mapState !== MAP_STATES.BEGINNING &&
              mapState !== MAP_STATES.END && (
                <View
                  className={clsx([
                    'absolute left-0 w-full px-4 z-20',
                    enableWalkingMapInteractive ? 'py-6' : 'py-2',
                  ])}
                  style={{
                    backgroundColor: `rgba(255,255,255,${
                      enableWalkingMapInteractive ? '1' : '0.75'
                    })`,
                    top: enableWalkingMapInteractive ? inset.top : 0,
                  }}>
                  <Text className="text-center">
                    {t('Duration', 'Duration')}
                  </Text>
                  <Text className="text-2xl font-obBold text-center">
                    {timeTracker}
                  </Text>
                </View>
              )}

            {enableWalkingMapInteractive ? (
              <WalkingMeetingMap
                mapState={mapState}
                routeItem={content}
                navigateToRoute={
                  mapState === MAP_STATES.NAVIGATE ? true : false
                }
                handleRouteArrived={() => onRouteArrived()}
              />
            ) : (
              <View className="overflow-hidden">
                <ImageZoom
                  source={{uri: content.image}}
                  styles={styles.zoomImageContainer}
                />
              </View>
            )}

            {mapState === MAP_STATES.READY && (
              <View
                className={clsx([
                  'absolute z-20 bottom-0 left-0 w-full py-4 px-4 pb-12 bg-white',
                ])}>
                <Text className="font-obMedium text-2xl pb-1">
                  {t('Walking_Route', 'Walking Route')}
                </Text>
                <Text>
                  {t(
                    'Walking_Route_Get_Direction_Desc',
                    "Are you interested in walking on this route? Let's navigate to your selected route.",
                  )}
                </Text>

                <Pressable
                  className="w-full flex flex-row justify-center pt-4"
                  onPress={() => handleMapState(MAP_STATES.NAVIGATE)}>
                  <View className="w-full border-2 border-navy-light bg-white py-2 px-4">
                    <Text className="text-navy-light text-center font-obMedium">
                      {t('Get_Walking_Direction', 'Get Direction')}
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <View className="w-full flex flex-row justify-center pt-4">
                    <View className="w-full border-2 border-[#D00003] bg-white py-2 px-4">
                      <Text className="text-[#D00003] text-center font-obMedium">
                        {t('General__Exit', 'Exit')}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            )}

            {mapState === MAP_STATES.NAVIGATE && (
              <View
                className={clsx([
                  'absolute z-20 bottom-0 left-0 w-full pt-4 px-4 pb-12 bg-white',
                ])}>
                <Text>
                  {t(
                    'Go_Bank_To_Select_Route_On_Navigate',
                    'Do you want to go back and select a new route?',
                  )}
                </Text>
                <Pressable
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <View className="w-full flex flex-row justify-center pt-4">
                    <View className="w-full border-2 border-[#D00003] bg-white py-2 px-4">
                      <Text className="text-[#D00003] text-center font-obMedium">
                        {t('General__Exit', 'Exit')}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            )}

            {mapState === MAP_STATES.BEGINNING && (
              <View className="absolute bottom-0 left-0 w-full z-10 bg-white p-4">
                <Text className="font-obMedium text-2xl pb-1">
                  {t(
                    'Walking_You_Have_Arrived_Title',
                    'You have arrived at the route',
                  )}
                </Text>
                <Text className="pb-4">
                  {t(
                    'Walking_You_Have_Arrived_Desc',
                    'Are you ready to start walking on this route?',
                  )}
                </Text>
                <View className="pt-2">
                  <Pressable
                    className="bg-navy-light px-4 py-2 mb-4 border-2 border-navy-light"
                    onPress={() => {
                      handleMapState('');
                    }}>
                    <Text className="text-white text-center font-obMedium">
                      {t('Start_Walking', 'Start Walking')}
                    </Text>
                  </Pressable>

                  <Pressable
                    className="px-4 py-2 mb-4 border-[#D00003] border-2 bg-white"
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    <Text className="text-[#D00003] text-center font-obMedium">
                      {t('General__Exit', 'Exit')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {mapState !== MAP_STATES.BEGINNING &&
              mapState !== MAP_STATES.BREAK_OR_END &&
              mapState !== MAP_STATES.END && (
                <View
                  className={clsx(['absolute z-10 bottom-0 left-0 w-full'])}>
                  <Pressable
                    className={clsx([
                      'flex flex-row items-center justify-between py-4 px-4 pb-12',
                      mapState === MAP_STATES.IN_PROGRESS ||
                      mapState === MAP_STATES.PAUSE
                        ? 'bg-white-fade-light'
                        : 'bg-black-light',
                    ])}
                    onPress={() => handleMapState('')}>
                    {mapState === MAP_STATES.BEGINNING && (
                      <>
                        <Text className="text-white">
                          {t('Start_Meeting', 'Start meeting')}
                        </Text>
                      </>
                    )}
                    {mapState === MAP_STATES.IN_PROGRESS && (
                      <>
                        <View className="w-full flex flex-row justify-center pt-4">
                          <View className="w-[90%] border-2 border-[#D00003] bg-white py-2 px-4">
                            <Text className="text-[#D00003] text-center font-obMedium">
                              {t('Stop_Meeting', 'Stop walking')}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
                    {mapState === MAP_STATES.PAUSE && (
                      <>
                        <View className="w-full flex flex-row justify-center pt-4">
                          <View className="w-[90%] border-2 border-navy-light bg-white py-2 px-4">
                            <Text className="text-navy-light text-center font-obMedium">
                              {t('Resume_Meeting', 'Resume meeting')}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
                    {mapState === MAP_STATES.END && (
                      <Text className="text-white">
                        {t('Sustain_Walking_Page_Title', 'Walking Meeting Map')}
                      </Text>
                    )}
                  </Pressable>
                </View>
              )}

            {mapState === MAP_STATES.BREAK_OR_END && (
              <View className="absolute bottom-0 left-0 w-full z-10 bg-white p-4">
                <Text className="font-obMedium text-2xl pb-1">
                  {t('Meeting_Stopped', 'Meeting Stopped')}
                </Text>
                <Text className="pb-4">
                  {t(
                    'Meeting_Stopped_Desc',
                    'Do you want to end walking meeting or take a break?',
                  )}
                </Text>
                <View className="pt-2">
                  <Pressable
                    className="px-4 py-2 mb-4 border-danger-light border-2 bg-white"
                    onPress={() => {
                      timestamp[timestamp.length - 1].endTimestamp =
                        dayjs().toDate();
                      setTimestamp([...timestamp]);
                      setMapState(MAP_STATES.END);
                      setTimeout(() => {
                        setDisplayResult(true);
                      }, 1000);
                    }}>
                    <Text className="text-danger-light text-center font-obMedium">
                      {t('End_Meeting', 'End Meeting')}
                    </Text>
                  </Pressable>
                  <Pressable
                    className="bg-white px-4 py-2 mb-4 border-2 border-jet-black-light"
                    onPress={() => {
                      timestamp[timestamp.length - 1].endTimestamp =
                        dayjs().toDate();
                      setTimestamp([...timestamp]);
                      setMapState(MAP_STATES.PAUSE);
                    }}>
                    <Text className="text-jet-black-light text-center font-obMedium">
                      {t('Take_A_Break', 'Take a break')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {mapState === MAP_STATES.END && displayResult && (
              <>
                <View
                  className="absolute top-0 left-0 w-full h-full"
                  style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
                />

                <View
                  className="absolute bottom-20 left-0 right-0 p-4"
                  style={{backgroundColor: 'rgba(255,255,255,0.75)'}}>
                  <View className="pb-2 mb-2 border-b border-jet-black-light">
                    {/* <Text className="font-obMedium text-xs">
                    {t('Complete_Route', 'Complete Route')}
                  </Text> */}
                    <Text className="font-obMedium pt-1 pb-2">
                      {content.title}
                    </Text>
                    {/* <Text className="text-xs">{content.subTitle}</Text> */}
                  </View>
                  <View className="flex flex-row pt-2 pb-1">
                    <View className="w-1/2">
                      <Text className="text-xs">
                        {t('EstimateDistance', 'Estimate Distance')}
                      </Text>
                      <Text className="font-obMedium">
                        {/* {content.distance > 1000
                        ? `${content.distance / 1000} ${t('Kilometer', 'km')}`
                        : `${content.distance} ${t('Meter', 'm')}`} */}
                        {`${numberFormatter(`${distanceTracking}`, 2)} ${t(
                          'Meter',
                          'm',
                        )}`}
                      </Text>
                    </View>

                    <View className="w-1/2">
                      <Text className="text-xs">
                        {t('Duration', 'Duration')}
                      </Text>
                      <Text className="font-obMedium">{timeTracker}</Text>
                    </View>
                  </View>
                </View>

                <View
                  className={clsx(['absolute z-10 bottom-0 left-0 w-full'])}>
                  <Pressable
                    className="flex flex-row items-center justify-between py-4 px-4 pb-12 bg-black-light"
                    onPress={() => handleMapState('')}>
                    <Text className="text-white">
                      {t('Sustain_Walking_Page_Title', 'Walking Meeting Map')}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  zoomImageContainer: {
    width: '100%',
    height: '100%',
  },
});

export default WalkingMapRouteScreen;
