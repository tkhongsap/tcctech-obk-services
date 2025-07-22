import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import AzureAuth from 'react-native-azure-auth';

import t from '~/utils/text';

import {IconTextButton} from '~/components';
const MicrosoftIcon = require('~/assets/images/icon_microsoft.png');

const azureAuth = new AzureAuth({
  clientId: '42bb473e-c7ce-453f-aa4f-9d34a987f40b',
  redirectUri: 'msauth.mtel.onebangkok.dev://auth',
});

export const SignInWithMicrosoftButton = (props: any) => {
  const {onAuthorize, reset} = props;
  const clearAllState = () => {
    reset && reset();
  };
  const handleOnPress = async () => {
    clearAllState();
    try {
      let tokens = await azureAuth.webAuth.authorize({
        scope: 'openid profile User.Read Mail.Read',
      });

      if (tokens.userId) {
        const userInfo = await azureAuth.auth.msGraphRequest({
          token: tokens.accessToken as string,
          path: '/me',
        });
        onAuthorize('microsoft', true, userInfo);
      } else {
        onAuthorize('microsoft', false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View {...props} pointerEvents="none">
        <IconTextButton
          iconType="microsoftIcon"
          title={t('General__Connect_with_microsoft', 'Continue with Microsoft')}
        />
      </View>
    </TouchableOpacity>
  );
};
