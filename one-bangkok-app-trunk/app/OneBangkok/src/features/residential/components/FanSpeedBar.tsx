import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Text} from '~/components/atoms';
import NetatmoService from '~/services/residentialService/NetatmoService';

interface FanSpeedBarProps {
  speeds: string[];
  selectedSpeed: string | null;
  disabled?: boolean;
  moduleId?: string;
  loadingState?: boolean;
  bridge?: string;
  homeId?: string | null;
  onSpeedPress: (speed: string) => void;
}

const FanSpeedBar: React.FC<FanSpeedBarProps> = ({
  moduleId,
  speeds,
  selectedSpeed,
  onSpeedPress,
  disabled = false,
  loadingState = false,
  bridge,
  homeId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const onValueChange = async (speed: string) => {
    //--> Render callback
    onSpeedPress(speed);

    //--> Set fan speed
    API_SetFanSpeed(speed);
  };

  /** API methods */
  const API_SetFanSpeed = async (speed: string) => {
    if (!homeId) return;
    if (isLoading && loadingState) return;
    setIsLoading(true);
    await NetatmoService.setStateModulesDevice('set air fan', [
      {
        id: moduleId,
        bridge: bridge,
        fan_speed: parseInt(speed),
        fan_mode: speed === '0' ? 'auto' : 'manual',
      },
    ]);
    setIsLoading(false);
  };

  return (
    <View style={styles.progressContainer}>
      {speeds.map((speed, index) => (
        <Pressable
          key={index}
          style={[
            styles.progressSection,
            selectedSpeed === speed && !disabled
              ? styles.completed
              : styles.incomplete,
          ]}
          disabled={disabled}
          onPress={() => onValueChange(speed)}>
          <Text
            style={[
              styles.sectionText,
              selectedSpeed === speed && !disabled
                ? styles.textCompleted
                : styles.incomplete,
            ]}>
            {speed === '0' ? 'Auto' : speed}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 50,
    overflow: 'hidden',
  },
  progressSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 29,
  },
  completed: {
    backgroundColor: '#004d44',
  },
  incomplete: {
    backgroundColor: '#E4E4E4',
  },
  sectionText: {
    color: '#292929',
    fontSize: 12,
    fontWeight: '500',
  },
  textCompleted: {
    color: '#FFFFFF',
  },
});

export default FanSpeedBar;
