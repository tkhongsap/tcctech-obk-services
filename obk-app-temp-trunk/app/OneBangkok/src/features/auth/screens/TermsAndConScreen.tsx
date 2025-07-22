import React, {useState} from 'react';

import t from '~/utils/text';
import {ScrollView} from 'react-native';
import {Screen} from '~/components';
import {TermsAndConForm} from '../components/TermsAndConForm';
import {StackNavigation} from '~/navigations/AppNavigation';
import {useNavigation} from '@react-navigation/native';
import {Header, HeadText, StickyButton} from '~/components/molecules';
import {signUpState} from '../store/signUpStore';
import {useScreenHook} from '~/services/EventEmitter';
import {Spacing} from '~/components/atoms';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';

const TermsAndConScreen = () => {
  const navigation = useNavigation<StackNavigation>();

  const [state, setState] = useState({
    errTermsConditions: false,
  });

  const goToProfileInfoScreen = () => {
    navigation.navigate('ProfileInfoScreen', {step: 0});
  };

  useScreenHook('TermsAndConScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        goToProfileInfoScreen();
        break;
      default:
        break;
    }
  });

  const onPressLeftAction = () => {
    navigation.goBack();
  };

  const setErrTermsConditions = (value: boolean) => {
    setState(prevState => {
      return {...prevState, errTermsConditions: value};
    });
  };

  const resetErrorState = () => {
    setState({...state, errTermsConditions: false});
  };

  const onPressTnC = (value: boolean) => {
    if (value === true) {
      setErrTermsConditions(false);
    }
  };

  const onPressNext = () => {
    if (!signUpState.termsConditions.value) {
      setErrTermsConditions(true);
    }
    if (!signUpState.termsConditions.value) {
      return;
    }

    navigation.navigate('AnnouncementScreen', {
      type: 'success',
      title: t(
        'Announcement__Signup_sso_success__Header',
        'Your SSO account\nis verified !',
      ),
      message: t(
        'General__Sign_up_success',
        'We would like to get to know you better. This helps us offer a more personalized experience.',
      ),
      buttonText: t('General__Continue', 'Continue'),
      screenHook: 'TermsAndConScreen',
    });
  };
  return (
    <Screen>
      <Header leftAction="goBack" onPressLeftAction={onPressLeftAction} />
      <ScrollView
        className="flex w-full px-6"
        keyboardDismissMode="interactive">
        <HeadText
          tagline={t('General__Sign_up', 'Sign up')}
          title={t('Signup__Signup_sso_ts&cs__Header', 'Before we start')}
          description={t(
            'Signup__Signup_sso_ts&cs__Caption',
            'We need you to check here.',
          )}
        />
        <Spacing height={30} />
        <TermsAndConForm
          onPress={(value: boolean) => {
            onPressTnC(value);
          }}
          error={state.errTermsConditions}
          resetErrorState={resetErrorState}
        />
      </ScrollView>
      <StickyButton
        rightIcon="next"
        title={t('General__Continue', 'Continue')}
        onPress={onPressNext}
      />
    </Screen>
  );
};

export default TermsAndConScreen;
