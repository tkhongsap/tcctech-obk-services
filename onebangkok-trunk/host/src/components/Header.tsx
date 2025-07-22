import React, {ReactElement} from 'react';
import {Text, View} from 'react-native';
import SvgButton from './IconSvgButton';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../navigations/AppNavigation';
import ArrowPrev from '../assets/images/ArrowPrev.svg';
import getTheme, {GetPureColorCode} from '~/utils/themes/themeUtils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  title?: string;
  withBackButton?: boolean;
  headerRight?: ReactElement;
  headerLeft?: ReactElement;
  onPress?: Function;
  backgroundColor?: string;
  isNavigateBack?: boolean;
  isTheme?: boolean;
};

const Header = (props: Props) => {
  const navigation = useNavigation<StackNavigation>();

  props = {
    withBackButton: true,
    isNavigateBack: true,
    isTheme: true,
    ...props,
  };

  const insets = useSafeAreaInsets();

  const onPressBack = () => {
    if (props.onPress != null) {
      props.onPress();
    }
    if (props.isNavigateBack) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        height: insets.top + 60,
      }}>
      <View
        className={`flex h-[60px] justify-center min-w-full px-5 flex-row items-center ${getTheme(
          'bg-default',
        )}`}>
        <View className="w-1/5 flex justify-center items-start">
          {props.withBackButton ? (
            <SvgButton
              onPress={onPressBack}
              color={GetPureColorCode('muted')}
              SvgSource={ArrowPrev}
            />
          ) : null}
          {props.headerLeft}
        </View>
        <View className="flex-1 flex justify-center items-center flex-grow">
          <Text className={getTheme('text-default font-semibold text-lg')}>
            {props.title ?? ''}
          </Text>
        </View>
        <View className="w-1/5 flex justify-center items-end">
          {props.headerRight}
        </View>
      </View>
    </View>
  );
};

export default Header;
