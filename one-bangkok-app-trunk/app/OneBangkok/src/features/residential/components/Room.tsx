import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text } from '~/components/atoms';
import BNTHModule from './BNTHModule';
import BNLDModule from './BNLDModule';
import BNILModule from './BNILModule';
import BNASModule from './BNASModule';
import { Button } from '~/components/molecules';

type Props = {
  homeId: string;
  room: any;
  hideModuleTypes: string[],

  onModuleChanged: ({
    module,
    isSelected,
  }: {
    module: Module;
    isSelected: boolean;
  }) => void;
  moduleEnableSelection: boolean;
  moduleSelectAll: boolean;
};
export type Module = {
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
  brightness: number;
  current_position: null;
  target_position: null;
  target_positionstep: null;
  cooler_status: null;
  fan_speed: null;
  fan_mode: null;
  humidity: null;
};

const Room: React.FC<Props> = ({ homeId, room, onModuleChanged, hideModuleTypes = [] }) => {
  // Initialize state to manage moduleEnableSelection for each module
  const [moduleSelections, setModuleSelections] = useState<{
    [key: string]: boolean;
  }>(
    room.module.reduce((acc: { [key: string]: boolean }, module: Module) => {
      acc[module.id] = false; // Initially set all moduleEnableSelection to false
      return acc;
    }, {}),
  );

  // Handle the change in moduleEnableSelection for a specific module
  const handleModuleEnableSelectionChange = (
    moduleId: string,
    value: boolean,
  ) => {
    setModuleSelections(prev => ({
      ...prev,
      [moduleId]: value,
    }));
  };

  // Use effect to log the updated state
  useEffect(() => {
    // console.log('moduleSelections => ', moduleSelections);
  }, [moduleSelections]);

  // Handle module updates
  const handleModuleChange = (updatedModule: any, isSelected: boolean) => {
    // console.log('Module updated:', JSON.stringify(updatedModule, null, 2));
    // console.log('Module updated isSelected:', isSelected);
    onModuleChanged({ module: updatedModule, isSelected });
    // Additional logic, such as updating state or making an API call
  };

  // Render the module based on its type and pass the necessary props
  const renderModule = (m: Module) => {
    const hide = hideModuleTypes.filter(item => item === m.type).length > 0
    if (hide) return (<View />)

    switch (m.type) {
      case 'BNLD':
        return (
          <BNLDModule
            key={m.id}
            setModuleEnableValue={false}
            homeId={homeId}
            module={m}
            moduleEnableSelection={moduleSelections[m.id]}
            setModuleEnableSelection={(value: boolean) =>
              handleModuleEnableSelectionChange(m.id, value)
            }
            onModuleChange={handleModuleChange}
          />
        );
      case 'BNTH':
        return (
          <BNTHModule
            key={m.id}
            homeId={homeId}
            module={m}
            moduleEnableSelection={moduleSelections[m.id]}
            setModuleEnableSelection={(value: boolean) =>
              handleModuleEnableSelectionChange(m.id, value)
            }
            onModuleChange={handleModuleChange}
          />
        );
      case 'BNAS':
        return (
          <BNASModule
            key={m.id}
            homeId={homeId}
            module={m}
            asChild={false}
            moduleEnableSelection={moduleSelections[m.id]}
            setModuleEnableSelection={(value: boolean) =>
              handleModuleEnableSelectionChange(m.id, value)
            }
            onModuleChange={handleModuleChange}
          />
        );
      case 'BNIL':
        return (
          <BNILModule
            key={m.id}
            homeId={homeId}
            module={m}
            moduleEnableSelection={moduleSelections[m.id]}
            setModuleEnableSelection={(value: boolean) =>
              handleModuleEnableSelectionChange(m.id, value)
            }
            onModuleChange={handleModuleChange}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => { }, []);

  return (
    <View className="w-full flex flex-col" style={{marginBottom: 40}}>
      <Text size="N1" weight="medium" color="dark-gray" className="mb-1 px-4">
        {room.name}
      </Text>
      <View className="w-full flex flex-col">
        {room.module.map((module: Module) => renderModule(module))}
      </View>
    </View>
  );
};

export default Room;
