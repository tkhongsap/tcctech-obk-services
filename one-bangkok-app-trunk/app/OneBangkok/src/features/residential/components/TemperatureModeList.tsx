import {View, TouchableOpacity} from 'react-native';
import {Icon, IconType, Text} from '~/components/atoms';
import React from 'react';
import CustomTemperatureMode from '../components/CustomTemperatureMode';
import t from '~/utils/text';

export type TemperatureRoom = {
  roomId: string;
  roomName: string;
  deviceName: string;
  isOn: boolean;
  temperature: number;
  fanSpeed: string;
};

export type TemperatureMode = {
  id: number;
  name: 'Comfort' | 'Night' | 'Eco';
  icon: IconType;
  checked: boolean;
  rooms: TemperatureRoom[];
};

type Props = {
  temperatureMode: TemperatureMode;
  onValueChange: (mode: TemperatureMode) => void;
  onChecked: (id: number) => void;
  disabled: boolean;
};

const TemperatureModeList = ({
  temperatureMode,
  onValueChange,
  onChecked,
  disabled,
}: Props) => {
  const {id, name, icon, checked, rooms} = temperatureMode;

  const onToggle = (roomId: string, isOn: boolean) => {
    onValueChange({
      ...temperatureMode,
      rooms: rooms.map(room =>
        room.roomId === roomId ? {...room, isOn} : room,
      ),
    });
  };

  const onChangeTemperature = (roomId: string, temperature: number) => {
    onValueChange({
      ...temperatureMode,
      rooms: rooms.map(room =>
        room.roomId === roomId ? {...room, temperature} : room,
      ),
    });
  };

  const onPress = () => {
    !checked && onChecked(id);
  };

  const onChangeFanSpeed = (roomId: string, fanSpeed: string) => {
    onValueChange({
      ...temperatureMode,
      rooms: rooms.map(room =>
        room.roomId === roomId ? {...room, fanSpeed} : room,
      ),
    });
  };

  const mappingLanguageName = (key: 'Comfort' | 'Night' | 'Eco') => {
    switch (key) {
      case 'Comfort':
        return t('Residential__Home_Automation__Comfort', 'Comfort');
      case 'Eco':
        return t('Residential__Home_Automation__Eco', 'Eco');
      case 'Night':
        return t('Residential__Home_Automation__Night', 'Night');
      default:
        break;
    }
  };

  return (
    <View
      className={
        'min-h-[48px] flex flex-col px-4 py-3 border border-line-light'
      }
      style={{gap: 1}}>
      <View
        className="flex flex-row justify-between items-center"
        style={{gap: 8}}>
        <View className="flex-row items-center" style={{gap: 8}}>
          <TouchableOpacity onPress={onPress} disabled={disabled}>
            <Icon
              type={checked ? 'scRadioCheckedIcon' : 'scRadioIcon'}
              width={24}
              height={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <Icon type={icon} width={16} height={16} color="#ffffff00" />
          <Text weight="regular" size="B1">
            {mappingLanguageName(name)}
          </Text>
        </View>
      </View>
      {checked &&
        rooms.map((room, index) => (
          <CustomTemperatureMode
            key={room.roomId}
            roomName={room.roomName}
            deviceName={room.deviceName}
            isOn={room.isOn}
            temperature={room.temperature}
            onToggle={isOn => onToggle(room.roomId, isOn)}
            onChangeTemperature={temperature =>
              onChangeTemperature(room.roomId, temperature)
            }
            disabled={disabled}
            isHaveBorderLine={index < rooms.length - 1}
            fanSpeed={room.fanSpeed}
            onChangeFanSpeed={fanSpeed =>
              onChangeFanSpeed(room.roomId, fanSpeed)
            }
          />
        ))}
    </View>
  );
};

export default TemperatureModeList;
