import {View} from 'react-native';
import React, {useState} from 'react';
import FanSpeedBar from './FanSpeedBar';
import {Icon, Text} from '~/components/atoms';
import ToggleSwitch from './ToggleSwitch';
import StatusSliderTrackMark from './StatusSliderTrackMark';
import RadioButton from './RadioButton';
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

const speeds = ['0', '1', '2', '3'];
const MAX_TEMPERATURE = 40;
const MIN_TEMPERATURE = 3;

type BNTHModuleProps = {
  homeId: string;
  module: Module;
  moduleEnableSelection: boolean;
  setModuleEnableSelection: (value: boolean) => void;
  onModuleChange: (updatedModule: Module, isSelected: boolean) => void;
};

const BNTHModule: React.FC<BNILModuleProps> = ({
  homeId,
  module,
  moduleEnableSelection,
  setModuleEnableSelection,
  onModuleChange,
}) => {
  // Ensure fan_mode has a fallback value
  const [selectedSpeed, setSelectedSpeed] = useState<string>(() => {
    if (module.fan_mode === 'auto') {
      return '0';
    } else if (module.fan_speed > 0) {
      return module.fan_speed.toString();
    } else {
      return '0';
    }
  });

  const [selectedTemperature, setSelectedTemperature] = useState<number>(20); // Initialize with a default value
  const [disabled, setDisabled] = useState<boolean>(!module.on);
  const [selectedToggleSwitch, setSelectedToggleSwitch] = useState<boolean>(
    module.on,
  );

  const onToggle = (on: boolean) => {
    setSelectedToggleSwitch(on);
    setDisabled(!on);
  };
  const handleRadioChange = (selection: boolean) => {
    setModuleEnableSelection(selection);
    console.log('Radio button selected:', selection);
    const updatedModule = {...module, on: selectedToggleSwitch};
    onModuleChange(updatedModule, selection);
  };
  const onChangTrack = (value: number) => {
    setSelectedTemperature(value);
  };
  const handleFanSpeed = (value: string) => {
    setSelectedSpeed(value);
    const updatedModule = {
      ...module,
      fan_speed: value,
      fan_mode: parseInt(value) > 0 ? 'manual' : 'auto',
    };
    onModuleChange(updatedModule, moduleEnableSelection);
  };
  return (
    <View className="w-full flex flex-col px-4 py-6 border-b border-line-light">
      <View>
        <View
          className="flex flex-row justify-between items-center"
          style={{gap: 8}}>
          <View className="flex flex-row items-center">
            <RadioButton
              moduleEnableSelection={moduleEnableSelection}
              onRadioChange={handleRadioChange}
            />
            <Icon
              type={'aqTempIcon'}
              width={14}
              height={18}
              color={'#292929'}
            />
            <Text weight="medium" size="B1">
              {module.name}
            </Text>
          </View>
          <ToggleSwitch
            initialValue={selectedToggleSwitch}
            onToggle={onToggle}
            moduleId={module.room_id}
            homeId={null}
            bridge={module.bridge}
            brightness={0}
            type={module.type}
          />
        </View>

        <View className="w-full flex-col">
          <View className="flex-row justify-between">
            <Text size="C1" weight="regular">
              {MIN_TEMPERATURE} °C
            </Text>
            <Text size="C1" weight="bold">
              {selectedTemperature} °C
            </Text>
            <Text size="C1" weight="regular">
              {MAX_TEMPERATURE} °C
            </Text>
          </View>
          <StatusSliderTrackMark
            step={0.5}
            initialValue={selectedToggleSwitch ? selectedTemperature : 0}
            onValueChange={onChangTrack}
            minimumValue={MIN_TEMPERATURE}
            maximumValue={MAX_TEMPERATURE}
            disabled={disabled}
            trackMarkStep={3}
            roomId={module.room_id}
            homeId={null}
          />
        </View>
      </View>

      <View
        className="flex flex-row justify-between items-center"
        style={{gap: 8}}>
        <View className="flex flex-row items-center" style={{gap: 8}}>
          <Icon type={'scFanIcon'} width={18} height={18} color={'#292929'} />
          <Text weight="medium" size="B1">
            {module.name}
          </Text>
        </View>
      </View>

      <View className="flex flex-row items-center justify-between ">
        <FanSpeedBar
          speeds={speeds}
          selectedSpeed={disabled ? null : selectedSpeed}
          onSpeedPress={handleFanSpeed}
          disabled={disabled}
          moduleId={module.id}
          bridge={module.bridge}
          homeId={null} // Assuming room_id is homeId
        />
      </View>
    </View>
  );
};

export default BNTHModule;
