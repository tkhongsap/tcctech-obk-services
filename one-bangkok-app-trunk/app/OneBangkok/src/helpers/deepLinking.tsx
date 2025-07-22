import DeepLinking from 'react-native-deep-linking';
import {Linking} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {isLoggedIn} from '~/states/authen/authenState';
import Config from 'react-native-config';
import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
const schemes = [`${Config.APPLINK}`];

export const init = () => {
  schemes.forEach(value => {
    DeepLinking.addScheme(value);
  });

  Linking.addEventListener('url', handleResponse);
};

let handledInitialUrl = false;
export const handleInitialUrl = async () => {
  if (handledInitialUrl) return;

  handledInitialUrl = true;
  try {
    const initialUrl = await Linking.getInitialURL();

    if (initialUrl) {
      handleUrl(initialUrl); // ← ACTUALLY HANDLE IT
    }
  } catch (error) {
    console.error('Error getting initial URL:', error);
  }
};

const handleResponse = (response: any) => {
  handleUrl(response.url);
};

const handleUrl = (urlValue: string) => {
  const url = new URL(urlValue);
  const paths = url.pathname.split('/').filter((item: string) => item !== '');

  if (url.host === Config.UNIVERSAL_LINK?.replace('https://', '')) {
    const screen = paths[0];
    const params = paths.filter((_, i) => i > 0);
    redirectScreenHandler(screen, params);
  } else {
    redirectScreenHandler(url.host, paths);
  }
};

const redirectScreenHandler = (screen: string, params: string[]) => {
  if (screen === 'sign-up') {
    navigationRef.dispatch(StackActions.push('AskToSignUpScreen'));
  } else if (screen === 'setup-2-fa') {
    if (isLoggedIn()) {
      const provider: ProviderType | null = params[0] as ProviderType;

      if (provider) {
        navigationRef.dispatch(
          StackActions.push('Setup2FAScreen', {
            provider,
          }),
        );
      }
    }
  } else if (screen === 'art-culture') {
    if (params[0] === 'category') {
      navigationRef.dispatch(
        StackActions.push('ArtCultureArtCCategoryScreen', {
          typeId: params[1],
          id: params[2],
        }),
      );
    } else if (params[0] === 'program') {
      navigationRef.dispatch(
        StackActions.push('ArtCultureProgramScreen', {id: params[1]}),
      );
    } else {
      navigationRef.dispatch(
        StackActions.push('ArtCultureArtCScreen', {id: params[0]}),
      );
    }
  } else if (screen === 'sustainability') {
    if (params[0] === 'walking-meeting-map') {
      navigationRef.dispatch(StackActions.push('WalkingSearchScreen'));
    } else if (params[0] === 'digitallibrary') {
      navigationRef.dispatch(StackActions.push('DigitalLibraryScreen'));
    }
  } else {
    console.warn('⚠️ No matching screen logic for:', screen, params);
  }
};
