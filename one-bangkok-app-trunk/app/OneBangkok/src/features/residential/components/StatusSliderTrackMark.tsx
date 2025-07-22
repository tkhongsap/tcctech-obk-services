import React, {useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import netatmoService from '~/services/residentialService/NetatmoService';

type Props = {
  homeId: string | null;
  initialValue?: number;
  onValueChange?: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  minimumTrackTintColor?: string;
  disabled?: boolean;
  trackMarkStep?: number;
  roomId?: string;
};
const DEFAULT_VALUE = 0.2;

const StatusSliderTrackMark = ({
  homeId,
  initialValue = 0,
  onValueChange = (value: number) => {},
  minimumValue = 0,
  maximumValue = 1,
  step = 0,
  minimumTrackTintColor = '#014541',
  disabled = false,
  trackMarkStep = 0.5,
  roomId,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Generates an array of track mark values within a specified range.
   *
   * The function calculates and returns an array of track mark values spaced evenly between `minimumValue` and `maximumValue`.
   * The distance between consecutive track marks is determined by `trackMarkStep`. The resulting array excludes the endpoints
   * of the range but includes values at regular intervals according to the specified step size.
   *
   * The length of the array is computed based on the difference between `maximumValue` and `minimumValue` divided by
   * `trackMarkStep`, minus one (to exclude the endpoint values from the array). The track marks start from `minimumValue`
   * and increment by `trackMarkStep` for each subsequent value.
   *
   * The `useMemo` hook ensures that the array of track marks is only recalculated when `maximumValue`, `minimumValue`, or
   * `trackMarkStep` changes.
   *
   * @returns {number[]} An array of track mark values.
   */
  const trackMarks = useMemo(() => {
    return [
      ...Array(
        Math.round((maximumValue - minimumValue) / trackMarkStep) - 1,
      ).keys(),
    ].map(i => minimumValue + trackMarkStep * (i + 1));
  }, [maximumValue, minimumValue, trackMarkStep]);

  /** Listener methods */
  const onSlidingComplete = async (value: number) => {
    console.log('homeId', homeId);
    console.log('roomId', roomId);
    await API_setStateRoomsDevice(value);
  };

  /** API methods */
  const API_setStateRoomsDevice = async (value: number) => {
    if (!homeId) return;
    if (isLoading) return;
    setIsLoading(true);
    await netatmoService.setStateRoomsDevice('set manual temp', [
      {
        id: roomId,
        therm_setpoint_mode: 'manual',
        therm_setpoint_temperature: value,
      },
    ]);
    setIsLoading(false);
  };

  return (
    <SliderContainer
      sliderValue={[initialValue]}
      trackMarks={trackMarks}
      onValueChange={onValueChange}>
      <Slider
        value={initialValue}
        maximumValue={maximumValue}
        minimumValue={minimumValue}
        step={step}
        // maximumTrackTintColor="#014541"
        minimumTrackTintColor={minimumTrackTintColor}
        trackStyle={customStylesNew.track}
        renderThumbComponent={CustomThumbNew}
        disabled={disabled}
        trackClickable={true}
        onSlidingComplete={values => onSlidingComplete(values[0])}
      />
    </SliderContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    margin: 16,
    paddingBottom: 32,
  },
  sliderContainer: {
    // paddingVertical: 2,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  vertical: {},
});

export default StatusSliderTrackMark;

const CustomThumbNew = () => (
  <View style={componentThumbNewStyles.container}></View>
);

const SliderContainer = (props: {
  children: React.ReactElement;
  sliderValue?: Array<number>;
  trackMarks?: Array<number>;
  vertical?: boolean;
  onValueChange?: (value: number) => void;
}) => {
  const {sliderValue, trackMarks, onValueChange} = props;
  const [value, setValue] = React.useState(sliderValue ?? DEFAULT_VALUE);
  let renderTrackMarkComponent: React.ReactNode;

  useMemo(() => {
    setValue(sliderValue ?? DEFAULT_VALUE);
  }, [sliderValue]);

  if (trackMarks?.length && (!Array.isArray(value) || value?.length === 1)) {
    renderTrackMarkComponent = (index: number) => {
      const currentMarkValue = trackMarks[index];
      const currentSliderValue =
        value || (Array.isArray(value) && value[0]) || 0;
      const style =
        currentMarkValue > Math.max(currentSliderValue)
          ? trackMarkStyles.activeMark
          : trackMarkStyles.inactiveMark;
      return <View style={style} />;
    };
  }

  const _onValueChange = (values: number[]) => {
    onValueChange && onValueChange(values[0]);
    setValue(values);
  };

  const renderChildren = () => {
    return React.Children.map(props.children, (child: React.ReactElement) => {
      if (!!child && child.type === Slider) {
        return React.cloneElement(child, {
          onValueChange: _onValueChange,
          renderTrackMarkComponent,
          trackMarks,
          value,
        });
      }
      return child;
    });
  };

  return (
    <View style={styles.sliderContainer}>
      {/* <View style={styles.titleContainer}>
        <Text>{Array.isArray(value) ? value.join(' - ') : value}</Text>
      </View> */}
      {renderChildren()}
    </View>
  );
};

const componentThumbNewStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#00000015',
    height: 0,
    justifyContent: 'center',
    width: 0,
  },
});
const customStylesNew = StyleSheet.create({
  track: {
    borderRadius: 50,
    backgroundColor: '#E4E4E4',
    height: 21,
  },
});
const trackMarkStyles = StyleSheet.create({
  activeMark: {
    borderColor: '#00000010',
    borderWidth: 1,
    height: 12,
  },
  inactiveMark: {
    borderColor: '#00000010',
    borderWidth: 1,
    height: 12,
  },
});
