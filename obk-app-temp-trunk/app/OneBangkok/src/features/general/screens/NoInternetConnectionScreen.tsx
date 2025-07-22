import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {Icon, Spacing} from '~/components/atoms';
import {Screen} from '~/components/templates';
import {useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import NetInfo from '@react-native-community/netinfo';

const NoInternetConnectionScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        navigation.goBack();
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  });

  return (
    <Screen>
      <View className="flex flex-column items-center justify-center h-screen p-4">
        <Icon type="close" width={48} height={48} />
        <Spacing height={14} />
        <Text className="text-2xl text-center">
          {t('no_key', 'No Internet Connection.')}
        </Text>
        <Text className="text-base text-[#7C7C7C] text-center">
          {t(
            'no_key',
            'Unable to connect. Please check your internet and try again.',
          )}
        </Text>
      </View>
    </Screen>
  );
};

export default NoInternetConnectionScreen;
