import DeepLinking from 'react-native-deep-linking';
import {Linking} from 'react-native';
import {navigationRef} from '../../App';
import {StackActions} from '@react-navigation/native';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {isLoggedIn} from '~/states/authen/authenState';

const schemes = ['onebangkokdev://'];

let handledInitialUrl = false;

export const init = () => {
  schemes.forEach(value => {
    DeepLinking.addScheme(value);
  });

  Linking.addEventListener('url', handleResponse);
};

export const handleInitialUrl = () => {
  if (handledInitialUrl) {
    return;
  }
  handledInitialUrl = true;

  Linking.getInitialURL();
};

const handleResponse = (response: any) => {
  handleUrl(response.url);
};

const handleUrl = (urlValue: string) => {
  const url = new URL(urlValue);

  switch (url.host) {
    case 'signUp':
      navigationRef.dispatch(StackActions.push('AskToSignUpScreen'));
      break;
    case 'setup2FAScreen':
      if (isLoggedIn()) {
        const provider: ProviderType | null = url.searchParams.get(
          'provider',
        ) as ProviderType;

        if (provider) {
          navigationRef.dispatch(
            StackActions.push('Setup2FAScreen', {
              provider: provider,
            }),
          );
        }
      }
      break;
  }
};
