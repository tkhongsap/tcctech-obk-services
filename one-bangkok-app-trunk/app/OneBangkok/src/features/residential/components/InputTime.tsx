import {TouchableOpacity} from 'react-native';
import {Text} from '~/components/atoms';
import React from 'react';
import {modalActions} from './ResidentialModal';
import TimePickerModal from './TimePickerModal';
type Time = {
  hour: number;
  minute: number;
};
type Props = {
  time: Time;
  setTime?: (time: Time) => void;
  disabled?: boolean;
};
const defaultTime: Time = {
  hour: 0,
  minute: 0,
};

const InputTime = ({
  time = defaultTime,
  setTime = () => {},
  disabled = false,
}: Props) => {
  const onPress = () => {
    modalActions.setContent(<TimePickerModal time={time} setTime={setTime} />);
    modalActions.show();
  };

  const paddingWith2Zero = (value: string) => value.padStart(2, '0');

  return (
    <TouchableOpacity
      className="w-full py-9 px-4 flex flex-row justify-center border border-line-light"
      style={{gap: 8}}
      onPress={onPress}
      disabled={disabled}>
      <Text className="w-fit" weight="medium" size="B1" color="dark-gray">
        {paddingWith2Zero(time.hour.toString())}
      </Text>
      <Text className="w-fit" weight="medium" size="B1" color="dark-gray">
        :
      </Text>
      <Text className="w-fit" weight="medium" size="B1" color="dark-gray">
        {paddingWith2Zero(time.minute.toString())}
      </Text>
    </TouchableOpacity>
  );
};

export default InputTime;
