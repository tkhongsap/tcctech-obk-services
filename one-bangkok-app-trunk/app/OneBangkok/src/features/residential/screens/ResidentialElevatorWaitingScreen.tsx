import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {ScreenContainer} from '~/features/residential/components/ScreenContainer';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Loading from '~/components/organisms/Loading';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import firebaseConfigState from '~/states/firebase';
import {logEvent} from '~/utils/logGA';
import t from '~/utils/text';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
enum Status {
  CALLING,
  IN_QUEUE,
  CALL_ERROR,
}

type CallLift = {
  personID: string;
  liftName: string;
  floorID: string | null;
  floorName: string;
  queueNo: number;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialElevatorWaitingScreen'
>;

const ResidentialElevatorWaitingScreen = ({route: {params}}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const [status, setStatus] = useState<Status>(Status.CALLING);
  const [personId, setPersonId] = useState<string>(params.personID);
  const [liftQueue, setLiftQueue] = useState<CallLift>();

  const callLiftIntervalRef = useRef<number | null>(null);
  const isComponentActive = useRef(true);
  const callLiftIntervalTimeMS =
    firebaseConfigState.call_lift_queue_interval_time_ms.value || 3000;

  let roundCall = 0;
  useFocusEffect(
    useCallback(() => {
      if (!isComponentActive.current) return;
      preload();
      return () => {
        clearCallLiftInterval();
        isComponentActive.current = false;
      };
    }, []),
  );

  useEffect(() => {
    if (!isComponentActive.current) return;
    if (status === Status.IN_QUEUE) {
      startLiftQueuePolling();
    }
    return clearCallLiftInterval;
  }, [status, liftQueue]);

  const preload = async () => {
    if (!personId) {
      navigateToErrorScreen();
      return;
    }

    try {
      setPersonId(personId);
      await checkLift(personId);
      setStatus(Status.IN_QUEUE);
    } catch {
      if (!isComponentActive.current) return;
      await callLift(personId);
    }
  };

  const callLift = async (personID: string) => {
    if (!isComponentActive.current) return;
    try {
      const {data, status} = await serviceMindService.getQueueCallLift({
        personID,
        locationID: parseInt(params.locationID),
      });

      if (status !== 200) throw new Error('Call lift error');

      setLiftQueue(data);
      logLiftEvent();

      if (data.queueNo === 1) {
        if (roundCall >= 1) {
          handleLiftArrival();
        }
        serviceMindService.notifyLiftArrival().catch();
      }
    } catch {
      if (roundCall >= 5) {
        roundCall = 0;
        callLiftIntervalRef.current = null;
        navigation.dispatch(
          StackActions.replace('ResidentialElevatorErrorScreen'),
        );
      } else {
        setStatus(Status.CALLING);
        roundCall++;
        await callLift(personId);
      }
    }
  };

  const checkLift = async (personID: string) => {
    if (!isComponentActive.current) return;
    try {
      const {data, status} = await serviceMindService.checkQueueCallLift({
        personID,
        locationID: parseInt(params.locationID),
      });

      if (status !== 200) throw new Error('Check lift error');

      setLiftQueue(data);
      logLiftEvent();
      if (data.queueNo === 2) {
        serviceMindService.notifyLiftArrival().catch();
      }

      if (data.queueNo === 1) {
        handleLiftArrival();
      }
    } catch {
      await callLift(personId);
    }
  };

  const startLiftQueuePolling = () => {
    if (callLiftIntervalRef.current === null) {
      callLiftIntervalRef.current = setInterval(async () => {
        if (liftQueue?.queueNo > 1 && personId) {
          await checkLift(personId);
        }
      }, callLiftIntervalTimeMS);
    }
  };

  const handleLiftArrival = () => {
    clearCallLiftInterval();
    setTimeout(() => navigation.navigate('ResidentialHomeScreen'), 60000);
  };

  const logLiftEvent = () => {
    logEvent('button_click', {
      screen_name: 'ResidentialElevatorWaitingScreen',
      feature_name: 'Private lift calling',
      action_type: 'click',
      bu: 'Residential',
    });
  };

  const navigateToErrorScreen = () => {
    navigation.dispatch(
      StackActions.replace('AnnouncementResidentialScreen', {
        type: 'error',
        title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
        message: t(
          'Residential__Announcement__Error_generic__Body',
          'Please wait a moment and try again',
        ),
        buttonText: t('Residential__Back_to_explore', 'Back to explore'),
        screenHook: 'ResidentialHomeScreen',
        buttonColor: 'dark-teal',
        onPressBack: () => navigation.navigate('ResidentialHomeScreen'),
      }),
    );
  };

  const clearCallLiftInterval = () => {
    if (callLiftIntervalRef.current) {
      clearInterval(callLiftIntervalRef.current);
      callLiftIntervalRef.current = null;
    }
  };

  const onPressClose = () => {
    clearCallLiftInterval();
    isComponentActive.current = false;
    navigation.navigate('ResidentialHomeScreen');
  };

  const renderCallingState = () => (
    <>
      <View className="flex items-center justify-center">
        <Text
          className="text-center"
          color="sky-blue"
          weight="medium"
          size="B2">
          {t('Residential__Elevator__Just_a_second', 'Just a second')}
        </Text>
        <Text
          className="text-center"
          color="default-inverse"
          weight="medium"
          size="H1">
          {t('Residential__Elevator__Calling_elevator', 'Calling Elevator')}
        </Text>
        <Spacing height={Platform.OS === 'ios' ? 120 : 80} />
      </View>
      <View className="absolute bottom-0 w-full h-fit flex items-center justify-center ">
        <Loading isLoading={true} type="loadingWhite" />
        <Spacing height={Platform.OS === 'ios' ? 500 : 420} />
      </View>
      <View className="w-full h-fit items-center absolute bottom-0">
        <TouchableOpacity onPress={onPressClose}>
          <Text color="white">
            {t('Residential__Elevator__Close', 'Close')}
          </Text>
        </TouchableOpacity>
        <Spacing height={Platform.OS === 'ios' ? 120 : 80} />
      </View>
    </>
  );

  const renderInQueueState = () => (
    <>
      <View className="flex flex-row">
        <View className="flex-1 flex-col items-center justify-center">
          <Text
            className="text-center"
            color="sky-blue"
            weight="medium"
            size="B1">
            {t('Residential__Elevator__Wait_at_Elevator', 'Wait at Elevator')}
          </Text>
          <Text className="text-center" size="H6" color="default-inverse">
            {liftQueue?.liftName}
          </Text>
        </View>
        <View className="flex-1 flex-col items-center justify-center">
          <Text
            className="text-center"
            color="sky-blue"
            weight="medium"
            size="B1">
            {t('Residential__Elevator__Elevator_Queue', 'Elevator Queue')}
          </Text>
          <Text className="text-center" size="H6" color="default-inverse">
            {liftQueue?.queueNo}
          </Text>
        </View>
      </View>
      <View className="absolute bottom-0 w-full h-fit flex items-center justify-center">
        <TouchableOpacity onPress={onPressClose}>
          <Text color="white">
            {t('Residential__Elevator__Close', 'Close')}
          </Text>
        </TouchableOpacity>
        <Spacing height={Platform.OS === 'ios' ? 120 : 80} />
      </View>
    </>
  );

  return (
    <ScreenContainer bgColor="#014541" barStyle="light-content">
      <View className="w-full h-full bg-dark-teal-light flex flex-col items-center justify-center">
        {status === Status.CALLING && renderCallingState()}
        {status === Status.IN_QUEUE && liftQueue && renderInQueueState()}
      </View>
    </ScreenContainer>
  );
};

export default ResidentialElevatorWaitingScreen;
