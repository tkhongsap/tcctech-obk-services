import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, IconType} from './Icon';

export interface RoundedCheckboxProps {
  width: number;
  height: number;
  value: boolean;
  onPress?: Function;
  error: boolean;
  testID?: string;
}

export const RoundedCheckbox = (props: RoundedCheckboxProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const {width, height, onPress, error, testID, ...restProps} = props;
  const handleOnPress = () => {
    setIsChecked(!isChecked);
    onPress && onPress(!isChecked);
  };
  const getCheckboxType = (): IconType => {
    if (isChecked) {
      return 'roundedCheckedBox';
    } else if (error) {
      return 'errorRoundedCheckBox';
    } else {
      return 'roundedUnCheckedBox';
    }
  };
  return (
    <TouchableOpacity {...restProps} onPress={handleOnPress} testID={testID}>
      {<Icon type={getCheckboxType()} width={width} height={height} />}
    </TouchableOpacity>
  );
};
