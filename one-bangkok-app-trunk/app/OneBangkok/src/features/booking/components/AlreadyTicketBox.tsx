import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import {Icon} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';

type AlreadyTicketBoxProps = {
  style?: StyleProp<ViewStyle>;
};

const AlreadyTicketBox = (props: AlreadyTicketBoxProps) => {
  const {style} = props;
  const navigation = useNavigation();
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.boldText}>
        You already have tickets for this event
      </Text>
      <Text style={styles.regularText} className="mt-2 mb-6">
        It seems you already got 2 tickets for this event, do you want to get
        more? No problem, but if you want to check out your current tickets tap
        below
      </Text>
      <TouchableHighlight
        onPress={() => {
          navigation.navigate('MyTicketScreen');
        }}>
        <View style={styles.toTicketsButton}>
          <Text>{t('Booking__My_tickets', 'My tickets')}</Text>
          <Icon width={20} height={20} type="next" />
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFEFEF',
    padding: 25,
    paddingTop: 25,
  },
  boldText: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19.2,
  },
  regularText: {
    fontFamily: 'OneBangkok-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16.8,
  },
  toTicketsButton: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: '#E4E4E4',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#BDBDBD',
    flexDirection: 'row',
    paddingLeft: 18,
    paddingRight: 12,
  },
});

export default AlreadyTicketBox;
