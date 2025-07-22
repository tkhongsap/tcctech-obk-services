import {View} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import StatusSliderTrackMark from './StatusSliderTrackMark';
import FanSpeedBar from './FanSpeedBar';

export const MAX_TEMPERATURE = 40;
export const MIN_TEMPERATURE = 16;

type Props = {
  roomName: string;
  deviceName: string;
  isOn: boolean;
  temperature: number;
  fanSpeed: string;
  onChangeFanSpeed: (fanSpeed: string) => void;
  onToggle: (isOn: boolean) => void;
  onChangeTemperature: (temperature: number) => void;
  disabled: boolean;
  isHaveBorderLine: boolean;
};

const CustomTemperatureMode = ({
  roomName,
  deviceName,
  isOn,
  temperature,
  onToggle,
  onChangeTemperature,
  disabled,
  isHaveBorderLine,
  fanSpeed,
  onChangeFanSpeed,
}: Props) => {
  const fanSpeeds = ['0', '1', '2', '3'];

  return (
    <View>
      <View
        className={`room py-2 ${
          isHaveBorderLine && 'border-b border-line-light'
        }`}
        style={{gap: 8}}>
        <Text size="B1" weight="medium" color="default">
          {roomName}
        </Text>
        <View className="flex flex-col" style={{gap: 8}}>
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row items-center space-x-2">
              <Icon
                type={'aqTempIcon'}
                width={14}
                height={18}
                color={'#292929'}
              />
              <Text weight="medium" size="B1">
                {deviceName}
              </Text>
            </View>

            <View className="flex flex-row items-center" style={{gap: 16}}>
              {isOn && (
                <Text size="C1" weight="regular">
                  {temperature} °C
                </Text>
              )}
              <ToggleSwitch
                initialValue={isOn}
                onToggle={onToggle}
                moduleId={''}
                homeId={null}
                bridge={''}
                brightness={0}
                disabled={disabled}
              />
            </View>
          </View>
          {isOn && (
            <>
              <StatusSliderTrackMark
                step={0.5}
                initialValue={temperature}
                onValueChange={onChangeTemperature}
                minimumValue={MIN_TEMPERATURE}
                maximumValue={MAX_TEMPERATURE}
                disabled={!isOn || disabled}
                trackMarkStep={3}
                roomId={''}
                homeId={null}
              />
              <View
                className="flex flex-row justify-between items-center"
                style={{gap: 8}}>
                <View className="flex flex-row items-center" style={{gap: 8}}>
                  <Icon
                    type={'scFanIcon'}
                    width={18}
                    height={18}
                    color={'#292929'}
                  />
                  <Text weight="medium" size="B1">
                    Fan Coil
                  </Text>
                </View>
              </View>
              <FanSpeedBar
                speeds={fanSpeeds}
                selectedSpeed={fanSpeed}
                onSpeedPress={speed => !disabled && onChangeFanSpeed(speed)}
                moduleId={''}
                bridge={''}
                homeId={null}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default CustomTemperatureMode;
