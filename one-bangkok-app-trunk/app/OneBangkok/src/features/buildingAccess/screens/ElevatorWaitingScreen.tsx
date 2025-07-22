import {useState, useEffect} from 'react';
import React, {SafeAreaView, View} from 'react-native';
import {Text} from '~/components/atoms';
import Loading from '~/components/organisms/Loading';
import {Screen} from '~/components/templates';
import {useNavigation} from '~/navigations/AppNavigation';
import firebaseConfigState from '~/states/firebase';
import t from '~/utils/text';
import {logScreenView} from '~/utils/logGA';
import {StackActions, useIsFocused} from '@react-navigation/native';

const ElevatorWaitingScreen = ({}: {}) => {
  const [seconds, setSeconds] = useState(
    firebaseConfigState.elevator_waiting_time.value,
  );
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isFocus) {
        clearInterval(intervalId);
      } else if (seconds > 0) {
        setSeconds(prevSeconds => prevSeconds - 1);
      } else {
        navigation.goBack();
        clearInterval(intervalId);
      }
    }, 1000);
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigation, seconds, isFocus]);
  useEffect(() => {
    logScreenView('ElevatorWaitingScreen');
  }, []);
  return (
    <Screen bgColor="bg-navy">
      <SafeAreaView className="h-full flex items-center justify-between w-full px-5">
        {/* [RE-FACTOR] Wait for confirm color code */}
        <View />
        <View className="px-10">
          <View className="flex-column items-center">
            <Text color="sky-blue" weight="medium">
              {t('General__Just_a_second', 'Just a second')}
            </Text>
            <Text color="default-inverse" size="H1" weight="medium">
              {t('General__Calling_elevator', 'Calling elevator')}
            </Text>
          </View>
        </View>
        <View className="h-[50px] w-full mb-5 items-center">
          <Loading isLoading={true} type="loadingWhite" />
        </View>
      </SafeAreaView>
    </Screen>
  );
};

export default ElevatorWaitingScreen;
