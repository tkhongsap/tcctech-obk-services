import {View} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import RadioButton from './RadioButton';
import {ModuleBNAS} from '~/states/residentialSchedule/residentialScheduleState';
import ActionScheduleModuleShutter from './ActioniScheduleModuleShutter';

export type SelectedModuleBNAS = ModuleBNAS & {selected: boolean};

type Props = {
  module: SelectedModuleBNAS;
  onChanged: (module: SelectedModuleBNAS) => void;
  disabled: boolean;
};

const ActionScheduleModuleBNAS = React.memo(
  ({module, onChanged, disabled}: Props) => {
    const onRadioChange = (selected: boolean) => {
      onChanged({...module, selected});
    };

    const onControlChange = (target_position: number) => {
      onChanged({
        ...module,
        target_position,
      });
    };

    return (
      <View
        key={module.id}
        className="w-full flex flex-col border-b border-line-light p-4">
        <View className="flex flex-row items-center">
          <View className="flex flex-row items-center">
            <RadioButton
              moduleEnableSelection={module.selected}
              onRadioChange={onRadioChange}
              disabled={disabled}
            />
            <Text size="B1" weight="medium" color="dark-gray">
              {module.name}
            </Text>
          </View>
        </View>

        {module.selected && (
          <ActionScheduleModuleShutter
            initialValue={module.target_position}
            asChild={false}
            onControlChange={onControlChange}
            disabled={disabled || !module.selected}
          />
        )}
      </View>
    );
  },
);

export default ActionScheduleModuleBNAS;
