import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type BookingStepProps = {
  step: number;
  maxStep?: number;
};

const BookingStep = (props: BookingStepProps) => {
  const {step, maxStep = 2} = props;

  return (
    <View style={styles.contaniner}>
      <Text style={[styles.mediumText, {fontSize: 12}]}>
        {step}/{maxStep}
      </Text>
      <View style={styles.progressContainer}>
        {Array.from({length: maxStep}).map((_, i) => (
          <View
            style={[
              styles.progress,
              {
                marginRight: i < maxStep - 1 ? 8 : undefined,
                backgroundColor: step >= i + 1 ? '#162C52' : '#DCDCDD',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contaniner: {
    width: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
  },
  progress: {
    flex: 1,
    height: 5,
  },
  mediumText: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    lineHeight: 26.4,
  },
});

export default BookingStep;
