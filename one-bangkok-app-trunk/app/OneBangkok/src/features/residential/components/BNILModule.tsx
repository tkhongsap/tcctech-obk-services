import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ToggleSwitch from './ToggleSwitch';
import {Icon, Text} from '~/components/atoms';
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

type BNILModuleProps = {
  homeId: string;
  module: Module;
  moduleEnableSelection: boolean;
  setModuleEnableSelection: (value: boolean) => void;
  onModuleChange: (updatedModule: Module, isSelected: boolean) => void;
};
const BNILModule: React.FC<BNILModuleProps> = ({
  homeId,
  module,
  moduleEnableSelection,
  setModuleEnableSelection,
  onModuleChange,
}) => {
  const [selectedToggleSwitch, setSelectedToggleSwitch] = useState(module.on);
  const onToggle = (on: boolean) => {
    setSelectedToggleSwitch(on);
    const updatedModule = {...module, on};
    onModuleChange(updatedModule, moduleEnableSelection);
  };

  useEffect(() => {
    setSelectedToggleSwitch(module.on);
  }, [module.on]);

  const handleRadioChange = (selection: boolean) => {
    setModuleEnableSelection(selection);
    console.log('Radio button selected:', selection);
    const updatedModule = {...module, on: selectedToggleSwitch};
    onModuleChange(updatedModule, selection);
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
            moduleEnableSelection={moduleEnableSelection}
            onRadioChange={handleRadioChange}
          />
          {/* <Icon type={'scLightIcon'} width={14} height={18} color={'#292929'} /> */}
          <Text weight="medium" size="B1">
            {module.name}
          </Text>
        </View>
        { moduleEnableSelection ?
          <ToggleSwitch
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
    </View>
  );
};

export default BNILModule;
