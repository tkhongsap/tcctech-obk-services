import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ToggleSwitch from './ToggleSwitch';
import {Icon, Text} from '~/components/atoms';
import StatusSlider from './StatusSlider';

type Props = {
  homeId: string;
  id: string;
  name: string;
  on: boolean;
  bridge: string;
  brightness: number;
  type: string;
};
type light = {
  id: string;
  name: string;
  isActive: boolean;
  brightness: number;
  on: boolean;
  roomId: string;
  bridge: string;
  type: string;
};
const lights: light[] = [
  // {
  //   id: '001',
  //   name: 'Dimmer Lamp 1',
  //   isActive: false,
  //   brightness: 100,
  //   on: false,
  //   roomId: '',
  // },
  // {
  //   id: '002',
  //   name: 'Dimmer Lamp 2',
  //   isActive: false,
  //   brightness: 100,
  //   on: false,
  //   roomId: '',
  // },
  // {
  //   id: '003',
  //   name: 'Dimmer Lamp 3',
  //   isActive: false,
  //   brightness: 100,
  //   on: false,
  //   roomId: '',
  // },
];

const RoomBNIL = ({homeId, id, name, on, bridge, brightness, type}: Props) => {
  const [selectedToggleSwitch, setSelectedToggleSwitch] = useState(on);

  return (
    <>
      <View
        key={id}
        className={'w-full flex flex-col px-4 py-4 border-b border-line-light'}
        style={{gap: 4}}>
        <View
          className="flex flex-row justify-between items-center"
          style={{gap: 8}}>
          <View className="flex flex-row items-center">
            <Icon
              type={'scLightIcon'}
              width={14}
              height={18}
              color={'#292929'}
            />
            <Text weight="medium" size="B1">
              {name}
            </Text>
          </View>
          <ToggleSwitch
            initialValue={selectedToggleSwitch}
            onToggle={setSelectedToggleSwitch}
            moduleId={id}
            homeId={homeId}
            bridge={bridge}
            brightness={brightness}
            type={type}
          />
        </View>
      </View>
      {lights.length > 0 &&
        lights.map(({id, name, brightness, on, roomId, bridge}) => (
          <RoomBNILLIGHT
            key={id}
            id={id}
            name={name}
            brightness={brightness}
            on={selectedToggleSwitch}
            roomId={roomId}
            homeId={homeId}
            bridgeId={bridge}
          />
        ))}
    </>
  );
};

export default RoomBNIL;

type LIGHTProps = {
  id: string;
  name: string;
  on: boolean;
  brightness: number;
  roomId: string;
  homeId: string;
  bridgeId: string;
};
const MAX_BRIGHTNESS = 100;
const MIN_BRIGHTNESS = 0;

const RoomBNILLIGHT = ({
  id,
  name,
  on,
  brightness,
  roomId,
  homeId,
  bridgeId,
}: LIGHTProps) => {
  const [selectedBrightness, setSelectedBrightness] = useState(brightness);
  const [disabledSliderBar, setDisabledSliderBar] = useState(!on);
  const [selectedToggleSwitch, setSelectedToggleSwitch] = useState(on);

  const onToggle = (on: boolean) => {
    setSelectedToggleSwitch(on);
  };

  useEffect(() => {
    setSelectedToggleSwitch(on);
    setDisabledSliderBar(!on);
  }, [on]);

  return (
    <View
      key={id}
      className={'w-full flex flex-col px-4 py-4 border-b border-line-light'}
      style={{gap: 4}}>
      <View
        className="flex flex-row justify-between items-center"
        style={{gap: 8}}>
        <View className="flex flex-row items-center">
          <Icon type={'scLightIcon'} width={14} height={18} color={'#292929'} />
          <Text weight="medium" size="B1">
            {name}
          </Text>
        </View>
        <ToggleSwitch
          initialValue={selectedToggleSwitch}
          onToggle={onToggle}
          moduleId={id}
          homeId={homeId}
          bridge={bridgeId}
          brightness={brightness}
        />
      </View>
      <View className="flex-col items-center">
        <View className="w-full flex-row items-center justify-between">
          <Icon type={'scMoonIcon'} width={12} height={12} color={'#292929'} />
          <Icon type={'scSunIcon'} width={16} height={16} color={'#292929'} />
        </View>
        <View className="w-full ">
          <StatusSlider
            step={0}
            initialValue={selectedToggleSwitch ? selectedBrightness : 0}
            onValueChange={setSelectedBrightness}
            minimumValue={MIN_BRIGHTNESS}
            maximumValue={MAX_BRIGHTNESS}
            disabled={disabledSliderBar}
            roomId={roomId}
            homeId={homeId}
            bridge={bridgeId}
          />
        </View>
      </View>
    </View>
  );
};
