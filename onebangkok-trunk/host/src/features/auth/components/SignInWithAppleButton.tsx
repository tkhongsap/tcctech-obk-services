import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';

import t from '~/utils/text';

import {IconTextButton} from '~/components';

export const SignInWithAppleButton = (props: any) => {
  const {onAuthorize, reset} = props;
  const clearAllState = () => {
    reset && reset();
  };

  const handleOnPress = async () => {
    clearAllState();
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      const decoded = jwt_decode(
        appleAuthRequestResponse.identityToken as string,
      );
      onAuthorize('apple', true, decoded);
    } else {
      onAuthorize('apple', false);
    }
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View {...props} pointerEvents="none">
        <IconTextButton
          iconType="appleIcon"
          title={t('General__Connect_with_apple', 'Continue with Apple')}
        />
      </View>
    </TouchableOpacity>
  );
};
