import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ToggleSwitch from './ToggleSwitch';
import {Icon, Text} from '~/components/atoms';
import StatusSlider from './StatusSlider';

type Props = {
  homeId: string;
  brightness: number;
  id: string;
  name: string;
  on: boolean;
  roomId: string;
  bridge: string;
  type: string;
};
const MAX_BRIGHTNESS = 100;
const MIN_BRIGHTNESS = 0;

const LightDimmer = ({
  homeId,
  id,
  name,
  brightness,
  on,
  roomId,
  bridge,
  type,
}: Props) => {
  const [selectedBrightness, setSelectedBrightness] = useState(brightness);
  const [disabledSliderBar, setDisabledSliderBar] = useState(!on);
  const [selectedToggleSwitch, setSelectedToggleSwitch] = useState(on);

  const onToggle = (on: boolean) => {
    setSelectedToggleSwitch(on);
    setDisabledSliderBar(!on);
  };

  return (
    <View
      className={'w-full flex flex-col px-4 py-4 border-b border-line-light'}
      style={{gap: 8}}>
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
          bridge={bridge}
          type={type}
          brightness={brightness}
        />
      </View>
      {type == 'BNLD' && (
        <View className="flex-col items-center" style={{gap: -8}}>
          <View className="w-full flex-row items-center justify-between">
            <Icon
              type={'scMoonIcon'}
              width={12}
              height={12}
              color={'#292929'}
            />
            <Icon type={'scSunIcon'} width={16} height={16} color={'#292929'} />
          </View>

          <View className="w-full">
            <StatusSlider
              step={0}
              initialValue={selectedToggleSwitch ? selectedBrightness : 0}
              onValueChange={setSelectedBrightness}
              minimumValue={MIN_BRIGHTNESS}
              maximumValue={MAX_BRIGHTNESS}
              disabled={disabledSliderBar}
              roomId={roomId}
              homeId={homeId}
              bridge={bridge}
              moduleId={id}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default LightDimmer;
