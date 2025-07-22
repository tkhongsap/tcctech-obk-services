import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Slider} from '@miblanchard/react-native-slider';

type StatusSliderProps = {
  initialValue?: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  displayMinimumTrackTintColor?: string;
  breakTrackAtValue?: number;
  onValueChange?: (value: number) => void;
  trackClickable?: boolean;
};

const StatusSliderMin: React.FC<StatusSliderProps> = ({
  initialValue = 0,
  onValueChange = () => {},
  minimumValue = 0,
  maximumValue = 1,
  step = 0.5,
  displayMinimumTrackTintColor = '#842525',
  breakTrackAtValue = 0,
  trackClickable = false,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleOnValueChange = (value: number) => {
    setValue(value);
    onValueChange(value);
  };

  return (
    <Slider
      value={initialValue}
      containerStyle={{height: 10}}
      step={step}
      onValueChange={values => handleOnValueChange(values[0])}
      trackStyle={styles.track}
      thumbStyle={value <= breakTrackAtValue ? styles.min : styles.thumb}
      minimumTrackTintColor={
        value <= breakTrackAtValue ? displayMinimumTrackTintColor : '#014541'
      }
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      trackClickable={trackClickable}
    />
  );
};

export default StatusSliderMin;

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#d0d0d0',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  min: {
    height: 10,
    borderRadius: 4,
    width: 16,
    backgroundColor: '#842525',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  thumb: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
});
