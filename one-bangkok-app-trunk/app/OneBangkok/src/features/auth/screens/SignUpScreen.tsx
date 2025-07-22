import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';

import t from '~/utils/text';

import {Screen} from '~/components/templates/Screen';
import {Spacing, Text} from '~/components/atoms';
import {
  Header,
  HeadText,
  Tab,
  TabHeader,
  TabItem,
  TabBody,
  TabContent,
  EmailField,
  PhoneField,
  Button,
  Diverder,
  IconButton,
} from '~/components/molecules';
import {SSOButtonGroup} from '../components';
import {useNavigation} from '~/navigations/AppNavigation';
import {signUpState, signUpStateAction} from '../store/signUpStore';
import {Identity} from '~/models';
import {resetPasswordStateAction} from '../store/resetPasswordStore';
import {DEFAULT_COUNTRY_CODE} from '~/constants/CountryCodeList';
import getTheme from '~/utils/themes/themeUtils';
import {HeaderImage} from '~/components/molecules/HeaderImage';
import {includes} from 'lodash';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {useScreenHook} from '~/services/EventEmitter';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import firebaseConfigState from '~/states/firebase';
import {logScreenView} from '~/utils/logGA';

const HaveAccountSection = () => {
  const navigation = useNavigation();
  const onPressSignIn = () => {
    navigation.navigate('SignInScreen');
  };
  return (
    <>
      <View className="flex flex-row w-full justify-center space-x-2">
        <Text size="B2">
          {t('Signup__Signup_email__Body', 'Already have an account?')}
        </Text>
        <Text size="B2" color="primary" onPress={onPressSignIn}>
          {t('General__Sign_in', 'Sign in')}
        </Text>
      </View>
    </>
  );
};

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();
  const goToSignUpConfirmPasswordScreen = () => {
    navigation.navigate('SignUpConfirmPasswordScreen', {
      header: t('General__Create_new_account', 'Create new account'),
      title: t('Signup__Signup_set_password__Header', 'Set up password'),
    });
  };

  const handleOnChangeText = (text: string) => {
    setEmail(text);
  };

  const resetError = () => {
    setError(() => false);
    setErrorMessage(() => '');
  };

  const resetForm = () => {
    setEmail(() => '');
  };

  const onPressNext = async () => {
    await resetError();

    const identity = new Identity({
      identifier: email,
      provider: 'email',
    });

    const [isValid, errors] = await identity.validateEmail();

    let language = appLanguageState.currentLanguage.get();
    if (language === '') {
      language = appLanguageState.defaultLanguage.get();
    }

    const title =
      firebaseConfigState.whitelist_announcement.title[language].value;
    const body =
      firebaseConfigState.whitelist_announcement.body[language].value;

    if (includes(errors.identifier?.messages, 'IAM_IDT_0010')) {
      navigation.navigate('AnnouncementScreen', {
        type: 'error',
        title: title,
        message: body,
        buttonText: t('General__Try_again', 'Try again'),
        screenHook: 'SignUpScreen',
      });
      setError(true);
      setErrorMessage(
        t(
          'General__Error_email_domain',
          'Please use the authorized email domain',
        ),
      );

      return;
    }
    if (!isValid) {
      setError(true);
      setErrorMessage(errors.identifier?.messages[0] || '');
      return;
    }
    signUpStateAction.setEmail(email);
    signUpStateAction.setProvider('email');
    goToSignUpConfirmPasswordScreen();

    resetForm();
  };

  return (
    <View>
      <Spacing height={32} />
      <EmailField
        testID="signup-email"
        error={error}
        helperText={errorMessage}
        onChangeText={handleOnChangeText}
      />
      <Spacing height={40} />
      <Button
        title={t('General__Continue_mail', 'Continue with email')}
        rightIcon="next"
        onPress={onPressNext}
      />
    </View>
  );
};
const PhoneForm = () => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(signUpState.countryCode.value);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  const goToSignUpConfirmPasswordScreen = () => {
    navigation.navigate('SignUpConfirmPasswordScreen', {
      header: t('General__Create_new_account', 'Create new account'),
      title: t('Signup__Signup_set_password__Header', 'Set up password'),
    });
  };

  const handleOnChangeText = useCallback(
    (contryCode: string, number: string) => {
      setPhone(number);
      setCountryCode(contryCode);
    },
    [],
  );

  const resetError = () => {
    setError(() => false);
    setErrorMessage(() => '');
  };

  const resetForm = () => {
    setPhone(() => '');
    setCountryCode(() => DEFAULT_COUNTRY_CODE);
  };

  const onPressNext = async () => {
    await resetError();

    const identity = new Identity({
      identifier: phone,
      provider: 'phone',
    });
    const [isValid, errors] = await identity.validatePhone(
      true,
      true,
      countryCode,
    );

    let language = appLanguageState.currentLanguage.get();
    if (language === '') {
      language = appLanguageState.defaultLanguage.get();
    }

    const title =
      firebaseConfigState.whitelist_announcement.title[language].value;
    const body =
      firebaseConfigState.whitelist_announcement.body[language].value;

    if (includes(errors.identifier?.messages, 'IAM_IDT_0010')) {
      navigation.navigate('AnnouncementScreen', {
        type: 'error',
        title: title,
        message: body,
        buttonText: t('General__Try_again', 'Try again'),
        screenHook: 'SignUpScreen',
      });
      setError(true);
      setErrorMessage(
        t(
          'General__Error_phone_domain',
          'Please use the authorized phone number',
        ),
      );

      return;
    }

    if (!isValid) {
      setError(true);
      setErrorMessage(errors.identifier?.messages[0] || '');
      return;
    }

    signUpStateAction.setPhone(phone);
    signUpStateAction.setProvider('phone');
    signUpStateAction.setCountryCode(countryCode);
    resetPasswordStateAction.reset();
    goToSignUpConfirmPasswordScreen();

    resetForm();
  };

  return (
    <View>
      <Spacing height={32} />
      <PhoneField
        testID="signup-phone"
        error={error}
        helperText={errorMessage}
        onChangeText={handleOnChangeText}
      />
      <Spacing height={40} />
      <Button
        title={t('General__Continue_with_phone', 'Continue with phone')}
        rightIcon="next"
        onPress={onPressNext}
      />
    </View>
  );
};

const SignUpScreen = () => {
  // HOTFIX: reset email and phone when navigate to this screen
  const navigation = useNavigation();
  const onPressBack = () => {
    signUpStateAction.resetRegisterData();
    navigation.goBack();
  };

  useScreenHook('SignUpScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        navigation.goBack();
        break;
      default:
        break;
    }
  });

  useEffect(() => {
    logScreenView('SignUpScreen');
  }, []);

  const enableMarcomMainPage = firebaseConfigState.enable_marcom_mainpage.value;

  return (
    <Screen>
      <HeaderImage
        defaultImage={require('../../../assets/images/bg_signin_or_signup.png')}>
        <Header
          bgColor={getTheme('bg-transparent')}
          onPressLeftAction={onPressBack}
          rightAction="switchLanguage"
          rightColor="#ffffff"
          isSignInPageWithMarcom={enableMarcomMainPage}
        />
        <View className="px-5">
          {enableMarcomMainPage && (
            <View className="items-start w-full">
              <Spacing height={10} />
              <IconButton
                width={25}
                height={25}
                color="white"
                type="back"
                onPress={() => navigation.navigate('MainPageScreen')}
                rotation={0}
              />
              <Spacing height={60} />
            </View>
          )}
          <HeadText
            tagline={t('General__Sign_up', 'Sign up')}
            title={t('Signup__Signup_email__Header', 'new account')}
            titleColor="default-inverse"
            taglineColor="default-inverse"
            descriptionColor="line"
          />
        </View>
      </HeaderImage>
      <ScrollView
        className="flex flex-col w-full px-6"
        keyboardDismissMode="interactive">
        <Spacing height={24} />
        <Tab>
          <TabHeader>
            <TabItem onPress={() => signUpStateAction.resetPhone()}>
              {t('General__Email', 'Email')}
            </TabItem>
            <TabItem
              testID="sign-up-phone-tab"
              onPress={() => signUpStateAction.resetEmail()}>
              {t('General__Phone', 'Phone')}
            </TabItem>
          </TabHeader>
          <TabBody>
            <TabContent>
              <EmailForm />
            </TabContent>
            <TabContent>
              <PhoneForm />
            </TabContent>
          </TabBody>
        </Tab>
        <Spacing height={24} />
        <Diverder text={t('General__or', 'or')} />
        <SSOButtonGroup sourceScreen="SignUpScreen" />
        <Spacing height={28} />
        <HaveAccountSection />
      </ScrollView>
    </Screen>
  );
};

export default SignUpScreen;
