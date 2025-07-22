import { View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Icon, Text } from '~/components/atoms';
import Shutter, { State } from './Shutter';
import RadioButton from './RadioButton';
import { values } from 'lodash';
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

type BNASModuleProps = {
  homeId: string;
  module: Module;
  moduleEnableSelection: boolean;
  asChild: boolean;
  setModuleEnableSelection: (value: boolean) => void;
  onModuleChange: (updatedModule: Module, isSelected: boolean) => void;
};
const BNASModule: React.FC<BNASModuleProps> = ({
  homeId,
  module,
  moduleEnableSelection,
  asChild,
  setModuleEnableSelection,
  onModuleChange,
}) => {
  const [selectedPosition, setSelectedPosition] = useState(
    module.current_position,
  );
  const handleRadioChange = (selection: boolean) => {
    setModuleEnableSelection(selection);
    const updatedModule = {
      ...module,
      target_position: selectedPosition,
    };
    onModuleChange(updatedModule, selection);
  };
  return (
    <View
      className="w-full flex flex-col border-b border-line-light p-4"
      key={module.id}
      style={{}}>
      <View className="flex flex-row items-center">
        <View className="flex flex-row items-center">
          <RadioButton
            moduleEnableSelection={moduleEnableSelection}
            onRadioChange={handleRadioChange}
          />
          {/* <Icon
            type="scShutterDeviceIcon"
            width={18}
            height={18}
            color="#292929"
          /> */}
          <Text
            size="B1"
            weight="medium"
            color="dark-gray"
           >
            {module.name}
          </Text>
        </View>
      </View>

      {
        moduleEnableSelection
          ? <Shutter
            title={module.name}
            asChild={asChild}
            loadingState={true}
            hideControllers={[State['Middle']]}
            onControlChange={value => {
              console.log('State Value, ' + value);
              setSelectedPosition(value);
            }}
            moduleId={module.id}
            homeId={null}
            bridge={module.bridge}
          />
          : null
      }

    </View>
  );
};

export default BNASModule;
