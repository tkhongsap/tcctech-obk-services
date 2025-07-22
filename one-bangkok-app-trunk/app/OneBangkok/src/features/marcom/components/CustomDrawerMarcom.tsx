/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {DrawerActions} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon, Spacing, Text} from '~/components/atoms';
import {useModal} from '~/components/molecules';
import {activeOpacity} from '~/constants';
import {SosContactDrawer} from '~/features/buildingAccess/components/SosContactDrawer';
import {memberAction} from '~/features/buildingAccess/store/member';
import {useParkingState} from '~/features/buildingAccess/store/parking';
import OfficeMenu from '~/features/home/components/OfficeMenu';
import ResidenceMenu from '~/features/residential/components/ResidenceMenu';
import {settingStateAction} from '~/features/setting/store';
import accountAction from '~/states/account/accountAction';
import {useAccountState} from '~/states/account/accountState';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import authenState, {useAuthenState} from '~/states/authen/authenState';
import firebaseConfigState from '~/states/firebase';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '../../../navigations/AppNavigation';
import t from '../../../utils/text';
import {logEvent, logScreenView} from '~/utils/logGA';

export default function CustomDrawerMarcom() {
  const navigation = useNavigation();

  const {token} = useAuthenState();
  const {profile: globalProfile} = useAccountState();
  const [profile, setProfile] = useState<any>(globalProfile.value || null);

  const getMemberId = useCallback(async () => {
    await memberAction.getMemberId();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const _profile = await accountAction.getProfile();
      setProfile(_profile);
      await settingStateAction.load();
    };

    loadProfile();
    getMemberId();
  }, [getMemberId, token]);

  const firstName = globalProfile.value?.first_name;
  const middleName = globalProfile.value?.middle_name;
  const lastName = globalProfile.value?.last_name;

  const {parkingLot} = useParkingState();
  const [obMenu, setObMenu] = useState<any>([]);

  const currentLanguage = appLanguageState.currentLanguage.get();

  const enabledAqi = firebaseConfigState.enable_aqi_homescreen_and_menu.value;
  const enabledWayfinding = firebaseConfigState.enable_wayfinding.value;
  const enabledBookmarkContent =
    firebaseConfigState.enable_bookmark_content.value;

  const enableServiceRequestMarcom =
    firebaseConfigState.enable_service_request_marcom.value;
  const [_modalState, modalActions] = useModal();
  const closeModal = () => modalActions.hide();

  const closeDrawer = () => navigation.dispatch(DrawerActions.closeDrawer());

  const handleOnSOSContactMarcom = () => {
    closeDrawer();
    logEvent('button_click', {
      screen_name: 'MainPageScreen',
      feature_name: 'Navigation Items',
      action_type: 'click',
      bu: 'MarCom',
    });
    modalActions.setContent(<SosContactDrawer onClose={closeModal} />);
    modalActions.show();
  };

  //Marcom
  const drawerOBMenu = [
    {
      name: t('Press_And_Media', 'Home'),
      iconName: 'mcPressAndMedia',
      onPress: () => {
        logEvent('button_click', {
          screen_name: 'MainPageScreen',
          feature_name: 'Navigation Items',
          action_type: 'click',
          bu: 'MarCom',
        });
        navigation.navigate('MainPageScreen');
        closeDrawer();
      },
    },
    enableServiceRequestMarcom
      ? {
          name: 'Building Unusual Report',
          iconName: 'svMaintenanceIcon',
          onPress: () => {
            logEvent('button_click', {
              screen_name: 'BuildingUnusualReportScreen',
              feature_name: 'Navigation Items',
              action_type: 'click',
              bu: 'MarCom',
            });
            navigation.navigate('BuildingUnusualReportScreen');
            closeDrawer();
          },
        }
      : null,
    {
      name: t('Access_Local_Information', 'Access Local Information'),
      iconName: 'mcAccessLocalInfo',
      onPress: () => {
        logEvent('button_click', {
          screen_name: 'MainPageScreen',
          feature_name: 'Navigation Items',
          action_type: 'click',
          bu: 'MarCom',
        });
        navigation.navigate('AccessLocalInformation');
      },
    },
    {
      name: t('Shuttle_Bus', 'EV Shuttle Service'),
      iconName: 'mcShuttleBus',
      onPress: () => {
        logEvent('button_click', {
          screen_name: 'MainPageScreen',
          feature_name: 'Navigation Items',
          action_type: 'click',
          bu: 'MarCom',
        });
        navigation.navigate('MapScreen');
      },
    },
    {
      name: t('Parking_Services', 'Parking Services'),
      iconName: 'mcParkingService',
      onPress: () => {
        logEvent('button_click', {
          screen_name: 'MainPageScreen',
          feature_name: 'Navigation Items',
          action_type: 'click',
          bu: 'MarCom',
        });
        navigation.navigate('ParkingServiceScreen');
      },
    },
    enabledAqi
      ? {
          name: t('Air_Quality', 'Air Quality'),
          iconName: 'mcAirQuality',
          onPress: () => {
            logEvent('button_click', {
              screen_name: 'MainPageScreen',
              feature_name: 'Navigation Items',
              action_type: 'click',
              bu: 'MarCom',
            });
            navigation.navigate('AirQualityScreen');
          },
        }
      : null,
    // Move to Access Local Information
    enabledWayfinding
      ? {
          name: t('Wayfinding', 'Wayfinding'),
          iconName: 'mcWayfinding',
          onPress: () => {
            logEvent('button_click', {
              screen_name: 'MainPageScreen',
              feature_name: 'Navigation Items',
              action_type: 'click',
              bu: 'MarCom',
            });
            navigation.navigate('WayFindingScreen');
          },
        }
      : null,
    authenState.token.value &&
    firebaseConfigState.enable_artc_booking_ticket.value
      ? {
          name: t('General__My_ticket', 'My Ticket'),
          iconName: 'ticket',
          onPress: () => {
            logEvent('button_click', {
              screen_name: 'MainPageScreen',
              feature_name: 'Navigation Items',
              action_type: 'click',
              bu: 'MarCom',
            });
            navigation.navigate('MyTicketScreen');
          },
        }
      : null,
    authenState.token.value && enabledBookmarkContent
      ? {
          name: t('General__My_Bookmark', 'My Bookmark'),
          iconName: 'bookmarkIcon',
          onPress: () => {
            logEvent('button_click', {
              screen_name: 'MainPageScreen',
              feature_name: 'Navigation Items',
              action_type: 'click',
              bu: 'MarCom',
            });
            navigation.navigate('ArtCultureBookmarkScreen');
          },
        }
      : null,
    {
      name: t('Settings', 'Settings'),
      iconName: 'mcSettings',
      onPress: () => {
        logEvent('button_click', {
          screen_name: 'MainPageScreen',
          feature_name: 'Navigation Items',
          action_type: 'click',
          bu: 'MarCom',
        });
        navigation.navigate('SettingScreen');
      },
    },
    authenState.token.value
      ? {
          name: t('SOS_Emergency_Service', 'SOS / Emergency Service'),
          iconName: 'mcSOS',
          onPress: () => {
            logScreenView('SOS / Emergency Service');
            handleOnSOSContactMarcom();
          },
        }
      : null,
  ].filter(item => item !== null);

  useEffect(() => {
    setObMenu(drawerOBMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkingLot, currentLanguage, authenState.token.value]);

  const styles = StyleSheet.create({
    loginBox: {
      width: '100%',
      height: 100,
      backgroundColor: '#292929',
      padding: 15,
      flexDirection: 'row',
    },
  });

  const onScrollToBottom = () => {
    this.scrollView.scrollToEnd({animated: true});
  };

  return (
    <View className={getTheme('bg-default h-screen')}>
      <SafeAreaView>
        <View className="flex items-end">
          <View className="p-3">
            <Text weight="medium" onPress={closeDrawer}>
              {t('General__Close', 'Close')}
            </Text>
          </View>
        </View>
        <ScrollView
          className="h-full"
          ref={ref => {
            this.scrollView = ref;
          }}>
          <View>
            {authenState.token.value ? (
              <View>
                <Text weight="bold" size="H3">{`${firstName} ${
                  middleName ?? ''
                } ${lastName}`}</Text>
                <Spacing height={20} />

                <Text weight="medium" size="H3">
                  {t('General__My_one_bangkok', 'My One Bangkok')}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={() => {
                  closeDrawer();
                  navigation.navigate('SignInScreen');
                }}>
                <View className="flex flex-row" style={styles.loginBox}>
                  <View className="w-[90%]">
                    <Text
                      weight="bold"
                      style={{fontSize: 16, color: '#fdfdfd'}}>
                      {t(
                        'Get_started_with_your_account',
                        'Get started with your account',
                      )}
                    </Text>
                    <Text
                      weight="regular"
                      style={{fontSize: 16, color: '#efefef'}}>
                      {t(
                        'Login_or_create_account',
                        'Login or create an account for exclusive content and promotion',
                      )}
                    </Text>
                  </View>
                  <View
                    className="w-[10%]"
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: currentLanguage === 'en' ? 20 : 5,
                    }}>
                    <Icon
                      color="#dcdcdc"
                      type={'right'}
                      width={18}
                      height={18}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            <FlatList
              scrollEnabled={false}
              data={obMenu}
              extraData={obMenu}
              renderItem={item => {
                return (
                  <View
                    style={{
                      backgroundColor: 'white',
                    }}
                    className="py-4 border-b border-gray-300 justify-center"
                    key={`${item.item.name}_${item.item.index}`}>
                    <TouchableOpacity
                      testID="drawer-settings-id"
                      activeOpacity={activeOpacity}
                      onPress={item.item.onPress}>
                      <View className="flex flex-row items-center">
                        <Icon
                          type={item.item.iconName}
                          width={20}
                          height={20}
                          color={
                            item.item.iconName === 'bookmarkIcon'
                              ? 'transparent'
                              : ''
                          }
                        />
                        <Spacing width={12} />
                        <View
                          style={{
                            width: Dimensions.get('window').width - 120,
                          }}>
                          <Text size="H4" numberOfLines={2} color="dark-gray">
                            {item.item.name}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
          <Spacing height={30} />
          {authenState.token.value && (
            <View>
              <OfficeMenu
                closeDrawer={() => closeDrawer()}
                scrollToBottom={() => onScrollToBottom()}
              />
              <ResidenceMenu
                closeDrawer={() => closeDrawer()}
                scrollToBottom={() => onScrollToBottom()}
              />
            </View>
          )}
          <Spacing height={20} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
