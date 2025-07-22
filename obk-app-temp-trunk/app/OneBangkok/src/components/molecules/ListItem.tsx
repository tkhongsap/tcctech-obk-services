import React from 'react';
import {ButtonProps, TouchableOpacity, View} from 'react-native';

import {
  Icon,
  Spacing,
  Text,
  textColorVariant,
  textWeightVariant,
} from '../atoms';
import {activeOpacity} from '~/constants';
import clsx from 'clsx';
import Switch from '../atoms/Switch';
import getTheme from '~/utils/themes/themeUtils';

const rightElementTypes = {
  switch: 'switch',
  text: 'text',
  tag: 'tag',
  hyperText: 'hyperText',
  right: 'right',
};

export type rightElement = keyof typeof rightElementTypes;
export interface ListItemProps extends ButtonProps {
  rightElement?: rightElement;
  rightText?: string;
  toggle?: boolean;
  onSwitch?: Function;
  className?: string;
  paddingY?: number;
  description?: string;
  key?: string;
  rightTextClassname?: string;
  textDescriptionColor?: keyof typeof textColorVariant;
  textTitleColor?: keyof typeof textColorVariant;
  textTitleWeight?: keyof typeof textWeightVariant;
  isShow?: boolean;
}

interface RightElementProps {
  rightElement?: rightElement;
  onPress?: Function;
  onSwitch?: Function;
  text?: string;
  toggle: boolean;
  textColor?: keyof typeof textColorVariant;
}
// move to molecules
const RightElement = ({
  onSwitch,
  onPress,
  text,
  rightElement,
  toggle,
  textColor = 'primary',
}: RightElementProps) => {
  const handleOnSwitch = (value: boolean) => {
    onSwitch && onSwitch(value);
  };
  const handleOnPress = () => {
    onPress && onPress();
  };
  switch (rightElement) {
    case rightElementTypes.right:
      return <Icon type={'right'} width={16} height={16} />;
    case rightElementTypes.text:
      return (
        <Text weight="regular" size="B1" color={textColor}>
          {text}
        </Text>
      );
    case rightElementTypes.hyperText:
      return (
        // todo: frame text
        <Text
          weight="regular"
          size="B1"
          color="primary"
          onPress={handleOnPress}>
          {text}
        </Text>
      );
    case rightElementTypes.switch:
      return (
        <Switch
          value={toggle}
          disabled={false}
          onValueChange={handleOnSwitch}
        />
      );
    case rightElementTypes.tag:
      return (
        <View className="justify-center">
          <View
            className={getTheme(
              'px-2 justify-center border border-jet-black h-6',
            )}>
            <Text size="B2" weight="regular">
              {text}
            </Text>
          </View>
        </View>
      );
    default:
      return null;
  }
};

export const ListItem = (props: ListItemProps) => {
  const {
    title,
    rightElement,
    rightText,
    className,
    onSwitch,
    description,
    onPress,
    paddingY,
    toggle = false,
    textDescriptionColor = 'subtitle-muted',
    textTitleColor = 'jet-black',
    textTitleWeight,
    isShow = true,
    ...restProps
  } = props;

  const mergedContainerClassName = clsx(
    'flex flex-row items-center',
    rightElement && 'justify-between',
    className,
  );

  const spacing = () => {
    if (paddingY) {
      return paddingY;
    }
    return description ? 20 : 16;
  };
  const isSectionPressable = rightElement === rightElementTypes.hyperText;

  const mergedTextWieght =
    (textTitleWeight && textTitleWeight) ||
    (description && 'regular') ||
    'regular';

  if (!isShow) {
    return <></>;
  }

  return (
    <TouchableOpacity
      {...restProps}
      activeOpacity={activeOpacity}
      onPress={!isSectionPressable ? onPress : () => {}}>
      <Spacing height={spacing()} />
      <View className={mergedContainerClassName} style={{width: '100%'}}>
        <View
          style={{
            flexShrink: 1,
            minWidth: rightElement === rightElementTypes.text ? '50%' : 0,
          }}>
          <Text weight={mergedTextWieght} size="B1" color={textTitleColor}>
            {title}
          </Text>
          {description && (
            <Text weight="regular" size="B2" color={textDescriptionColor}>
              {description}
            </Text>
          )}
        </View>
        <Spacing width={4} />
        <View
          style={{flexShrink: rightElement === rightElementTypes.text ? 1 : 0}}>
          <RightElement
            onSwitch={onSwitch}
            onPress={onPress}
            text={rightText}
            rightElement={rightElement}
            toggle={toggle}
          />
        </View>
      </View>
      <Spacing height={spacing()} />
    </TouchableOpacity>
  );
};
