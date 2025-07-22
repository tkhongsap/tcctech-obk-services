import {StyleSheet,View} from 'react-native';
import React, {useState} from 'react';
import {Slider} from '@miblanchard/react-native-slider';
import NetatmoService from '~/services/residentialService/NetatmoService';

type StatusSliderProps = {
  initialValue?: number;
  onValueChange?: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  minimumTrackTintColor?: string;
  disabled?: boolean;
  trackClickable?: boolean;

  roomId?: string;
  homeId?: string | null;
  bridge?: string;
  moduleId?: string;
};

const StatusSlider: React.FC<StatusSliderProps> = ({
  initialValue = 0,
  onValueChange = () => {},
  minimumValue = 0,
  maximumValue = 1,
  step = 0.5,
  minimumTrackTintColor = '#014541',
  disabled = false,
  trackClickable = true,

  roomId = null,
  homeId = '',
  bridge = '',
  moduleId = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  /** Listener methods */
  const onSlidingComplete = async (value: number) => {
    await API_setStateRoomsDevice(Math.floor(value));
  };

  /** API methods */
  const API_setStateRoomsDevice = async (value: number) => {
    if (!homeId) return;
    if (isLoading) return;
    setIsLoading(true);
    await NetatmoService.setStateModulesDevice('set brightness', [
      {
        id: moduleId,
        bridge: bridge,
        on: true,
        brightness: value,
      },
    ]);

    setIsLoading(false);
  };
  const CustomThumbNew = () => (
    <View style={componentThumbNewStyles.container}></View>
  );
  return (
    <Slider
      onValueChange={values => onValueChange(values[0])}
      onSlidingComplete={values => onSlidingComplete(values[0])}
      value={initialValue}
      step={step}
      trackStyle={customStylesNew.track}
      minimumTrackTintColor={minimumTrackTintColor}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      disabled={disabled}
      trackClickable={trackClickable}
      renderThumbComponent={CustomThumbNew}
    />
  );
};

export default StatusSlider;
const customStylesNew = StyleSheet.create({
  track: {
    borderRadius: 50,
    backgroundColor: '#E4E4E4',
    height: 21,
  },
});
const componentThumbNewStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#00000015',
    height: 0,
    justifyContent: 'center',
    width: 0,
    
  },
});
const styles = StyleSheet.create({
  track: {
    height: 21,
    borderRadius: 50,
    backgroundColor: '#E4E4E4',
    // shadowColor: 'black',
    // shadowOffset: {width: 0, height: 1},
    // shadowRadius: 1,
    // shadowOpacity: 0.15,
  },
  // track: {
  //   height: 10,
  //   borderRadius: 4,
  //   backgroundColor: '#d0d0d0',
  //   shadowColor: 'black',
  //   shadowOffset: {width: 0, height: 1},
  //   shadowRadius: 1,
  //   shadowOpacity: 0.15,
  // },
  thumb: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    // position: 'absolute',
    // shadowOffset: {width: 0, height: 2},
    // shadowRadius: 2,
    // shadowOpacity: 0.35,
  },
});
