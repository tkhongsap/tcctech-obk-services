import {View} from 'react-native';
import React, {Fragment} from 'react';
import {Text} from '~/components/atoms';
import {
  Module,
  Room,
} from '~/states/residentialSchedule/residentialScheduleState';
import ActionScheduleModuleBNLD from './ActionScheduleModuleBNLD';
import ActionScheduleModuleBNAS from './ActionScheduleModuleBNAS';
import ActionScheduleModuleBNIL from './ActionScheduleModuleBNIL';

export type ActionScheduleRoomModule = Module & {selected: boolean};

export type ActionScheduleRoom = Omit<Room, 'module'> & {
  modules: ActionScheduleRoomModule[];
};

type Props = {
  rooms: ActionScheduleRoom[];
  disabled: boolean;
  onChanged: (room: ActionScheduleRoom) => void;
};
const ActionScheduleRooms = ({rooms, disabled, onChanged}: Props) => {
  const onModuleChanged = (
    roomId: string,
    module: ActionScheduleRoomModule,
  ) => {
    const room = rooms.find(e => e.id === roomId);
    if (!room) return;
    onChanged({
      ...room,
      modules: room.modules.map(prev =>
        prev.id === module.id ? module : prev,
      ),
    });
  };

  return (
    <View style={{display: 'flex'}}>
      {rooms.map(({id, name, modules}) => (
        <View
          key={id}
          className="w-full flex flex-col"
          style={{marginBottom: 40}}>
          <Text
            size="N1"
            weight="medium"
            color="dark-gray"
            className="mb-1 px-4">
            {name}
          </Text>
          <View className="w-full flex flex-col">
            {modules.map((module, index) => (
              <Fragment key={module.id}>
                {module.type === 'BNLD' && (
                  <ActionScheduleModuleBNLD
                    key={`BNLD_${index}_${module.id}`}
                    module={module}
                    disabled={disabled}
                    onChanged={changedModule =>
                      onModuleChanged(id, changedModule)
                    }
                  />
                )}

                {module.type === 'BNAS' && (
                  <ActionScheduleModuleBNAS
                    key={`BNAS_${index}_${module.id}`}
                    module={module}
                    disabled={disabled}
                    onChanged={changedModule =>
                      onModuleChanged(id, changedModule)
                    }
                  />
                )}

                {module.type === 'BNIL' && (
                  <ActionScheduleModuleBNIL
                    key={`BNIL_${index}_${module.id}`}
                    module={module}
                    disabled={disabled}
                    onChanged={changedModule =>
                      onModuleChanged(id, changedModule)
                    }
                  />
                )}
              </Fragment>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default ActionScheduleRooms;
