import React, {useContext} from 'react';

import {Linking, Platform, Pressable, View} from 'react-native';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import {useModal} from '~/components/molecules';
import DeviceInfo from 'react-native-device-info';
import {WayFindingContext} from '../store/wayfinding';

const NoPermissionModal = (props: any) => {
  const [_modalState, modalActions] = useModal();
  const wayFindingContext = useContext(WayFindingContext);

  const {
    mapView,
    nearestNode,
    bottomSheetRef,
    state: {keepNotAllowLocation},
    action: {setMap, checkPermission},
  } = wayFindingContext;

  //   const languageOptions: ListSelect[] = firebaseState.app_language.value.map(
  //     row => ({
  //       name: row.name,
  //       value: row.value,
  //       description: row.description,
  //     }),
  //   );

  // const onPress = () => {
  //   appLanguageActions.setLanguage(onSelected);
  //   modalActions.hide();
  // };
  // const onSelect = (value: string) => {
  //   setSelect(value);
  // };
  // const onCancel = () => {
  //   modalActions.hide();
  // };

  const handleOnPress = async () => {
    const isLocationEnabled = DeviceInfo.isLocationEnabledSync();
    if (!isLocationEnabled) {
      if (Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:Privacy&path=LOCATION');
      } else {
        Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
      }
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View className="absolute w-full h-screen top-0 left-0 z-50">
      <Pressable
        className="w-full h-full absolute top-0 left-0"
        style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        onPress={() => {}}
      />
      <View className="bg-white absolute top-1/2 left-[5%] w-[90%] mx-auto h-[210px] -mt-[130px] rounded-lg p-4 flex flex-col justify-between">
        <Text className="text-lg font-bold text-center capitalize text-black">
          {t('Select_starting_point', 'Please select your starting point')}
        </Text>
        <View className="flex justify-center pt-4 w-full">
          <Pressable
            style={{backgroundColor: '#475582'}}
            className="w-full bg-muted-50-light border border-line-light py-3 px-4"
            onPress={handleOnPress}>
            <Text className="text-center font-obMedium text-white">
              {t('Allow_Location', 'Allow Location')}
            </Text>
          </Pressable>
          <View className="pt-4">
            <Pressable
              style={{borderColor: '#475582'}}
              className="w-full bg-white border py-3 px-4"
              onPress={() => keepNotAllowLocation.set(true)}>
              <Text
                className="text-center font-obMedium"
                style={{color: '#475582'}}>
                {t('Keep_not_Allow', 'Keep_not_Allow')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default NoPermissionModal;
