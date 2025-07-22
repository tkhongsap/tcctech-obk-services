import {ImmutableObject} from '@hookstate/core';
import dayjs from 'dayjs';
import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Booking} from '../state/boking-transaction';
import TicketCard from './TicketCard';

interface TicketCardListProps {
  items: {[title: string]: ImmutableObject<Booking>[]};
  onPress: (bookingId: string) => void;
  style?: StyleProp<ViewStyle>;
}

const TicketCardList = (props: TicketCardListProps) => {
  const {items, style, onPress} = props;
  const inset = useSafeAreaInsets();

  return (
    <ScrollView style={style}>
      {Object.entries(items).map(([title, value]) => (
        <>
          <Text style={styles.headerText}>{title}</Text>
          {value
            .sort(
              (a, b) =>
                dayjs(a.beginSlotTime).unix() - dayjs(b.beginSlotTime).unix(),
            )
            .map(booking => {
              return (
                <TicketCard
                  key={booking.id}
                  title={booking.program?.title ?? ''}
                  artCTitle={booking.program?.artCTitle ?? ''}
                  locations={booking.program?.locations.join(', ') ?? ''}
                  thumbnail={booking.program?.thumbnail ?? ''}
                  periodAt={booking.program?.periodAt ?? ''}
                  periodEnd={booking.program?.periodEnd ?? ''}
                  bookingBeginSlotTime={booking.beginSlotTime}
                  BookingEndSlotTime={booking.endSlotTime}
                  favoriteButtonEnabled={false}
                  onPress={onPress.bind(this, booking.id)}
                />
              );
            })}
        </>
      ))}
      <View style={{height: inset.bottom}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'OneBangkok-Regular',
    fontWeight: '500',
    fontSize: 24,
    marginTop: 24,
  },
});

export default TicketCardList;
