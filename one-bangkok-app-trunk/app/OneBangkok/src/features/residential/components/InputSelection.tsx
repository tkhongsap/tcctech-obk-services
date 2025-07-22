import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import React, {useMemo} from 'react';

interface Props {
  title: string;
  selected?: string;
  placeholder?: string;
  hasError?: boolean;
  errorMessage?: string;
  onPress?: () => void;
  disabled?: boolean;
}
const InputSelection = ({
  title,
  selected,
  placeholder,
  hasError = false,
  errorMessage = '',
  onPress = () => {},
  disabled = false,
}: Props) => {
  const borderColor = useMemo(() => {
    if (hasError) return 'border-fire-engine-red-light bg-error-light';
    if (selected) return 'border-dark-gray-light';
    if (!selected) return 'border-[#777777]';
  }, [selected, hasError]);

  return (
    <View className="item flex flex-col space-y-1">
      <Text color="dark-gray" size="B1" weight="regular">
        {title}
      </Text>
      <TouchableOpacity
        className={`flex flex-row justify-between items-center px-4 py-3 border ${borderColor}`}
        onPress={onPress}
        disabled={disabled}>
        <Text
          color={!selected ? 'muted-400' : 'dark-gray'}
          size="B1"
          weight="regular"
          className={!selected ? 'OneBangkok-Italic' : 'OneBangkok-Regular'}
          style={!selected ? {fontFamily: 'OneBangkok-Italic'} : undefined}>
          {selected ? selected : placeholder}
        </Text>
        <Icon type="scArrowDownIcon" width={20} height={20} color="#000000" />
      </TouchableOpacity>
      {hasError && (
        <Text color="fire-engine-red" size="B1" weight="regular">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default InputSelection;
