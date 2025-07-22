import {TouchableOpacity, View} from 'react-native';
import React, {ReactElement} from 'react';
import getTheme from '~/utils/themes/themeUtils';
import {Spacing, Text, textColorVariant} from '~/components/atoms';

const DetailCardParcel = ({
  header,
  headerRight,
  headerRightAction,
  children,
  headerRightColor,
}: {
  header: string;
  headerRight?: string;
  headerRightAction?: () => void;
  children: ReactElement;
  headerRightColor?: keyof typeof textColorVariant;
}) => {
  return (
    <View
      className={getTheme(
        'flex w-full border border-line px-4 pb-[20px] pt-[14px]',
      )}>
      <View className={getTheme('')}>
        <View className="flex flex-row justify-between">
          <Text weight="medium">{header}</Text>
          <TouchableOpacity onPress={headerRightAction}>
            <Text size="B2" color={headerRightColor ?? 'primary'}>
              {headerRight}
            </Text>
          </TouchableOpacity>
        </View>
        <Spacing height={0} />
      </View>
      <Spacing height={0} />
      {children}
    </View>
  );
};

export default DetailCardParcel;
