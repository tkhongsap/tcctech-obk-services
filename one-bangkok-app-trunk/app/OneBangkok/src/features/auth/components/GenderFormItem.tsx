import {View} from 'react-native';
import {CustomButton} from '~/components';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {isEmpty} from 'lodash';
import {useFormContext} from 'react-hook-form';
import {Icon, Text} from '~/components/atoms';

const genderMapValue = {
  ['male']: 'General__Male',
  ['female']: 'General__Female',
  ['nonbinary']: 'General__Nonbinary',
  ['prefernottosay']: 'General__Prefer_not_to_say',
};
export type genderType = keyof typeof genderMapValue;

interface GenderFormItemProps {
  type: genderType;
  testID: string;
  onPress: () => void;
}
const GenderFormItem = ({type, testID, onPress}: GenderFormItemProps) => {
  const {watch, formState} = useFormContext();
  const isSelected = type === watch('gender');

  return (
    <CustomButton
      testID={testID}
      onPress={() => {
        onPress && onPress();
      }}>
      <View
        className={`${getTheme(
          'h-[48px] px-4 border justify-between items-center inline-flex flex-row',
        )} ${getTheme(
          isSelected ? 'border-jet-black bg-light-gray' : 'border-line',
        )} ${getTheme(
          !isEmpty(formState.errors['gender']?.message)
            ? 'bg-error border-error'
            : '',
        )}`}>
        <Text
          className={` text-dark-gray leading-tight ${getTheme(
            isSelected ? 'font-obMedium' : 'font-obRegular',
          )}`}>
          {t(genderMapValue[type], type.toString())}
        </Text>
        <View className={`w-4 h-4 items-center justify-center`}>
          {isSelected ? (
            <Icon
              type={'checkedIcon'}
              width={16}
              height={16}
              color={'#1A1919'}
            />
          ) : null}
        </View>
      </View>
    </CustomButton>
  );
};
export default GenderFormItem;
