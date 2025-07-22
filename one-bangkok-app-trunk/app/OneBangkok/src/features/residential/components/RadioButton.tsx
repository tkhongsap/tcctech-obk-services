import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Icon} from '~/components/atoms'; // Assuming you have an Icon component

type RadioButtonProps = {
  moduleEnableSelection: boolean;
  onRadioChange: (selection: boolean) => void;
  activeOpacity?: number;
  disabled?: boolean;
};

const RadioButton: React.FC<RadioButtonProps> = ({
  moduleEnableSelection,
  onRadioChange,
  activeOpacity = 0.7, // Default value if not provided
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      key={'-radio-'}
      activeOpacity={activeOpacity}
      onPress={() => {
        onRadioChange(!moduleEnableSelection);
      }}
      style={{left: -4}}
      disabled={disabled}>
      <View className={'flex flex-row items-center justify-between'}>
        <View>
          <Icon
            type={moduleEnableSelection ? 'scRadioCheckedIcon' : 'scRadioIcon'}
            width={20}
            height={20}
            color={'none'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
