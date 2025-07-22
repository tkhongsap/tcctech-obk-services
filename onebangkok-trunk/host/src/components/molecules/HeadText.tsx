import React from 'react';
import {View} from 'react-native';

import {
  Spacing,
  Text,
  TextProps,
  textColorVariant,
  textSizeVariant,
  textWeightVariant,
} from '../atoms';
import {TouchableOpacity} from 'react-native-gesture-handler';

export interface HeadTextProps {
  tagline?: string;
  titleSize?: keyof typeof textSizeVariant;
  titleClamps?: string;
  title: string;
  description?: string;
  taglineColor?: TextProps['color'];
  tagSpacing?: number;
  titleIconColor?: string;
  titleColor?: keyof typeof textColorVariant;
  descriptionColor?: keyof typeof textColorVariant;
  descriptionSpacing?: number;
  taglineWeight?:  keyof typeof textWeightVariant
}

const defaultProps: HeadTextProps = {
  taglineColor: 'subtitle-muted',
  titleSize: 'H1',
  titleClamps: 'leading-[35.2px]',
  title: '',
  tagSpacing: 6,
  descriptionColor: 'subtitle-muted',
};

export const HeadText = (props: HeadTextProps) => {
  const {
    tagline,
    title,
    taglineColor,
    description,
    titleSize,
    titleClamps,
    tagSpacing,
    titleIconColor,
    titleColor,
    descriptionColor,
    descriptionSpacing,
    taglineWeight,
  } = props;

  return (
    <View>
      <Text size="B2" color={taglineColor} weight={taglineWeight ?? 'medium'}>
        {tagline}
      </Text>
      <Spacing height={tagSpacing} />
      <View className="flex-row">
        {titleIconColor && (
          <>
            <TouchableOpacity
              style={{
                backgroundColor: titleIconColor,
                width: 6,
                height: 25,
                marginTop: 2,
              }}
            />
            <Spacing width={12} />
          </>
        )}
        <Text
          size={titleSize}
          weight="medium"
          className={titleClamps}
          color={titleColor}>
          {title}
        </Text>
      </View>
      {description && (
        <>
          <Spacing height={descriptionSpacing ?? 24} />
          <Text
            size="B1"
            weight="regular"
            color={descriptionColor}
            className="leading-[19.2px]">
            {description}
          </Text>
        </>
      )}
    </View>
  );
};

HeadText.defaultProps = defaultProps;
