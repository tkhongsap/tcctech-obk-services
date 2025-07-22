import {View} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import RadioButton from './RadioButton';
import ToggleSwitch from './ToggleSwitch';
import {ModuleBNIL} from '~/states/residentialSchedule/residentialScheduleState';

export type SelectedModuleBNIL = ModuleBNIL & {selected: boolean};

type Props = {
  module: SelectedModuleBNIL;
  onChanged: (module: SelectedModuleBNIL) => void;
  disabled: boolean;
};

const ActionScheduleModuleBNIL = React.memo(
  ({module, onChanged, disabled}: Props) => {
    const onRadioChange = (selected: boolean) => {
      onChanged({...module, selected});
    };

    const onToggle = (on: boolean) => {
      onChanged({...module, on});
    };

    return (
      <View
        key={module.id}
        className={'w-full flex flex-col px-4 py-6 border-b border-line-light'}
        style={{gap: 4}}>
        <View
          className="flex flex-row justify-between items-center"
          style={{gap: 8}}>
          <View className="flex flex-row items-center">
            <RadioButton
              moduleEnableSelection={module.selected}
              onRadioChange={onRadioChange}
              disabled={disabled}
            />
            <Text weight="medium" size="B1">
              {module.name}
            </Text>
          </View>
          {module.selected && (
            <ToggleSwitch
              initialValue={module.on}
              onToggle={onToggle}
              disabled={disabled || !module.selected}
            />
          )}
        </View>
      </View>
    );
  },
);

export default ActionScheduleModuleBNIL;
