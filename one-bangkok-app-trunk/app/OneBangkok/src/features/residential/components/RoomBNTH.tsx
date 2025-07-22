import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import FanSpeedBar from './FanSpeedBar';
import {Icon, Text} from '~/components/atoms';
import ToggleSwitch from './ToggleSwitch';
import StatusSliderTrackMark from './StatusSliderTrackMark';
import t from '~/utils/text';

type Props = {
  homeId: string;
  id: string;
  name: string;
  on: boolean;
  fan_mode: string;
  fan_speed: number;
  roomId: string;
  bridge: string;
  temperature: number;
  type: string;
  cooler_status: boolean;
};
const speeds = ['0', '1', '2', '3'];
const MAX_TEMPERATURE = 40;
const MIN_TEMPERATURE = 3;

const RoomBNTH = ({
  homeId,
  id,
  name,
  on,
  fan_speed = 1,
  fan_mode,
  roomId,
  bridge,
  temperature,
  type,
  cooler_status,
}: Props) => {
  const [selectedSpeed, setSelectedSpeed] = useState<string>(
    fan_mode === 'auto' ? '0' : fan_speed.toString(),
  );
  const [selectedTemperature, setSelectedTemperature] = useState(temperature);
  const [disabled, setDisabled] = useState(on);
  const [selectedToggleSwitch, setSelectedToggleSwitch] =
    useState(cooler_status);

  useEffect(() => {});
  const onToggle = (on: boolean) => {
    setSelectedToggleSwitch(on);
    setDisabled(!on);
  };

  return (
    <>
      <View
        className="flex flex-row px-4 text-left w-full mt-10 mb-4"
        style={{gap: 12}}>
        <Text size="H3" weight="medium">
          {t('Residential__Home_Automation__Temperature', 'Temperature')}
        </Text>
      </View>
      <View
        className={'w-full flex flex-col px-4 py-3 border-b border-line-light'}
        style={{gap: 12}}>
        <View>
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row items-center" style={{gap: 8}}>
              <Icon
                type={'aqTempIcon'}
                width={14}
                height={18}
                color={'#292929'}
              />
              <Text weight="medium" size="B1">
                {name}
              </Text>
            </View>
            <View className="flex flex-row items-center" style={{gap: 16}}>
              {selectedToggleSwitch ? (
                <Text size="C1" weight="regular">
                  {selectedTemperature} °C
                </Text>
              ) : (
                <></>
              )}
              <ToggleSwitch
                initialValue={selectedToggleSwitch}
                onToggle={onToggle}
                moduleId={roomId}
                homeId={homeId}
                bridge={bridge}
                brightness={0}
                type={type}
                temperature={selectedTemperature}
              />
            </View>
          </View>
          <View className="flex-col items-center">
            {/* <View className="w-full flex-row items-center justify-between">
              <Text size="C1" weight="regular">
                {MIN_TEMPERATURE} °C
              </Text>
              <Text size="C1" weight="bold">
                {selectedTemperature} °C
              </Text>
              <Text size="C1" weight="regular">
                {MAX_TEMPERATURE} °C
              </Text>
            </View> */}
            <View className="w-full">
              <StatusSliderTrackMark
                step={0.5}
                initialValue={selectedToggleSwitch ? selectedTemperature : 0}
                onValueChange={setSelectedTemperature}
                minimumValue={MIN_TEMPERATURE}
                maximumValue={MAX_TEMPERATURE}
                disabled={disabled}
                trackMarkStep={3}
                roomId={roomId}
                homeId={homeId}
              />
            </View>
          </View>
        </View>

        <View
          className="flex flex-row justify-between items-center"
          style={{gap: 8}}>
          <View className="flex flex-row items-center" style={{gap: 8}}>
            <Icon type={'scFanIcon'} width={18} height={18} color={'#292929'} />
            <Text weight="medium" size="B1">
              Fan Coil
            </Text>
          </View>
        </View>

        <View className="flex flex-row items-center justify-between ">
          <FanSpeedBar
            speeds={speeds}
            selectedSpeed={selectedSpeed}
            onSpeedPress={setSelectedSpeed}
            disabled={!selectedToggleSwitch}
            moduleId={id}
            bridge={bridge}
            homeId={homeId}
          />
        </View>
      </View>
    </>
  );
};

export default RoomBNTH;
