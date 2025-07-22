import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/native';
import {useNavigation} from '../navigations/AppNavigation';
import t from '../utils/text';
import {Icon, IconType, Spacing, Text} from './atoms';
import getTheme from '~/utils/themes/themeUtils';
import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import {activeOpacity} from '~/constants';
import {memberAction} from '~/features/buildingAccess/store/member';
import {useParkingState} from '~/features/buildingAccess/store/parking';
import {compact, isEmpty} from 'lodash';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import firebaseConfigState from '~/states/firebase';
import {memberState} from '~/features/buildingAccess/store/member';
import {usePermission} from '~/utils/permission';

export default function CustomDrawer() {
  const navigation = useNavigation();
  const closeDrawer = () => navigation.dispatch(DrawerActions.closeDrawer());
  const [isFsMember, setIsFsMember] = useState(false);

  const {parkingLot} = useParkingState();
  const [obMenu, setObMenu] = useState<any>([]);
  const {permissionList} = usePermission();

  const currentLanguage = appLanguageState.currentLanguage.get();

  const enabledAqi = firebaseConfigState.enable_aqi_homescreen_and_menu.value;

  const getMemberId = useCallback(async () => {
    const result = await memberAction.getMemberId();
    setIsFsMember(result);
  }, []);

  useEffect(() => {
    getMemberId();
  }, [getMemberId]);

  const drawerOBMenu = [
    {
      name: t('General__Home', 'Home'),
      iconName: 'homeIcon',
      onPress: () => closeDrawer(),
    },
    enabledAqi
      ? {
          name: t('General__Air_quality', 'Air Quality'),
          iconName: 'aqTempIcon',
          onPress: () => navigation.navigate('AirQualityScreen'),
        }
      : null,
    {
      name: t('Building__access__Qr_code__Header', 'My QR Code'),
      iconName: 'qrCode',
      onPress: () => navigation.navigate('BuildingAccessQrScreen'),
    },
    {
      name: t('General__Notifications', 'Notifications'),
      iconName: 'bell',
      onPress: () => navigation.navigate('AllNotificationsScreen'),
    },
    {
      name: t('General__My_account', 'My Account'),
      iconName: 'user',
      onPress: () => navigation.navigate('AccountInfoScreen'),
    },
    {
      name: t('General__Settings', 'Settings'),
      iconName: 'cog',
      onPress: () => navigation.navigate('SettingScreen'),
    },
  ].filter(item => item !== null);

  useEffect(() => {
    if (!isEmpty(parkingLot.value)) {
      drawerOBMenu.splice(2, 0, {
        name: t('General__Parking', 'Parking'),
        iconName: 'smartParkingIcon',
        onPress: () => navigation.navigate('SmartParkingScreen'),
      });
    }

    setObMenu(drawerOBMenu);
  }, [parkingLot, currentLanguage]);
  const checkPermission = () => {
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

  const drawerBuildingMenu = compact([
    {
      name: t('General__Call_elevator', 'Call elevator'),
      iconName: 'elevator',
      onPress: () => navigation.navigate('CallElevatorScreen'),
    },
    memberState.can_preregister.value && {
      name: t('General__Create_visitor_pass', 'Create visitor pass'),
      iconName: 'legal',
      onPress: () => navigation.navigate('VisitorPassScreen'),
    },
    firebaseConfigState.enable_building_service_homescreen_and_menu.value && {
      name: t('General__Building_request', 'Building Request'),
      iconName: 'legal',
      onPress: () => checkPermission(),
    },
  ]).filter(item => item !== false);

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
        <ScrollView className="h-full">
          {isFsMember && (
            <View>
              <Text weight="medium" size="H3">
                {t('General__Work', 'Work')}
              </Text>
              {drawerBuildingMenu.map((menu, index) => {
                return (
                  <View
                    className="py-4 border-b border-gray-300 justify-center"
                    key={`${menu.name}_${index}`}>
                    <TouchableOpacity
                      testID="drawer-settings-id"
                      activeOpacity={activeOpacity}
                      onPress={menu.onPress}>
                      <View className="flex flex-row items-center">
                        <Icon
                          type={menu.iconName as IconType}
                          width={20}
                          height={20}
                        />
                        <Spacing width={12} />
                        <Text size="H4" color="dark-gray">
                          {menu.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
              <Spacing height={32} />
            </View>
          )}
          <View>
            <Text weight="medium" size="H3">
              {t('General__My_one_bangkok', 'My One Bangkok')}
            </Text>
            <FlatList
              scrollEnabled={false}
              data={obMenu}
              extraData={obMenu}
              renderItem={item => {
                return (
                  <>
                    <View
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
                          />
                          <Spacing width={12} />
                          <Text size="H4" color="dark-gray">
                            {item.item.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              }}
            />
          </View>
          <Spacing height={50} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
