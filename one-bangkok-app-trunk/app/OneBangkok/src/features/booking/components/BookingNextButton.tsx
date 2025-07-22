import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon, IconProps} from '~/components/atoms';
import t from '~/utils/text';

type BookingNextButtonProps = {
  onPress: () => void;
  text?: string;
  iconType?: IconProps['type'];
  iconSize?: number[];
};

const BookingNextButton = (props: BookingNextButtonProps) => {
  const inset = useSafeAreaInsets();
  const {
    text = t('Booking__Next', 'Next'),
    iconType = 'next',
    iconSize = [25, 25],
  } = props;

  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={[
        styles.nextButton,
        {
          paddingBottom: inset.bottom,
          height: 60 + inset.bottom + (Platform.OS === 'android' ? 14 : 0),
          marginBottom: Platform.OS === 'android' ? inset.bottom : 0,
        },
      ]}>
      <View style={[styles.nextButtonContainer]}>
        <Text style={[styles.regularText]}>{text}</Text>
        <View style={styles.nextButtonIcon}>
          <Icon
            width={iconSize[0]}
            height={iconSize[1]}
            type={iconType}
            color={'white'}
            rotation={0}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  nextButton: {
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: '#162C51',
    width: '100%',
    left: 0,
    bottom: 0,
  },
  nextButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  nextButtonIcon: {
    marginTop: -8,
    marginRight: -8,
  },
  regularText: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19.2,
    color: 'white',
  },
});

export default BookingNextButton;
