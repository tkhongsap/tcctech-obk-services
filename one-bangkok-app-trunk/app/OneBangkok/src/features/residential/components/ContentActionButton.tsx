import getTheme from '~/utils/themes/themeUtils';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '~/components/atoms';

type item = {
  title: string;
  description: string;
  index: number;
};

type ListItemModule = item & {
  onPress: (index: number) => void;
};

export const ContentActionButton: React.FC<ListItemModule> = ({
  title,
  description,
  onPress,
  index,
}) => {
  return (
    <View className="flex flex-col px-4 border border-line-light">
      <TouchableOpacity
        className="py-4 flex flex-row justify-between items-center border-line-light"
        onPress={() => onPress(index)}>
        <View>
          <Text className={getTheme('text-base font-medium text-default mt-1')}>
            {title}
          </Text>
          <Text style={{ color: 'grey' }} className={getTheme('text-sm font-obRegular')}>
            {description}
          </Text>
        </View>
        <Icon type="arrowRightIcon" height={16} width={16} color="#292929" />
      </TouchableOpacity>
    </View>
  );
};

export default ContentActionButton;
