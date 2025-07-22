import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {disable} from 'react-native-bluetooth-state-manager';
import Config from 'react-native-config';
import {TouchableOpacity,TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Icon, Text} from '~/components/atoms';
import NetatmoService from '~/services/residentialService/NetatmoService';

interface ControlStateProps {
  title?: string;
  disabled?: boolean;
  moduleId?: string;
  bridge?: string;
  loadingState?: boolean;
  asChild?: boolean;
  homeId?: string;

  initialValue?: number;
  onControlChange?: (value: State) => void;
}

enum State {
  Close = 0,
  Middle = 50,
  Open = 100,
}

const ShutterController: React.FC<ControlStateProps> = ({
  initialValue = 0,
  title,
  moduleId = null,
  bridge = null,
  disabled = false,
  asChild = false,
  loadingState = false,
  onControlChange = (state: State) => {},
  homeId,
}) => {
  const styleControllerButtons =
    'flex-row items-center ' + (asChild ? 'mt-[16px]' : 'mt-[16px]');
  const [isLoading, setIsLoading] = useState(false); // Supports requesting api indicator
  const [isPressed, setIsPressed] = useState<State | null>(null);
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

  /** API methods */
  const API_ControlState = async (value: State) => {
    if (!moduleId) return;
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

  /** View methods */
  const View_Self = () => {
    return (
      <View className="flex flex-row items-center">
        <View className="flex flex-row items-center  mt-[16px] mr-auto">
          <Icon
            type="scShutterDeviceIcon"
            width={18}
            height={18}
            color="#292929"
          />
          <Text
            size="B2"
            weight="medium"
            color="dark-gray"
            className="ml-[8px]">
            {title}
          </Text>
        </View>
      </View>
    );
  };
  const View_Child = () => {
    return (
      <View
        className="flex flex-row justify-between items-center"
        style={{gap: 8}}>
        <View className="flex flex-row items-center">
          <Icon
            type={'scWindowIcon'}
            width={14}
            height={18}
            color={'#292929'}
          />
          <Text weight="medium" size="B1">
            {title}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="w-full flex flex-col py-[12px]">
      {/* Title diversity */}
      {asChild ? View_Child() : View_Self()}

      {/* Set of controller buttons */}
      <View className={styleControllerButtons}>
        <TouchableWithoutFeedback
          disabled={disabled}
          onPressIn={() => setIsPressed(State.Open)} 
          onPressOut={() => setIsPressed(null)} 
          onPress={() => _onControlChange(State.Open)}
          className="w-[45px] h-[45px] rounded-full mr-[44px] flex items-center justify-center bg-[#EFEFEF] active:bg-dark-teal-dark">
          <Icon
            type={isPressed === State.Open ? 'scArrowUpWhiteIcon' : 'scArrowUpIcon'}
            width={16}
            height={16}
            color={'#014541'}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          disabled={disabled}
          onPressIn={() => setIsPressed(State.Middle)}
          onPressOut={() => setIsPressed(null)}
          onPress={() => _onControlChange(State.Middle)}
          className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-[#EFEFEF] mr-[44px] active:bg-dark-teal-dark">
          <Icon type={isPressed === State.Middle ? 'scStopWhiteIcon' : 'scStopIcon'} width={16} height={16} color={'#014541'} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          disabled={disabled}
          onPressIn={() => setIsPressed(State.Close)}
          onPressOut={() => setIsPressed(null)}
          onPress={() => _onControlChange(State.Close)}
          className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-[#EFEFEF] active:bg-dark-teal-dark">
          <Icon
            type={isPressed === State.Close ? 'scArrowDownWhiteIcon' : 'scArrowDownIcon'}
            width={16}
            height={16}
            color={'#014541'}
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

export default ShutterController;
