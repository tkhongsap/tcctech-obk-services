import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { disable } from 'react-native-bluetooth-state-manager';
import Config from 'react-native-config';
import { Icon, Text } from '~/components/atoms';
import NetatmoService from '~/services/residentialService/NetatmoService';

interface ControlStateProps {
  title?: string;
  disabled?: boolean;
  moduleId?: string;
  bridge?: string;
  loadingState?: boolean;
  asChild?: boolean;
  homeId?: string | null;

  initialValue?: number;
  hideControllers?: State[];
  onControlChange?: (value: State) => void;
}

export enum State {
  Close = 0,
  Middle = 50,
  Open = 100,
}

const Shutter: React.FC<ControlStateProps> = ({
  initialValue = 0,
  title,
  moduleId = null,
  bridge = null,
  disabled = false,
  asChild = false,
  loadingState = false,
  hideControllers = [],
  onControlChange = (state: State) => { },
  homeId,
}) => {
  const styleControllerButtons =
    'flex-row items-center ' + (asChild ? 'mt-[8px]' : 'mt-[16px]');
  const [isLoading, setIsLoading] = useState(false); // Supports requesting api indicator
  const [isPressed, setIsPressed] = useState<State | null>(null);
  const [controllersState, setControllersState] = useState({
    "0": true,
    "50": true,
    "100": true,
  })
  const _onControlChange = (value: State) => {
    //--> Render callback
    onControlChange(value);

    console.log('controlChange, ', {
      id: moduleId,
      bridge: bridge,
      target_position: value, // 0 (Open) | 50(Middle) | 100(Close)
    });

    //--> Toggle device's stage
    API_ControlState(value);
  };

  /** feature methods */
  const checkPressed = (value: State) => {
    return isPressed === value
  }

  /** API methods */
  const API_ControlState = async (value: State) => {
    if (!homeId) return;
    if (isLoading && loadingState) return;
    setIsLoading(true);

    await NetatmoService.setStateModulesDevice('set roller shutter', [
      {
        id: moduleId,
        bridge: bridge,
        target_position: value, // 0 (Open) | 50(Middle) | 100(Close)
      },
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    const tmp = {
      "0": true,
      "50": true,
      "100": true,
    }
    for (let a = 0; a < hideControllers.length; a++) {
      const hc = hideControllers[a];
      tmp[hc + ""] = false
    }
    setControllersState(tmp)
  }, [])
  return (
    <View className="w-full flex flex-col">
      {/* Set of controller buttons */}
      <View className={styleControllerButtons}>

        {
          controllersState['0']
            ? <TouchableWithoutFeedback
              disabled={disabled}
              onPressIn={() => setIsPressed(State.Open)}
              // onPressOut={() => setIsPressed(null)}
              onPress={() => _onControlChange(State.Open)}
              className={checkPressed(State.Open)
                ? "w-[45px] h-[45px] rounded-full flex items-center justify-center bg-dark-teal-dark mr-[44px]"
                : "w-[45px] h-[45px] rounded-full flex items-center justify-center bg-[#EFEFEF] mr-[44px]"
              }>
              <Icon
                type={isPressed === State.Open ? 'scArrowUpWhiteIcon' : 'scArrowUpIcon'}
                width={16}
                height={16}
                color={'#014541'}
              />
            </TouchableWithoutFeedback>
            : null
        }

        {
          controllersState['50']
            ? <TouchableWithoutFeedback
              disabled={disabled}
              onPressIn={() => setIsPressed(State.Middle)}
              // onPressOut={() => setIsPressed(null)}
              onPress={() => _onControlChange(State.Middle)}
              className={checkPressed(State.Middle)
                ? "w-[45px] h-[45px] rounded-full flex items-center justify-center bg-dark-teal-dark mr-[44px]"
                : "w-[45px] h-[45px] rounded-full flex items-center justify-center bg-[#EFEFEF] mr-[44px]"
              }>
              <Icon type={isPressed === State.Middle ? 'scStopWhiteIcon' : 'scStopIcon'} width={16} height={16} color={'#014541'} />
            </TouchableWithoutFeedback>
            : null
        }

        {
          controllersState['100']
            ? <TouchableWithoutFeedback
              disabled={disabled}
              onPressIn={() => setIsPressed(State.Close)}
              // onPressOut={() => setIsPressed(null)}
              onPress={() => _onControlChange(State.Close)}
              className={checkPressed(State.Close)
                ? "w-[45px] h-[45px] rounded-full flex items-center justify-center bg-dark-teal-dark"
                : "w-[45px] h-[45px] rounded-full flex items-center justify-center bg-[#EFEFEF]"
              }>
              <Icon
                type={isPressed === State.Close ? 'scArrowDownWhiteIcon' : 'scArrowDownIcon'}
                width={16}
                height={16}
                color={'#014541'}
              />
            </TouchableWithoutFeedback>

            : null
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

export default Shutter;
