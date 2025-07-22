import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from '~/components/atoms';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import BackIconButton from '../components/BackIconButton';
import BookingNextButton from '../components/BookingNextButton';

type OrderCompleteScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OrderCompleteScreen'
>;

const OrderCompleteScreen = ({
  route: {
    params: {orderId, bookingId},
  },
}: OrderCompleteScreenProps) => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <BackIconButton
        style={[{marginTop: inset.top}]}
        size={20}
        color="#000000"
      />
      <View
        style={[
          styles.contentContainer,
          {marginBottom: (inset.bottom + 60) * 2},
        ]}>
        <View style={[styles.checkIconView]}>
          <Icon type="checkedIcon" width={40} height={40} color="#22973F" />
        </View>
        <Text
          style={[
            styles.h2Text,
            {marginBottom: 20, color: '#22973F', marginTop: -8},
          ]}>
          {t('Booking__Order_complete', 'Order complete')}
        </Text>
        <Text style={[styles.regularText, {marginBottom: 20}]}>
          {t(
            'Booking__You_will_receive_all_the_tickets_in_your_email_very_soon',
            'You will receive all the tickets in your email very soon.',
          )}
        </Text>
        <Text style={[styles.regularText, {marginBottom: 12}]}>
          {t(
            'Booking__You_can_also_use_your_personal_QR_code_to_as_a_ticket',
            'You can also use your personal QR code to as a ticket.',
          )}
        </Text>

        <Text style={[styles.b1Text, {marginBottom: 24}]}>
          {t('', 'Order ID: ')}
          {orderId}
        </Text>
      </View>

      <BookingNextButton
        onPress={() => {
          navigation.goBack();
          navigation.navigate('TicketScreen', {
            bookingId,
          });
        }}
        text={t('Booking__View_my_tickets', 'View my ticket')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  h2Text: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 28,
    color: '#292929',
  },
  b1Text: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: '#292929',
  },
  regularText: {
    fontFamily: 'OneBangkok-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19.2,
    color: '#292929',
  },
  toTicketsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#BDBDBD',
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    paddingLeft: 18,
    paddingRight: 12,
  },
  checkIconView: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
});

export default OrderCompleteScreen;
