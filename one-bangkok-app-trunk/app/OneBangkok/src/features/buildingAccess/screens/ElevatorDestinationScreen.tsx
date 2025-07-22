import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {TouchableOpacity, View} from 'react-native';
import {Text} from '~/components/atoms';
import {Screen} from '~/components/templates';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import * as reactNavigation from '@react-navigation/native';

import t from '~/utils/text';
import {SafeAreaView} from 'react-native-safe-area-context';
import {find, isUndefined} from 'lodash';
import {useEffect} from 'react';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ElevatorDestinationScreen'
>;

const ElevatorDestinationScreen = ({
  route: {
    params: {lift, floor},
  },
}: Props) => {
  const appNavigation = useNavigation();
  const navigation = reactNavigation.useNavigation();

  const onPress = () => {
    const routes = navigation.getState()?.routes;
    const buildingAccessQrScreenInRoute = find(routes, {
      name: 'BuildingAccessQrScreen',
    });
    const callElevatorScreenInRoute = find(routes, {
      name: 'CallElevatorScreen',
    });
    if (!isUndefined(buildingAccessQrScreenInRoute)) {
      appNavigation.navigate('BuildingAccessQrScreen');
    } else if (!isUndefined(callElevatorScreenInRoute)) {
      appNavigation.navigate('CallElevatorScreen');
    } else {
      appNavigation.goBack();
    }
  };
  useEffect(() => {
    logScreenView('ElevatorDestinationScreen');
  }, []);
  return (
    <Screen bgColor="bg-navy">
      <SafeAreaView className="h-full flex items-center justify-between w-full">
        {/* [RE-FACTOR] Wait for confirm color code */}
        <View />
        <View className=" h-52 justify-center">
          <View className="w-full h-40 transform items-center flex flex-row space-x-10">
            <View className=" flex-column">
              <Text className="text-center" color="sky-blue" weight="medium">
                {t('General__Wait_at_elevator', 'Wait at Elevator')}
              </Text>
              <Text
                className="text-center text-[64px]"
                color="default-inverse"
                size="H1">
                {lift}
              </Text>
            </View>
            <View className=" flex-column">
              <Text className="text-center" color="sky-blue" weight="medium">
                {t('General__Destination_floor', 'Destination floor')}
              </Text>
              <Text
                className="text-center text-[64px]"
                color="default-inverse"
                size="H1">
                {floor}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onPress} className="pb-5">
          <View className="w-full h-[46] flex items-center justify-center">
            <View className="text-white text-24">
              <Text className="text-center" color="default-inverse">
                {t('General__Close', 'Close')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Screen>
  );
};

export default ElevatorDestinationScreen;
