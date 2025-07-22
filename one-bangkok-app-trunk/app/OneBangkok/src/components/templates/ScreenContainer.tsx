import React, {useState} from 'react';
import {SafeAreaView, Dimensions, View} from 'react-native';
import CustomStatusBar from '~/components/molecules/CustomStatusBar'; // Adjust the import path as necessary
import getTheme from '~/utils/themes/themeUtils';
import type {StatusBarStyle} from 'react-native';
import Loading from '~/components/organisms/Loading';
const STYLES = ['default', 'dark-content', 'light-content'] as const;
const TRANSITIONS = ['fade', 'slide', 'none'] as const;

export const ScreenContainer = (props: any) => {
  props = {
    isTheme: false,
    bgColor: 'bg-default',
    ...props,
  };
  const [hidden, setHidden] = useState(false);
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(
    STYLES[0],
  );
  const [statusBarTransition, setStatusBarTransition] = useState<
    'fade' | 'slide' | 'none'
  >(TRANSITIONS[0]);

  return (
    <View
      className={getTheme(`flex-1 justify-start items-center h-screen w-full}`)}
      style={{backgroundColor: props.bgColor}}>
      <CustomStatusBar
        animated={true}
        backgroundColor={props.bgColor}
        barStyle={props.barStyle}
        showHideTransition={statusBarTransition}
        hidden={hidden}
      />
      <SafeAreaView
        className={getTheme(`items-center h-screen w-full`)}
        style={{backgroundColor: 'white'}}>
        {props.children}
      </SafeAreaView>

      <Loading isLoading={props.isLoading} />
    </View>
  );
};
