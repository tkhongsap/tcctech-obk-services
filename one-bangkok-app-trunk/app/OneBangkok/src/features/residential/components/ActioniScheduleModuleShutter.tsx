import React from 'react';
import {View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Icon} from '~/components/atoms';

interface ControlStateProps {
  disabled?: boolean;
  asChild?: boolean;
  initialValue: number;
  onControlChange: (value: State) => void;
}

export enum State {
  Close = 0,
  Middle = 50,
  Open = 100,
}

const ActionScheduleModuleShutter: React.FC<ControlStateProps> = ({
  initialValue = 0,
  disabled = false,
  asChild = false,
  onControlChange,
}) => {
  const styleControllerButtons =
    'flex-row items-center ' + (asChild ? 'mt-[8px]' : 'mt-[16px]');

  return (
    <View className="w-full flex flex-col">
      <View className={styleControllerButtons}>
        <TouchableWithoutFeedback
          disabled={disabled}
          onPress={() => onControlChange(State.Open)}
          className={
            initialValue === State.Open
              ? 'w-[45px] h-[45px] rounded-full flex items-center justify-center bg-dark-teal-dark mr-[44px]'
              : 'w-[45px] h-[45px] rounded-full flex items-center justify-center bg-[#EFEFEF] mr-[44px]'
          }>
          <Icon
            type={
              initialValue === State.Open
                ? 'scArrowUpWhiteIcon'
                : 'scArrowUpIcon'
            }
            width={16}
            height={16}
            color={'#014541'}
          />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          disabled={disabled}
          onPress={() => onControlChange(State.Close)}
          className={
            initialValue === State.Close
              ? 'w-[45px] h-[45px] rounded-full flex items-center justify-center bg-dark-teal-dark'
              : 'w-[45px] h-[45px] rounded-full flex items-center justify-center bg-[#EFEFEF]'
          }>
          <Icon
            type={
              initialValue === State.Close
                ? 'scArrowDownWhiteIcon'
                : 'scArrowDownIcon'
            }
            width={16}
            height={16}
            color={'#014541'}
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};
export default ActionScheduleModuleShutter;
