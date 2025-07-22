import React, {useCallback, useEffect, useState} from 'react';
import RNSplashScreen from 'react-native-splash-screen';
import {StackActions} from '@react-navigation/native';
import appLanguageActions from '../states/appLanguage/appLanguageActions';
import {RootStackParamList, useNavigation} from '../navigations/AppNavigation';
import remoteConfig from '@react-native-firebase/remote-config';
import remoteConfigDefaults from '../firebase/remote_config_defaults';
import _firebaseConfigState from '../states/firebase';
import getFCMToken, {setupInAppMessaging} from '../utils/fcmToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authenState from '../states/authen/authenState';
import accountAction from '../states/account/accountAction';
import {settingStateAction} from '~/features/setting/store';
import {getCustomClassUtility} from '~/utils/themes/themeUtils';
import {Appearance, Linking, Platform, View} from 'react-native';
import * as DeepLinking from '~/helpers/deepLinking';
import {getDeviceId, getOs} from '~/utils/device';
import authenAction from '~/states/authen/authenAction';
import WebSocketService from '~/services/WebSocketService';
import {createNotifyScreenHook} from '~/services/EventEmitter';
import {WebSocketEventTypes} from './WebSocketEvent';
import {WEBSOCKET_TYPE} from '~/services/constants/WebSocketType';
import {BuildingAccessService} from '~/services/BuildingAccessService';
import RNFS from 'react-native-fs';
import QuickActions from 'react-native-quick-actions';
import {ACTION_SHORTCUT} from '~/features/home/constants/ActionShortcut';
import {
  instanceDownLoadTranslation,
  setHeaderSDK,
  settingSDK,
} from '~/helpers/api';
import {buildingAccessAction} from '~/features/buildingAccess/store/buildingAccess';
import FastImage from 'react-native-fast-image';
import {version} from '../../package.json';
import semver from 'semver';
import t from '~/utils/text';
import NetInfo from '@react-native-community/netinfo';
import holidayAction from '~/states/holiday/holidayAction';
import {logScreenView} from '~/utils/logGA';
import {SentryCaptureMessage, SentryDistribution} from '~/utils/sentry';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
settingSDK();

const PreloadUtilityClass = ({className}: {className: string}) => (
  <View className={className} />
);

type Props = {};
const SplashScreen = ({}: Props) => {
  const navigation = useNavigation();
  const firebaseConfigState = useState(_firebaseConfigState);
  const notifyScreenHook = createNotifyScreenHook<WebSocketEventTypes>({
    name: 'WebSocket',
  })();
  const [, setLoadTime] = useState<number | null>(null);

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

  const getLocationData = async () => {
    try {
      const buildinAccessService = new BuildingAccessService();
      const result = await buildinAccessService.getLocations();
      const path = RNFS.DocumentDirectoryPath + '/locations.json';

      if (result) {
        await RNFS.writeFile(path, JSON.stringify({locations: result}), 'utf8');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLocationData();
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (result === RESULTS.GRANTED) {
        await AsyncStorage.setItem('notificationPermissionGranted', 'true');
        return true;
      }
      return false;
    }
    await AsyncStorage.setItem('notificationPermissionGranted', 'true');
    return true;
  };

  const initConfig = useCallback(async () => {
    await remoteConfig()
      .setDefaults(remoteConfigDefaults)
      .then(() => remoteConfig().fetch(0))
      .then(() => remoteConfig().fetchAndActivate())
      .then(fetchedRemotely => {
        const parameters = remoteConfig().getAll();
        let config = {} as any;
        Object.entries(parameters).forEach(configValue => {
          const [key, entry] = configValue;
          try {
            config[key] = JSON.parse(entry.asString());
          } catch (error) {
            // If parsing fails, assign the raw string value
            config[key] = entry.asString();
          }
        });
        firebaseConfigState[0].set(config);
        if (firebaseConfigState[0].enable_firebase_inapp_messaging.value) {
          setupInAppMessaging(true);
        }
        if (!fetchedRemotely) {
          console.log(
            'No configs were fetched from the backend, and the local configs were already activated',
          );
        }
      });
  }, [firebaseConfigState]);

  const preload = useCallback(() => {
    Appearance.setColorScheme('light');
    DeepLinking.init();
    QuickActions.setShortcutItems([
      {
        type: ACTION_SHORTCUT.MY_QR_CODE_ACTION,
        title: t('Building__access__Qr_code__Header', 'My QR Code'),
        icon: 'qr_code',
        userInfo: {
          url: '',
        },
      },
    ]);

    const initializeAppLanguage = async () => {
      await appLanguageActions.initializeLanguage();
    };

    const setAccount = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token != null) {
        authenState.token.set(token);
        setHeaderSDK(token);
        await accountAction.getProfile();
        await Promise.all([
          accountAction.getIdentities(),
          settingStateAction.load(),
        ]);
      }
    };

    const goToHomeScreen = async () => {
      const showMyQrWhenLaunchesApp = await AsyncStorage.getItem(
        'showMyQrWhenLaunchesApp',
      );
      let route = [
        {
          name: 'HomeScreen' as keyof RootStackParamList,
        },
      ];
      if (showMyQrWhenLaunchesApp !== null) {
        const IsShowMyQrWhenLaunchesApp =
          showMyQrWhenLaunchesApp.toLowerCase?.() === 'true';
        buildingAccessAction.setShowMyQrWhenLaunchesApp(
          IsShowMyQrWhenLaunchesApp,
        );
        if (IsShowMyQrWhenLaunchesApp) {
          route.push({
            name: 'BuildingAccessQrScreen' as keyof RootStackParamList,
          });
        }
      }
      if (authenState.token.value) {
        navigation.reset({
          routes: route,
        });
      } else {
        navigation.dispatch(StackActions.replace('SignInScreen'));
      }

      RNSplashScreen.hide();
    };

    const callback = (data: any) => {
      const type = data.type;
      console.log('callback');
      switch (type) {
        case WEBSOCKET_TYPE.LIFTCALLED:
          notifyScreenHook('WebSocket', 'LIFTCALLED', data);
          break;
        case WEBSOCKET_TYPE.NOTIFICATION:
          navigation.navigate('NotificationDetailScreen', {id: data.id});
          break;
        case WEBSOCKET_TYPE.PARKING_AVAILABILITY:
          notifyScreenHook(
            'WebSocket',
            'PARKING_AVAILABILITY_UPDATED',
            data.data,
          );
          break;
        case WEBSOCKET_TYPE.SHUTTLE_BUS_UPDATED:
          notifyScreenHook(
            'WebSocket',
            'SHUTTLE_BUS_POSITION_UPDATED',
            data.data,
          );
          break;
        default:
          break;
      }
    };

    const getDeviceDetail = async () => {
      const deviceId = await getDeviceId();
      const deviceOS = getOs();
      await authenAction.setDeviceId(deviceId);
      await authenAction.setDeviceOS(deviceOS);
    };

    const retrieveFCMToken = async () => {
      try {
        const permissionGranted = await AsyncStorage.getItem(
          'notificationPermissionGranted',
        );

        if (!permissionGranted) {
          const granted = await requestNotificationPermission();
          if (!granted) {
            console.log('Notification permission not granted');
            return;
          }
        }
        const fcmToken = await getFCMToken();
        if (fcmToken) {
          authenState.fcmToken.set(fcmToken);
        }
        console.log('FCM token = ', fcmToken);
      } catch (error) {
        console.log('Failed to retrieve FCM token:', error);
      }
    };

    const getTranslationFile = async () => {
      const path = RNFS.DocumentDirectoryPath;

      const languages = ['en', 'th', 'cs'];

      await Promise.all(
        languages.map(async lang => {
          try {
            const result = await instanceDownLoadTranslation.get(
              `${lang}.json`,
            );
            if (result) {
              await RNFS.writeFile(
                `${path}/${lang}.json`,
                JSON.stringify(result.data),
                'utf8',
              );
            }
          } catch (error) {
            console.error(
              `Error fetching translation file for ${lang}:`,
              error,
            );
          }
        }),
      );
    };

    const firebaseState = firebaseConfigState[0].value;

    initConfig().then(() => {
      retrieveFCMToken();
      const imageBackgroundHomeScreen =
        firebaseState.home_content.background_image;
      FastImage.preload([
        {
          uri: imageBackgroundHomeScreen,
        },
      ]);

      getDeviceDetail().then(() => {
        WebSocketService(callback);
      });
      initializeAppLanguage().then(() => {
        getTranslationFile().then(() => {
          setAccount().then(async () => {
            holidayAction.getHolidays();
            const os = Platform.OS as 'android' | 'ios';

            const appVersionUpdate =
              firebaseState.app_version_update[os]?.version;
            const isUnderMaintenance =
              firebaseState.app_maintenance[os]?.under_maintenance || false;

            const isWhiteListAllow =
              firebaseState.maintenance_whitelist.allow_whitelist || false;

            const whiteListDeviceIds =
              firebaseState.maintenance_whitelist.device_ids;

            if (semver.lt(version, appVersionUpdate)) {
              const link = firebaseState.store_link[os];
              Linking.openURL(link)
                .then(supported => {
                  if (!supported) {
                    console.error(
                      'Failed to open the onelink. Make sure the app is installed.',
                    );
                  }
                })
                .catch(error =>
                  console.error('Error opening the onelink:', error),
                );
              navigation.dispatch(
                StackActions.replace('AppVersionUpdateScreen'),
              );
              RNSplashScreen.hide();
            } else if (isUnderMaintenance) {
              const deviceId = await getDeviceId();
              if (isWhiteListAllow && whiteListDeviceIds.includes(deviceId)) {
                goToHomeScreen();
              } else {
                navigation.dispatch(StackActions.replace('MaintenanceScreen'));
                RNSplashScreen.hide();
              }
            } else {
              goToHomeScreen();
            }
          });
        });
      });
    });
  }, [firebaseConfigState, initConfig, navigation, notifyScreenHook]);

  useEffect(() => {
    if (isConnected) {
      preload();
    } else {
      navigation.navigate('NoInternetConnectionScreen');
      RNSplashScreen.hide();
    }
  }, [isConnected, navigation]);

  useEffect(() => {
    const start = Date.now();

    // This effect runs after the component is rendered
    requestAnimationFrame(() => {
      const end = Date.now();
      const renderTime = end - start;
      setLoadTime(renderTime);

      SentryCaptureMessage(`Component render time: ${renderTime}ms`);
      SentryDistribution(renderTime, 'component_render_time', {
        tags: {type: 'important'},
        unit: 'millisecond',
      });
    });
  }, []);
  useEffect(() => {
    logScreenView('SplashScreen');
  }, []);
  return (
    <>
      <PreloadUtilityClass className={getCustomClassUtility().join(' ')} />
    </>
  );
};

export default SplashScreen;
