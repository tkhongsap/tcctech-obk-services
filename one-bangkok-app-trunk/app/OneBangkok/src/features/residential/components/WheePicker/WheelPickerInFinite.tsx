import React, {useMemo} from 'react';
import {
  FlatListProps,
  StyleProp,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';
import WheelPicker from './WheelPicker';

interface Props {
  selectedIndex: number;
  options: string[];
  onChange: (index: number) => void;
  selectedIndicatorStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: TextStyle;
  currentIndexItemTextStyle?: TextStyle;
  itemStyle?: ViewStyle;
  itemHeight?: number;
  containerStyle?: ViewStyle;
  containerProps?: Omit<ViewProps, 'style'>;
  scaleFunction?: (x: number) => number;
  rotationFunction?: (x: number) => number;
  opacityFunction?: (x: number) => number;
  visibleRest?: number;
  decelerationRate?: 'normal' | 'fast' | number;
  flatListProps?: Omit<FlatListProps<string | null>, 'data' | 'renderItem'>;
}

const WheelPickerInFinite = ({
  options,
  selectedIndex,
  onChange,
  ...rest
}: Props) => {
  const extendedOptions = useMemo(() => {
    return [...options, ...options, ...options];
  }, [options]);
  const middleIndex = Math.floor(extendedOptions.length / 3) + selectedIndex;
  const handleIndexChange = (index: number) => {
    const newIndex = index % options.length;
    onChange(newIndex);
  };

  return (
    <WheelPicker
      selectedIndex={middleIndex}
      options={extendedOptions}
      onChange={handleIndexChange}
      flatListProps={{
        initialNumToRender: extendedOptions.length,
        getItemLayout: (_, index) => ({length: 45, offset: 45 * index, index}),
      }}
      visibleRest={2}
      {...rest}
    />
  );
};

export default WheelPickerInFinite;
