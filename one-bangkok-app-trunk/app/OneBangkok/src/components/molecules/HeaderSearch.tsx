import React, {useEffect} from 'react';
import {Pressable, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isNil, omitBy} from 'lodash';

import {useNavigation} from '~/navigations/AppNavigation';
import getTheme from '~/utils/themes/themeUtils';

import {IconButton, modalActions} from '~/components/molecules';
import LanguageModal from './LanguageModal';
import {TextInputClear} from '../atoms/TextInputClear';
import {Icon} from '../atoms';

const headerActions = {
  goBack: {
    component: (props?: any) => (
      <IconButton
        width={props.width ?? '25'}
        height={props.height ?? '25'}
        type="back"
        onPress={() => props.navigation.goBack()}
        {...props}
      />
    ),
  },
  switchLanguage: {
    component: (props?: any) => (
      <IconButton
        type="language"
        onPress={() => {
          modalActions.setContent(<LanguageModal />);
          modalActions.show();
        }}
        {...props}
      />
    ),
  },
  close: {
    component: (props?: any) => (
      <IconButton
        width={props.width ?? '25'}
        height={props.height ?? '25'}
        type="close"
        onPress={() => props.navigation.goBack()}
        {...props}
      />
    ),
  },
  search: {
    component: (props?: any) => (
      <IconButton
        width={props.width ?? '25'}
        height={props.height ?? '25'}
        type="search"
        onPress={() => {}}
        {...props}
      />
    ),
  },
};

interface HeaderActionProps {
  action: keyof typeof headerActions;
  onPress?: () => void;
  color?: string;
  height?: number;
  width?: number;
}

const HeaderAction = (props: HeaderActionProps) => {
  const {action, onPress, color, height, width} = props;
  const navigation = useNavigation();
  const headerActionProps = omitBy(
    {
      navigation,
      onPress,
      color,
      height,
      width,
    },
    isNil,
  );

  return headerActions[action].component(headerActionProps);
};

export interface HeaderProps {
  leftAction?: keyof typeof headerActions;
  onPressLeftAction?: () => void;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onClearText?: () => void;
  onPressIn?: () => void;
  disabled?: boolean;
  searchValue?: string;
  bgColor?: string;
  withPadding?: boolean;
  leftColor?: string;
  rightColor?: string;
  iconHeight?: number;
  iconWidth?: number;
  isOverlay?: boolean;
}

export const HeaderSearch = (props: HeaderProps) => {
  const {
    leftAction,
    onPressLeftAction,
    onChangeText,
    onClearText,
    onFocus,
    onPressIn,
    disabled,
    searchValue,
    bgColor = 'bg-default',
    withPadding = true,
    leftColor,
    iconHeight,
    iconWidth,
    isOverlay = false,
  } = props;

  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  let viewClassName = withPadding ? 'px-4 ' : '';
  viewClassName =
    viewClassName + 'flex h-[63px] flex-row flex-shrink items-center';
  useEffect(() => {
    if (leftAction !== 'goBack') {
      if (navigation.setOptions) {
        navigation.setOptions({
          gestureEnabled: false,
        });
      }
    }
  }, [leftAction, navigation]);

  return (
    <View
      className={getTheme(`${bgColor} w-full z-50 text-slate-950`)}
      style={{
        paddingTop: withPadding ? insets.top : 0,
        position: isOverlay ? 'absolute' : undefined,
      }}>
      <View className={viewClassName}>
        {leftAction && (
          <View className="flex-1 items-start">
            <View>
              <HeaderAction
                action={leftAction}
                onPress={onPressLeftAction}
                color={leftColor}
                height={iconHeight}
                width={iconWidth}
              />
            </View>
          </View>
        )}
        {disabled ? (
          <Pressable
            className={!leftAction ? 'flex w-full' : 'flex w-10/12'}
            onPress={onPressIn}>
            <View className="flex flex-wrap justify-start p-3 border truncate">
              <Text
                className="my-auto text-lg text-slate-950 "
                style={{fontFamily: 'OneBangkok-Italic'}}>
                {searchValue}
              </Text>
              <Pressable
                className="absolute top-1/3 right-0 pr-2 bg-white"
                onPress={onClearText}>
                <Icon type="close" color="#000000" />
              </Pressable>
            </View>
          </Pressable>
        ) : (
          <View className={!leftAction ? 'flex w-full' : 'flex w-10/12'}>
            <TextInputClear
              className="w-full text-slate-950"
              onChangeText={onChangeText}
              onClear={onClearText}
              onFocus={onFocus}
              onPressIn={onPressIn}
              rightIcon="search"
              placeholder="Search here"
              value={searchValue}
            />
          </View>
        )}
      </View>
    </View>
  );
};
