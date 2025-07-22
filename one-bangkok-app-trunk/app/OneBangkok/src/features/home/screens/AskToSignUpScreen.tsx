import {Dimensions, Image, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Screen} from '~/components';
import {Spacing, Text} from '~/components/atoms';
import {Button, IconButton} from '~/components/molecules';
import T from '~/utils/text';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';

import OBLogo from '~/assets/images/ob_logo.svg';
import AskToSignInIcon from '~/assets/images/ask_to_sign_in_icon.svg';
import AskToSignInImage2 from '~/assets/images/ask_to_sign_in_image2.svg';
import {useEffect} from 'react';
import {logScreenView} from '~/utils/logGA';

const AskToSignUpScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get('window').width;

  const onPressSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  const onPressSignIn = () => {
    navigation.navigate('SignInScreen');
  };

  const onPressClose = () => {
    navigation.goBack();
  };
  useEffect(() => {
    logScreenView('AskToSignUpScreen');
  }, []);
  return (
    <Screen>
      <View className="flex-1 w-full">
        <View className="flex-1">
          <View className="flex-1 pb-[35px]">
            <Image
              className="flex-1 w-full"
              source={require('~/assets/images/ask_to_sign_in_image.png')}
            />
            <View className={'absolute bottom-[35px]'}>
              <AskToSignInImage2
                width={windowWidth}
                height={(windowWidth / 375) * 161}
                fill={'#FFFFFF'}
              />
            </View>
            <View className={'self-center absolute bottom-0'}>
              <AskToSignInIcon />
            </View>
            <View className={'absolute right-[20px] top-[20px]'}>
              <Spacing height={insets.top} />
              <IconButton type="cancel" onPress={onPressClose} />
            </View>
          </View>
        </View>
        <View>
          <View className="px-6">
            <Spacing height={34} />
            <Text className="text-center" size="H1" weight="bold">
              {T(
                'AskToSignUpScreen__title',
                'Unlock personalisation and benefits with a\nOne Bangkok account',
              )}
            </Text>
            <Spacing height={40} />
            <Button
              title={T(
                'AskToSignUpScreen__sign_up_button',
                'Sign up for free now',
              )}
              color="primary"
              onPress={onPressSignUp}
            />
            <Spacing height={11} />
            <Button
              title={T(
                'AskToSignUpScreen__sign_in_button',
                'I already have an account',
              )}
              color="primary"
              outlined
              onPress={onPressSignIn}
            />
            <Spacing height={54} />
            <View className="self-center">
              <OBLogo fill={'#1A1724'} />
            </View>
            <Spacing height={14 + insets.bottom} />
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default AskToSignUpScreen;
