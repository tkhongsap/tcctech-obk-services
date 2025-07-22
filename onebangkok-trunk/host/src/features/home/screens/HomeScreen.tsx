import React, {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  View,
  DeviceEventEmitter,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {HomeHeader} from '../components';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import accountAction from '~/states/account/accountAction';
import authenState, {useAuthenState} from '~/states/authen/authenState';
import {useNavigation} from '~/navigations/AppNavigation';
import {handleInitialUrl} from '~/helpers/deepLinking';
import getFCMToken, {setupInAppMessaging} from '~/utils/fcmToken';
import authenAction from '~/states/authen/authenAction';
import {useAccountState} from '~/states/account/accountState';
import _firebaseState from '~/states/firebase';
import {useHookstate} from '@hookstate/core';
import {CircleStickyButton} from '~/components/molecules/CircleStickyButton';
import {Button, modalActions} from '~/components/molecules';
import {Screen} from '~/components/templates';
import {useScreenHook} from '~/services/EventEmitter';
import {WebSocketEventNames} from '~/screens/WebSocketEvent';
import {ACTION_SHORTCUT} from '../constants/ActionShortcut';
import {find, isEmpty, isUndefined} from 'lodash';
import QuickActions from 'react-native-quick-actions';
import {AnimtedAppBar} from '~/components/molecules/AnimtedAppBar';
import {MessageData} from '~/utils/ob_sdk/services/ob_notification/index.interface';
import {
  memberAction,
  memberState,
} from '~/features/buildingAccess/store/member';
import ParkingAvailability from '../components/ParkingAvailability';
import {parkingAction} from '~/features/buildingAccess/store/parking';
import {apiEventEmitter} from '~/helpers/api';
import {buildingAccessAction} from '~/features/buildingAccess/store/buildingAccess';
import DateTime from '~/utils/datetime';
import FastImage from 'react-native-fast-image';
import {useBackHandler} from '~/utils/useBackHandler';
import firebaseConfigState from '~/states/firebase';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import NetInfo from '@react-native-community/netinfo';

const DEFAULT_IMAGE = require('../../../assets/images/home_bg.png');
import {usePermission} from '~/utils/permission';
import {logScreenView} from '~/utils/logGA';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {MessageGetIndexResult} from 'ob-notification-sdk/dist/api';
import notificationAction from '~/features/notification/store';
import * as notificationActions from '~/states/notification/notificationAction';
const UserInfoSection = (props: any) => {
  const getGreetingWord = () => {
    // Get the current time in Thailand time zone
    const currentDateTimeThailand = DateTime.getCurrentDateTime();

    // Get the hour of the current time in Thailand time zone
    const hour = currentDateTimeThailand.hour();

    // Determine the greeting based on the hour
    if (hour >= 0 && hour < 12) {
      return t('General__Good_morning', 'Good Morning');
    } else if (hour >= 12 && hour < 18) {
      return t('General__Good_afternoon', 'Good Afternoon');
    } else {
      return t('General__Good_Evening', 'Good Evening');
    }
  };

  const {profile} = props;

  if (profile) {
    return (
      <View className={`px-5 items-center ${getTheme('bg-navy')}`}>
        <Spacing height={40} />
        <Text size="H3" weight="medium" color="sky-blue">
          {getGreetingWord()}
        </Text>
        <Text size="H3" weight="medium" color="default-inverse">
          {t('HomeScreen__user_name', '{{firstName}} {{lastName}}', {
            firstName: profile.first_name,
            lastName: profile.last_name,
          })}
        </Text>
        <Spacing height={24} />
      </View>
    );
  } else {
    return null;
  }
};

interface BuildingAccessSectionInterface {
  isFsMember: boolean;
}

const BuildingAccessSection = (props: BuildingAccessSectionInterface) => {
  const {permissionList} = usePermission();
  const navigation = useNavigation();
  const {isFsMember} = props;
  if (!isFsMember) {
    return null;
  }

  const CheckPermission = () => {
    const isServiceRequestAccess =
      permissionList.canDoServiceRequest &&
      firebaseConfigState.enable_building_service.service_request.value;
    const isAcRequestAccess =
      permissionList.canDoACRequest &&
      firebaseConfigState.enable_building_service.air_conditioner_request.value;
    const isRedemptionAccess =
      memberState.redemption.value &&
      firebaseConfigState.enable_building_service.parking_redemption;

    if (isServiceRequestAccess || isAcRequestAccess || isRedemptionAccess) {
      return navigation.navigate('BuildingServiceScreen');
    } else {
      return navigation.navigate('AnnouncementContactScreen', {
        titleHeadText: t('General__Building_service', 'Building service'),
        tagline: t('General__One_bangkok', 'One Bangkok'),
        titleContent: t('Service__No_service__Header', 'Restricted access'),
        messageContent: t(
          'No_service__Description',
          'It seems you don’t currently have the permissions to request services. If you’d like to utilize this service, please contact our Building Management',
        ),
        type: 'unavailable',
      });
    }
  };
  return (
    <View className={`px-5 ${getTheme('bg-navy')}`}>
      <View className={'items-center'}>
        <Text size="B1" color="sky-blue">
          {t(
            'General__What_would_you_like_to_do_first?',
            'What would you like to do first?',
          )}
        </Text>
      </View>
      <Spacing height={24} />
      <Button
        title={t('General__Calling_elevator', 'Calling Elevator')}
        color="transparent"
        outlined
        rounded={false}
        leftIcon="elevatorWhite"
        buttonHeight={55}
        rightIcon="next"
        borderWidth="thin"
        rightIconColor="#fff"
        onPress={() => navigation.navigate('CallElevatorScreen')}
      />
      <Spacing height={12} />
      {memberState.can_preregister.value && (
        <>
          <Button
            title={t('General__Create_visitor_pass', 'Create Visitor Pass')}
            color="transparent"
            outlined
            rounded={false}
            leftIcon="createVisitorPassIcon"
            rightIcon="next"
            iconColor="#fff"
            rightIconColor="#fff"
            borderWidth="thin"
            buttonHeight={55}
            onPress={() => navigation.navigate('VisitorPassScreen')}
          />
          <Spacing height={12} />
        </>
      )}
      {firebaseConfigState.enable_building_service_homescreen_and_menu
        .value && (
        <>
          <Button
            title={t('General__Building_request', 'Building Request')}
            color="transparent"
            outlined
            rounded={false}
            leftIcon="settingIcon"
            rightIcon="next"
            iconColor="#fff"
            borderWidth="thin"
            rightIconColor="#fff"
            buttonHeight={55}
            onPress={() => CheckPermission()}
          />
          <Spacing height={12} />
        </>
      )}
      {firebaseConfigState.enable_aqi_homescreen_and_menu.value && (
        <Button
          title={t('General__Air_quality', 'Air Quality')}
          color="transparent"
          outlined
          rounded={false}
          leftIcon="aqTempIcon"
          rightIcon="next"
          iconColor="#fff"
          rightIconColor="#fff"
          buttonHeight={55}
          borderWidth="thin"
          onPress={() => navigation.navigate('AirQualityScreen')}
        />
      )}
      <Spacing height={12} />
    </View>
  );
};

const ShuttleBusSection = () => {
  const navigation = useNavigation();
  if (!firebaseConfigState.enable_shuttle_bus.value) {
    return null;
  }
  return (
    <View className={`px-5 ${getTheme('bg-navy')}`}>
      <Button
        title={t('General__Shuttle_bus', 'Shuttle Bus')}
        color="transparent"
        outlined
        rounded={false}
        leftIcon="elevatorWhite"
        buttonHeight={55}
        rightIcon="next"
        borderWidth="thin"
        rightIconColor="#fff"
        onPress={() => navigation.navigate('MapScreen')}
      />
      <Spacing height={40} />
    </View>
  );
};

const AnouncementSection = ({
  message,
  showSection,
}: {
  message: any;
  showSection: boolean;
}) => {
  const navigation = useNavigation();
  if (showSection) {
    return (
      <View className={`px-5 ${getTheme('bg-bar')}`}>
        <Spacing height={40} />
        <Text color="dark-red" weight="medium">
          {t('General__Announcement', 'Announcement')}
        </Text>
        <Spacing height={20} />
        <Text color="dark-gray" numberOfLines={4}>
          {message.title}
        </Text>
        <Spacing height={20} />
        <Button
          title={t('General__View_more_details', 'View more details')}
          outlined
          rounded={false}
          rightIcon="arrowRightIcon"
          iconColor="#fff"
          ghost
          className={`px-0 ${getTheme('text-dark-gray text-sm')}`}
          iconHeight={16}
          iconWidth={16}
          onPress={() =>
            navigation.navigate('NotificationDetailScreen', {id: message.id})
          }
        />
        <Spacing height={20} />
      </View>
    );
  } else {
    return <View />;
  }
};

const HomeScreen = () => {
  const {token} = useAuthenState();
  const {profile: globalProfile} = useAccountState();
  const [_, setProfile] = useState<any>(globalProfile.value || null);
  const firebaseState = useHookstate(_firebaseState);
  const navigation = useNavigation();
  const heightHeader = 300;
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, heightHeader);
  const translateY = diffClamp.interpolate({
    inputRange: [0, heightHeader],
    outputRange: [0, -heightHeader],
  });
  const [isFsMember, setIsFsMember] = useState(false);

  const [message, setMessage] = useState<MessageData>();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected!);
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      const routes = navigation.getState()?.routes;
      const noInternetConnectionScreenInRoute = find(routes, {
        name: 'NoInternetConnectionScreen',
      });
      if (!isUndefined(noInternetConnectionScreenInRoute)) {
        navigation.goBack();
      }
    } else {
      navigation.navigate('NoInternetConnectionScreen');
    }
  }, [isConnected, navigation]);

  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const setInappMessaging = useCallback(() => {
    setupInAppMessaging(false);
  }, []);

  useEffect(() => {}, [languageSelected]);

  useBackHandler(() => {
    return true;
  });

  const handleQuickActions = (type: string) => {
    switch (type) {
      case ACTION_SHORTCUT.MY_QR_CODE_ACTION:
        if (!isEmpty(authenState.token.value)) {
          navigation.navigate('BuildingAccessQrScreen');
        }
      default:
        break;
    }
  };

  useEffect(() => {
    const quickActionShortcut = DeviceEventEmitter.addListener(
      'quickActionShortcut',
      data => {
        if (data) {
          handleQuickActions(data.type);
        }
      },
    );
    QuickActions.popInitialAction()
      .then(data => {
        if (Platform.OS === 'android' && data) {
          handleQuickActions(data.type);
        }
      })
      .catch(console.error);
    return () => {
      quickActionShortcut.remove();
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const _profile = await accountAction.getProfile();
      setProfile(_profile);
      await parkingAction.getParkingLots();
      try {
        const fcmToken = await getFCMToken();
        if (fcmToken) {
          // TODO Enhance store fcm token to local storage and then compare both fcm token
          // if it difference call api to update
          authenState.fcmToken.set(fcmToken);
          authenAction.storeFcmToken();
        }
        if (firebaseState.enable_firebase_inapp_messaging.value) {
          setInappMessaging();
        }
        console.log('FCM token = ', fcmToken);
      } catch (error) {
        console.log('Failed to retrieve FCM token:', error);
      }
    };

    loadProfile();
  }, [firebaseState.enable_firebase_inapp_messaging, setInappMessaging, token]);
  const insets = useSafeAreaInsets();

  const loadNotificationAnouncement = async () => {
    const result = await notificationActions.default.getAnnouncement();

    if (!isEmpty(result?.data)) {
      const message = await notificationAction.getMessage(
        result?.data?.id ?? '',
      );
      if (message) {
        setMessage(message);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (authenState.token.value) {
        loadNotificationAnouncement();
      }
    }, [authenState.token.value]),
  );

  useEffect(() => {
    if (
      !isEmpty(authenState.token.value) &&
      !isEmpty(authenState.fcmToken.value)
    ) {
      handleFCMToken();
    }
  }, [authenState.token.value, authenState.fcmToken.value]);

  const handleFCMToken = async () => {
    await notificationActions.default.updateFCMToken();
  };

  const getMemberIdAndTower = useCallback(async () => {
    const result = await memberAction.getMemberId();
    setIsFsMember(result);
    await memberAction.getMember();
    await buildingAccessAction.getTower();
  }, []);

  useEffect(() => {
    if (authenState.token.value) {
      loadNotificationAnouncement();
      const loadNotification = async () => {
        await notificationActions.default.fetchNotifcation();
      };
      getMemberIdAndTower();

      loadNotification();

      handleInitialUrl();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!authenState.token.value) {
        navigation.reset({routes: [{name: 'SignInScreen'}]});
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Add a listener for the 'unauthorized' event
    const unauthorizedListener = apiEventEmitter.addListener(
      'unauthorized',
      () => {
        // Redirect to the login screen when unauthorized event is received
        navigation.reset({routes: [{name: 'SignInScreen'}]});
      },
    );

    // Cleanup: Remove the listener when the component unmounts
    return () => {
      unauthorizedListener.remove();
    };
  }, [navigation]);

  const onPressQr = () => {
    navigation.navigate('BuildingAccessQrScreen');
  };

  const delay = (ms: number | undefined) =>
    new Promise(res => setTimeout(res, ms));

  useScreenHook('WebSocket', async event => {
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
      default:
        break;
    }
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        navigation.navigate('NoInternetConnectionScreen');
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  });

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
    } else {
      console.log('Invalid notification data:', notificationData);
    }
  };

  useEffect(() => {
    logScreenView('HomeScreen');
  }, []);

  return (
    <Screen>
      <StatusBar barStyle={'light-content'} />
      <AnimtedAppBar translateY={translateY}>
        <HomeHeader />
      </AnimtedAppBar>
      <ScrollView
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        onScroll={e => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        className={`flex flex-col w-full ${getTheme('bg-muted-50')}`}
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Pressable className={getTheme('bg-default')}>
          <View className={`${getTheme('bg-muted-50')}`}>
            <FastImage
              className="w-[11.64px] h-[11.64px]"
              source={{
                uri: firebaseState.home_content.background_image.value,
                priority: FastImage.priority.high,
              }}
              defaultSource={DEFAULT_IMAGE}
              style={{width: '100%', height: 670}}>
              <View className="absolute px-4 bottom-[84px]">
                <Text color="default-inverse" weight="regular" size="H2">
                  {t('General__Welcometo', 'Welcome to')}
                </Text>
                <Spacing height={4} />
                <Text color="default-inverse" weight="medium" size="H5">
                  {t(
                    'General__Welcometo_the_Heart_of_Bangkok',
                    'The Heart of Bangkok',
                  )}
                </Text>
              </View>
            </FastImage>
          </View>
          <UserInfoSection profile={globalProfile.value} />
          <BuildingAccessSection isFsMember={isFsMember} />
          <ShuttleBusSection />

          <ParkingAvailability
            onPress={() => navigation.navigate('SmartParkingScreen')}
          />
          <AnouncementSection
            message={message}
            showSection={
              firebaseState.home_content.enable_announcement.value &&
              !isUndefined(message)
            }
          />
          <Spacing height={70} />
          <View className={'items-center'}>
            <Text color="dark-gray" weight="regular" size="B2">
              {t('General__That’s_all_for_now', 'That’s all for now')}
            </Text>
          </View>
          <Spacing height={21 + insets.bottom} />
        </Pressable>
      </ScrollView>
      <CircleStickyButton
        type="obNewIcon"
        onPress={onPressQr}
        width={30}
        height={30}
        color="white"
      />
    </Screen>
  );
};

export default HomeScreen;
