import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {
  BottomNextButton,
  BottomNextButtonSize,
} from '../components/BottomNextButton';
import Screen from '../components/Screen';
import _registrationState from '../states/registrationState';
import s from '../constants/Styles';
import T from '../utils/text';
import {StackNavigation} from '../navigations/AppNavigation';
import accountAction from '../states/account/accountAction';
import {useNavigation} from '@react-navigation/native';

const SignUpSuccessfulScreen = () => {
  const navigation = useNavigation<StackNavigation>();

  const onPressNext = () => {
    accountAction.getProfile().then(() => {
      navigation.navigate('HomeScreen');
    });
  };

  return (
    <Screen>
      <Image
        resizeMode={'cover'}
        style={styles.background}
        source={require('../../assets/images/registration_successful_bg.png')}
      />
      <View style={styles.textContainer}>
        <View style={{flex: 419}} />
        <Text style={[s.textH2Medium, styles.text]}>
          {T('SignUpSuccessfulScreen__text1', 'Great job!')}
        </Text>
        <View style={{height: 20}} />
        <Text style={[s.textB1Regular, styles.text]}>
          {T(
            'SignUpSuccessfulScreen__text2',
            'Now you have a One Bangkok account.',
          )}
        </Text>
        <View style={{flex: 322}} />
      </View>
      <View style={styles.nextButtonContainer}>
        <BottomNextButton
          size={BottomNextButtonSize.Big}
          enabled={true}
          onPress={onPressNext}
          text={T('SignUpSuccessfulScreen__button', 'Explore One Bangkok')}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nextButtonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  text: {
    textAlign: 'center',
  },
});

export default SignUpSuccessfulScreen;
