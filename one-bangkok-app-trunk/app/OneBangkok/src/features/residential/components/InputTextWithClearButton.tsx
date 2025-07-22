import {TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Icon, Text, TextInput} from '~/components/atoms';
import t from '~/utils/text';
type Props = {
  title?: string;
  initialValue?: string;
  onValueChange?: (value?: string) => void;
  persistentValue?: boolean;
  disabled?: boolean;
  error?: boolean;
  onPressIn?: () => void;
};
const InputTextWithClearButton = ({
  title,
  initialValue,
  onValueChange,
  persistentValue = true,
  disabled = false,
  error = false,
  onPressIn,
}: Props) => {
  const [value, setValue] = useState(initialValue);

  const onChangeText = (value?: string) => {
    onValueChange && onValueChange(value);
    setValue(value);
  };

  return (
    <View className="bg-[#ffffff] w-full px-4 flex flex-col" style={{gap: 4}}>
      <Text size="B1" weight="regular" color="dark-gray">
        {title}
      </Text>
      <View className="relative w-full">
        <TextInput
          className="h-[48px]"
          id={title}
          value={value}
          onChangeText={onChangeText}
          persistentValue={persistentValue}
          disabled={disabled}
          error={error}
          onPressIn={onPressIn}
        />
        {value && (
          <TouchableOpacity
            className="absolute top-[14px] right-3"
            onPress={() => onChangeText()}>
            <Icon type={'close'} width={12} height={12} color={'#7C7C7C'} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text size="B2" weight="regular" color="fire-engine-red">
          {t(
            'Residential__Home_Automation__Name_Used',
            'This name is already used!',
          )}
        </Text>
      )}
    </View>
  );
};

export default InputTextWithClearButton;
