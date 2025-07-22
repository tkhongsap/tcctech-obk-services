import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import RadioButton from './RadioButton';
import ToggleSwitch from './ToggleSwitch';
import {Slider} from '@miblanchard/react-native-slider';
import {ModuleBNLD} from '~/states/residentialSchedule/residentialScheduleState';

const MAX_BRIGHTNESS = 100;
const MIN_BRIGHTNESS = 0;

export type SelectedModuleBNLD = ModuleBNLD & {selected: boolean};
type Props = {
  module: SelectedModuleBNLD;
  onChanged: (module: SelectedModuleBNLD) => void;
  disabled: boolean;
};

const ActionScheduleModuleBNLD = React.memo(
  ({module, onChanged, disabled}: Props) => {
    const onSlidingComplete = (brightness: number) => {
      onChanged({...module, brightness});
    };

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
        style={{gap: 12}}>
        <View>
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

          {module.selected && module.on && (
            <View className="flex-col w-full">
              <View className="flex-row items-center justify-between mb-1.5">
                <Icon
                  type="scMoonIcon"
                  width={12}
                  height={12}
                  color="#292929"
                />
                <Icon type="scSunIcon" width={16} height={16} color="#292929" />
              </View>

              <Slider
                value={module.brightness}
                onSlidingComplete={values => onSlidingComplete(values[0])}
                minimumValue={MIN_BRIGHTNESS}
                maximumValue={MAX_BRIGHTNESS}
                trackStyle={styles.track}
                minimumTrackTintColor="#014541"
                disabled={disabled || !module.selected || !module.on}
                trackClickable={true}
                renderThumbComponent={() => <View style={styles.container} />}
                step={1}
              />
            </View>
          )}
        </View>
      </View>
    );
  },
);

export default ActionScheduleModuleBNLD;

const styles = StyleSheet.create({
  track: {
    borderRadius: 50,
    backgroundColor: '#E4E4E4',
    height: 21,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#00000015',
    height: 0,
    justifyContent: 'center',
    width: 0,
  },
});
