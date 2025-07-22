import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, IconType} from './Icon';

export interface CheckboxProps {
  width: number;
  height: number;
  value: boolean;
  onPress?: Function;
  error?: boolean;
  testID?: string;
}

export const Checkbox = (props: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const {width, height, onPress, error, testID, value, ...restProps} = props;
  const handleOnPress = () => {
    setIsChecked(!isChecked);
    onPress && onPress(!isChecked);
  };
  const getCheckboxType = (): IconType => {
    if (value) {
      return 'checkedBox';
    } else if (error) {
      return 'errorCheckBox';
    } else {
      return 'unCheckedBox';
    }
  };
  return (
    <TouchableOpacity {...restProps} onPress={handleOnPress} testID={testID}>
      {
        <Icon
          type={getCheckboxType()}
          width={width}
          height={height}
          color={value ? 'black' : 'white'}
        />
      }
    </TouchableOpacity>
  );
};
