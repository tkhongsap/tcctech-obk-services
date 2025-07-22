import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import t from '~/utils/text';

import {IconTextButton} from '~/components';
const GoogleIcon = require('~/assets/images/icon_google.png');

export const SignInWithGoogleButton = (props: any) => {
  const {onAuthorize, reset} = props;
  const clearAllState = () => {
    reset && reset();
  };
  const handleOnPress = async () => {
    // TODO: Setup a config file
    clearAllState();
    GoogleSignin.configure({
      webClientId:
        '558340199002-6h5m0nn0k829clnviihg88i4gjoht7e3.apps.googleusercontent.com',
      iosClientId:
        '300033733234-n5p42n32755pl2a07nbicv467f3r2c7m.apps.googleusercontent.com',
    });
    const hasPlayService = await GoogleSignin.hasPlayServices();
    if (hasPlayService) {
      const userInfo = await GoogleSignin.signIn();
      onAuthorize('google', true, userInfo);
    } else {
      onAuthorize('google', false);
    }
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View {...props} pointerEvents="none">
        <IconTextButton
          iconType="googleIcon"
          title={t('General__Connect_with_google', 'Continue with Google')}
        />
      </View>
    </TouchableOpacity>
  );
};
