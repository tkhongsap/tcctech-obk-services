import module from '@react-native-firebase/app';
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Switch} from 'react-native-switch';
import NetatmoService from '~/services/residentialService/NetatmoService';
import t from '~/utils/text';

interface ToggleSwitchProps {
  initialValue?: boolean;
  barLength?: number;
  onToggle?: (value: boolean) => void;
  disabled?: boolean;
  moduleId?: string;
  loadingState?: boolean;
  brightness?: number;
  homeId?: string | null;
  bridge?: string;
  type?: string;
  temperature?: number;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  moduleId = null,
  initialValue = false,
  barLength = 55,
  onToggle = () => {},
  disabled = false,
  loadingState = false,
  brightness = 0,
  homeId = '',
  bridge = '',
  type = '',
  temperature = 0,
}) => {
  const [isLoading, setIsLoading] = useState(false); // Supports requesting api indicator
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const onValueChange = (value: boolean) => {
    //--> Render callback
    setIsEnabled(value);
    onToggle(value);
    //--> Toggle device's stage
    API_ToggleState(value);
  };

  /** API methods */
  const API_ToggleState = async (on: boolean) => {
    if (!homeId) return;
    if (isLoading && loadingState) return;
    setIsLoading(true);

    if (type == 'BNLD' || type == 'BNIL') {
      await NetatmoService.setStateModulesDevice('set light', [
        {
          id: moduleId,
          bridge: bridge,
          on: on,
        },
      ]);
    } else {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (!isEnabled) {
        await NetatmoService.setStateRoomsDevice('set manual temp', [
          {
            id: moduleId,
            therm_setpoint_mode: 'manual',
            therm_setpoint_temperature: temperature,
          },
        ]);
      } else {
        await NetatmoService.setStateRoomsDevice('set frostguard', [
          {
            id: moduleId,
            therm_setpoint_end_time: currentTimestamp,
            therm_setpoint_mode: 'hg',
          },
        ]);
      }
    }
    setIsLoading(false);
  };

  return (
    // <TouchableOpacity
    //   style={styles.container}
    //   onPress={() => onValueChange(!isEnabled)}>
      <Switch
        value={isEnabled}
        onValueChange={onValueChange}
        disabled={disabled}
        activeText={t('Residential__Home_Automation__On', 'ON')}
        inActiveText={t('Residential__Home_Automation__Off', 'OFF')}
        circleSize={20}
        barHeight={25}
        // circleBorderWidth={3}
        backgroundActive={'#014541'}
        backgroundInactive={'#767577'}
        circleActiveColor={'#FFFFFF'}
        circleInActiveColor={'#f4f3f4'}
        changeValueImmediately={true}
        innerCircleStyle={{alignItems: 'center', justifyContent: 'center'}}
        renderActiveText={true}
        renderInActiveText={true}
        switchLeftPx={4}
        switchRightPx={5}
        switchWidthMultiplier={barLength / 20}
        switchBorderRadius={30}
        activeTextStyle={{fontFamily: 'OneBangkok-Medium', fontSize: 10}}
        inactiveTextStyle={{fontFamily: 'OneBangkok-Medium', fontSize: 10}}
      />
    // </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

export default ToggleSwitch;
