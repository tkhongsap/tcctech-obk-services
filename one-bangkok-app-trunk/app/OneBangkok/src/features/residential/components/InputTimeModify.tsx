import {TouchableOpacity} from 'react-native';
import {Text} from '~/components/atoms';
import React from 'react';
import {modalActions} from './ResidentialModal';
import DayTimePickerModal, {DayPicker} from './DayTimePickerModal';
import t from '~/utils/text';

type Time = {
  day: DayPicker;
  hour: number;
  minute: number;
};

type Props = {
  time: Time;
  onConfirm?: (time: Time) => void;
  disabled?: boolean;
};

const InputTimeModify = ({time, onConfirm, disabled}: Props) => {
  const onPressModal = () => {
    modalActions.setContent(
      <DayTimePickerModal time={time} onConfirm={onConfirm} />,
    );
    modalActions.show();
  };

  const paddingWith2Zero = (value: string) => value.padStart(2, '0');

  const mappingLanguageDay = (key: string) => {
    switch (key) {
      case 'Sunday':
        return t('Residential__Home_Automation__full_Sunday', 'Sunday');

      case 'Monday':
        return t('Residential__Home_Automation__full_Monday', 'Monday');

      case 'Tuesday':
        return t('Residential__Home_Automation__full_Tuesday', 'Tuesday');

      case 'Wednesday':
        return t('Residential__Home_Automation__full_Wednesday', 'Wednesday');

      case 'Thursday':
        return t('Residential__Home_Automation__full_Thursday', 'Thursday');

      case 'Friday':
        return t('Residential__Home_Automation__full_Friday', 'Friday');

      case 'Saturday':
        return t('Residential__Home_Automation__full_Saturday', 'Saturday');

      default:
        return key;
    }
  };

  return (
    <TouchableOpacity
      className="w-full py-9 px-4 flex flex-row justify-center border border-line-light"
      style={{gap: 50}}
      onPress={onPressModal}
      disabled={disabled}>
      <Text className="w-fit" weight="medium" size="B1" color="dark-gray">
        {mappingLanguageDay(time.day)}
      </Text>
      <Text className="w-fit" weight="medium" size="B1" color="dark-gray">
        {paddingWith2Zero(time.hour.toString())}
      </Text>
      <Text className="w-fit" weight="medium" size="B1" color="dark-gray">
        {paddingWith2Zero(time.minute.toString())}
      </Text>
    </TouchableOpacity>
  );
};

export default InputTimeModify;
