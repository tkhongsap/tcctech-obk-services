import {TouchableOpacity, View} from 'react-native';
import React, {ReactElement} from 'react';
import getTheme from '~/utils/themes/themeUtils';
import {Spacing, Text, textColorVariant} from '~/components/atoms';

const DetailCard = ({
  header,
  headerRight,
  headerRightAction,
  children,
  headerRightColor
}: {
  header: string;
  headerRight?: string;
  headerRightAction?: () => void;
  children: ReactElement;
  headerRightColor?: keyof typeof textColorVariant
}) => {
  return (
    <View className={getTheme('flex w-full border border-line px-6 py-[20px]')}>
      <View className={getTheme('border-b border-line')}>
        <View className="flex flex-row justify-between">
          <Text weight="medium">{header}</Text>
          <TouchableOpacity onPress={headerRightAction}>
            <Text size="B2" color={ headerRightColor ?? "primary"}>
              {headerRight}
            </Text>
          </TouchableOpacity>
        </View>
        <Spacing height={20} />
      </View>
      <Spacing height={20} />
      {children}
    </View>
  );
};

export default DetailCard;
