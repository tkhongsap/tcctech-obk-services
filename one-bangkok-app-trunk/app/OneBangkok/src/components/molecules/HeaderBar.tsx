import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isNil, omitBy} from 'lodash';

import {useNavigation} from '~/navigations/AppNavigation';
import getTheme from '~/utils/themes/themeUtils';

import {Text, textColorVariant} from '~/components/atoms';
import {IconButton, modalActions} from '~/components/molecules';
import LanguageModal from '~/components/molecules/LanguageModal';

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
  title?: string;
  leftAction?: keyof typeof headerActions;
  onPressLeftAction?: () => void;
  rightAction?: keyof typeof headerActions;
  onPressRightAction?: () => void;
  titlePosition?: 'center' | 'right';
  bgColor?: string;
  withPadding?: boolean;
  leftColor?: string;
  rightColor?: string;
  iconHeight?: number;
  iconWidth?: number;
  titleColor?: keyof typeof textColorVariant;
}

export const HeaderBar = (props: HeaderProps) => {
  const {
    title,
    leftAction,
    onPressLeftAction,
    rightAction,
    onPressRightAction,
    bgColor = 'bg-default',
    titlePosition = 'center',
    withPadding = true,
    leftColor,
    rightColor,
    iconHeight,
    iconWidth,
    titleColor = 'default',
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
      className={getTheme(`${bgColor} w-full z-50`)}
      style={{
        // paddingTop: withPadding ? insets.top : 0,
      }}>
      <View className={viewClassName}>
        <View className="flex-1 items-start">
          <View>
            {leftAction && (
              <HeaderAction
                action={leftAction}
                onPress={onPressLeftAction}
                color={leftColor}
                height={iconHeight}
                width={iconWidth}
              />
            )}
          </View>
        </View>
        <View className="items-center flex flex-auto">
          {title && titlePosition === 'center' && (
            <Text weight="medium" color={titleColor}>
              {title}
            </Text>
          )}
        </View>
        <View className=" flex-auto items-end">
          {titlePosition === 'right' ? (
            <Text weight="medium" color={titleColor}>
              {title}
            </Text>
          ) : (
            rightAction && (
              <HeaderAction
                action={rightAction}
                onPress={onPressRightAction}
                color={rightColor}
              />
            )
          )}
        </View>
      </View>
    </View>
  );
};
