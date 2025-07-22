import React from 'react';
import {Platform, View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {ScreenContainer} from '~/features/residential/components/ScreenContainer';
import {StackActions, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import t from '~/utils/text';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import ErrorCallLift from '../components/Elevator/ErrorCallLift';
import {Header} from '../components/Header';
import {StickyButton} from '../components';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialElevatorErrorScreen'
>;

const ResidentialElevatorErrorScreen = ({route: {params}}: Props) => {
  const navigation = useNavigation<StackNavigation>();

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

  const errorPress = async () => {
    try {
      navigation.dispatch(StackActions.replace('ElevatorScreen'));
    } catch (error) {
      navigateToErrorScreen();
    }
  };

  return (
    <>
      <ScreenContainer bgColor="#ffffff" barStyle="dark-content">
        <Header
          leftAction="goBack"
          titleColor="dark-gray"
          bgColor="bg-white"
          title={t('General__Call_elevator', 'Call elevator')}
        />
        {/* <Spacing height={8} /> */}
        <ErrorCallLift />
        <StickyButton
          title={t('Residential__Elevator__General__Try_Again', 'Try again')}
          className="bg-dark-teal-dark"
          rightIcon="next"
          iconHeight={20}
          iconWidth={20}
          onPress={errorPress}
        />
        <Spacing height={Platform.OS === 'ios' ? 46 : 0} />
      </ScreenContainer>
    </>
  );
};

export default ResidentialElevatorErrorScreen;
