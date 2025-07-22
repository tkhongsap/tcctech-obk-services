import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Text} from '~/components/atoms';

interface DynamicStepContainersProps {
  totalSteps: number;
  currentStep: number;
  handleStepPress: (index: number) => void;
  disabled?: boolean
}

const getStepContainerWidth = (totalSteps: number) => {
  const screenWidth = Dimensions.get('window').width;
  const margin = 20;
  let width = (screenWidth - (totalSteps - 1) * margin) / totalSteps;

  if (totalSteps === 1) {
    width = screenWidth - margin * 2;
  } else if (totalSteps === 2) {
    width = width - margin;
  } else if (totalSteps === 3) {
    width = width - margin / 2;
  }
  return width;
};

const DynamicStepContainers: React.FC<DynamicStepContainersProps> = ({
  totalSteps,
  currentStep,
  handleStepPress,
  disabled = false
}) => {
  const containers = Array.from({length: totalSteps}, (_, index) => {
    const isDisabled = index > currentStep;
    const isCompleted = index <= currentStep;
    const stepContainerWidth = getStepContainerWidth(totalSteps);

    return (
      <TouchableOpacity
        key={index}
        onPress={() => !isDisabled && handleStepPress(index)}
        activeOpacity={0.7}
        style={[
          styles.stepContainer,
          {width: stepContainerWidth},
          isCompleted && styles.completedStep,
          isDisabled && styles.disabledStep,
        ]}
        disabled={disabled}
        // I'm using inline styles because the dynamic width changes based on the total steps.
        // For example, if we have 5 steps and the width is 59, I cannot use 'w-[${stepContainerWidth}px]'
        // as native wind code cannot read variables for classes, and it will not generate the 'w-[59px]' class.
      />
    );
  });

  return (
    <View>
      <Text weight='bold' className={getTheme('text-navy pb-2')}>
        {currentStep + 1}/{totalSteps}
      </Text>
      <View className="flex flex-row justify-between items-center mb-10">
        {containers}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    width: 60,
    height: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  completedStep: {
    backgroundColor: '#014541',
  },
  disabledStep: {
    backgroundColor: '#ccc',
  },
});

export default DynamicStepContainers;
