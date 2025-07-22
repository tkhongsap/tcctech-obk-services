import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageSourcePropType,
  Image,
} from 'react-native';
import {Colors} from '../constants/Colors';
import {Dimensions} from 'react-native';

type Props = {
  current: number;
  total?: number;
};

const SignUpProgressBar = ({current, total}: Props) => {
  if (total == null) {
    total = 8;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progressBar,
          {width: (Dimensions.get('window').width * current) / total},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black80,
    width: '100%',
    height: 2,
  },
  progressBar: {
    backgroundColor: Colors.blue,
    height: 2,
  },
});

export default SignUpProgressBar;
