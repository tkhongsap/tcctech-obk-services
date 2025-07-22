import { View, StyleSheet } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { Icon, Text } from '~/components/atoms';
import StatusSlider from './StatusSlider';
import { Slider } from '@miblanchard/react-native-slider';
import RadioButton from './RadioButton';
import { debounce } from 'lodash';
type Module = {
  id: string;
  type: string;
  name: string;
  setup_date: number;
  room_id: string;
  modules_bridged: null;
  bridge: string;
  on: boolean;
  offload: boolean;
  firmware_revision: number;
  last_seen: number;
  reachable: boolean;
  brightness: number | null;
  current_position: null | number;
  target_position: null | number;
  target_positionstep: null | number;
  cooler_status: boolean | null;
  fan_speed: number | null;
  fan_mode: string | null;
  humidity: number | null;
};

const MAX_BRIGHTNESS = 100;
const MIN_BRIGHTNESS = 0;

type BNLDModuleProps = {
  homeId: string;
  module: Module;
  moduleEnableSelection: boolean;
  moduleEnableMappingValue: boolean;
  setModuleEnableSelection: (value: boolean) => void;
  onModuleChange: (updatedModule: Module, isSelected: boolean) => void;
};

const BNLDModule: React.FC<BNLDModuleProps> = ({
  homeId,
  module,
  moduleEnableSelection,
  moduleEnableMappingValue,
  setModuleEnableSelection,
  onModuleChange,
}) => {
  const [selectedBrightness, setSelectedBrightness] = useState(
    module.brightness,
  );
  const [disabledSliderBar, setDisabledSliderBar] = useState(moduleEnableMappingValue ? !module.on : false);
  const [selectedToggleSwitch, setSelectedToggleSwitch] = useState(module.on);

  const debounceOnModuleChange = useRef(
    debounce((updatedModule: Module, selection: boolean) => {
      onModuleChange(updatedModule, selection);
    }, 0),
  ).current;
  // Handle Toggle Switch change
  const onToggle = (on: boolean) => {
    setSelectedToggleSwitch(on);
    setDisabledSliderBar(!on);
    const updatedModule = { ...module, on };
    onModuleChange(updatedModule, moduleEnableSelection);
  };
  const CustomThumbNew = () => (
    <View style={componentThumbNewStyles.container}></View>
  );
  // Handle RadioButton change
  const handleRadioChange = (selection: boolean) => {
    console.log('Radio button selected:', selection);
    setModuleEnableSelection(selection);
    console.log('Radio button selected:', selection);
    const updatedModule = {
      ...module,
      on: selectedToggleSwitch,
      brightness: selectedBrightness,
    };
    debounceOnModuleChange(updatedModule, selection);
  };

  // Handle Slider value change
  const handleBrightnessChange = (value: number) => {
    setSelectedBrightness(Number.parseInt(value + ''));
    const updatedModule = { ...module, brightness: value };
    debounceOnModuleChange(updatedModule);
  };

  return (
    <View
      className={'w-full flex flex-col px-4 py-6 border-b border-line-light'}
      style={{ gap: 12 }}>
      <View>

        <View
          className="flex flex-row justify-between items-center"
          style={{ gap: 8 }}>
          <View className="flex flex-row items-center">
            <RadioButton
              moduleEnableSelection={moduleEnableSelection}
              onRadioChange={handleRadioChange}
            />
            <Text weight="medium" size="B1">
              {module.name}
            </Text>
          </View>
          {
            moduleEnableSelection
              ? <ToggleSwitch
                initialValue={selectedToggleSwitch}
                onToggle={onToggle}
                moduleId={module.id}
                homeId={null}
                bridge={module.bridge}
                brightness={module.brightness}
                type={module.type}
              />
              : null
          }
        </View>

        {
          moduleEnableSelection
            ? <View className="flex-col w-full" >
              <View className="flex-row items-center justify-between mb-1.5">
                <Icon
                  type={'scMoonIcon'}
                  width={12}
                  height={12}
                  color={'#292929'}
                />
                <Icon type={'scSunIcon'} width={16} height={16} color={'#292929'} />
              </View>

              <Slider
                value={selectedToggleSwitch ? moduleEnableMappingValue ? selectedBrightness : 0 : 0}
                onSlidingComplete={values => handleBrightnessChange(values[0])}
                minimumValue={MIN_BRIGHTNESS}
                maximumValue={MAX_BRIGHTNESS}
                trackStyle={customStylesNew.track}
                minimumTrackTintColor={'#014541'}
                disabled={disabledSliderBar}
                roomId={module.room_id}
                homeId={null}
                bridge={module.bridge}
                moduleId={module.id}
                trackClickable={true}
                renderThumbComponent={CustomThumbNew}
                step={0.5}
              />
            </View>
            : null
        }

      </View>
    </View>
  );
};

const customStylesNew = StyleSheet.create({
  track: {
    borderRadius: 50,
    backgroundColor: '#E4E4E4',
    height: 21,
  },
});
const componentThumbNewStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#00000015',
    height: 0,
    justifyContent: 'center',
    width: 0,
  },
});
export default BNLDModule;
