import {useHookstate} from '@hookstate/core';
import dayjs from 'dayjs';
import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '~/navigations/AppNavigation';
import {accountStateAction} from '~/states/account/accountState';
import t from '~/utils/text';
import BackIconButton from '../components/BackIconButton';
import BookingNextButton from '../components/BookingNextButton';
import BookingStep from '../components/BookingStep';
import TicketCard from '../components/TicketCard';
import {bookingTransactionAction} from '../state/boking-transaction';
import {bookingState} from '../state/booking';
import {bookingSettingState} from '../state/booking-setting';
import {bookingSlotDateState} from '../state/booking-slot-date';
import Loading from './Loading';

type DividerProps = {
  top?: number;
  bottom?: number;
};

const Divider = (props: DividerProps) => {
  const {top = 14, bottom = 14} = props;
  return (
    <View style={[styles.divider, {marginTop: top, marginBottom: bottom}]} />
  );
};

const BookingSummaryScreen = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const bkSettingState = useHookstate(bookingSettingState);
  const bkSlotDateState = useHookstate(bookingSlotDateState);
  const bkState = useHookstate(bookingState);
  const program = bkSettingState.bookingSettingDetail.get()?.program;

  const date = useMemo(() => {
    const dateId = bkState.bookingFormData.get()?.bookingSlotDateId!;
    const bookingSlotDate = bkSettingState.bookingSettingDetail
      .get()
      ?.bookingSlotDates.find(v => v.id === dateId);
    return dayjs(bookingSlotDate?.slotDate).format('DD MMMM YYYY');
  }, [bkSettingState.bookingSettingDetail, bkState.bookingFormData]);

  const time = useMemo(() => {
    const timeId = bkState.bookingFormData.get()!.bookingSlotTimeId!;
    const bookingSlotTime = bkSlotDateState.bookingSlotDate
      .get()
      ?.bookingSlotTimes.find(v => v.id === timeId);

    return `${dayjs(bookingSlotTime?.beginSlotTime).format('HH:mm')} - ${dayjs(
      bookingSlotTime?.endSlotTime,
    ).format('HH:mm')}`;
  }, [bkSlotDateState.bookingSlotDate, bkState.bookingFormData]);

  const numberOfTicket = useMemo(() => {
    return bkState.bookingFormData.get()?.numberOfTicket ?? '0';
  }, [bkState.bookingFormData]);

  const price = useMemo(() => {
    const count = +numberOfTicket;
    const ticketPrice =
      bkSettingState.bookingSettingDetail.get()?.ticketPrice ?? 0;
    return ticketPrice * count;
  }, [bkSettingState.bookingSettingDetail, numberOfTicket]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, {marginTop: inset.top}]}>
        <BackIconButton size={25} color="#000000" />
        <Text style={[styles.regularText, {flex: 1, textAlign: 'center'}]}>
          {t('Booking__Get_tickets', 'Get tickets')}
        </Text>
        <View style={{width: 50}} />
      </View>
      <ScrollView>
        <View
          style={[styles.contentContainer, {marginBottom: inset.bottom + 60}]}>
          <BookingStep step={2} />

          <View style={styles.ticketHead}>
            <Text style={styles.categoryText}>
              {t('Booking__Review', 'Review')}
            </Text>
            <Text style={[styles.titleText, {marginTop: 8}]}>
              {t(
                'Booking__Let_s_check_if_everything_is_correct',
                "Let's check if everything is correct",
              )}
            </Text>
          </View>

          <TicketCard
            title={program?.title ?? ''}
            artCTitle={program?.artCTitle ?? ''}
            locations={program?.locations.join(', ') ?? ''}
            thumbnail={program?.thumbnail ?? ''}
            periodAt={program?.periodAt ?? ''}
            periodEnd={program?.periodEnd ?? ''}
            favoriteButtonEnabled={false}
            style={{borderRadius: 0}}
          />

          <View style={styles.detail}>
            <Text style={styles.regularTextBold}>{t('', 'Name')}</Text>
            <Text style={styles.regularText}>
              {accountStateAction?.getFullName() ?? ''}
            </Text>
            <Divider bottom={24} />

            <View style={styles.row}>
              <Text style={styles.regularTextBold}>
                {t('Booking__Date', 'Date')}
              </Text>
              <Text style={styles.regularText}>{date}</Text>
            </View>
            <Divider bottom={24} top={24} />

            <View style={styles.row}>
              <Text style={styles.regularTextBold}>
                {t('Booking__Time', 'Time')}
              </Text>
              <Text style={styles.regularText}>{time}</Text>
            </View>
            <Divider bottom={24} top={24} />

            <View style={styles.row}>
              <Text style={styles.regularTextBold}>
                {t('Booking__Number_of_tickets', 'Number of tickets')}
              </Text>
              <Text style={styles.regularText}>{numberOfTicket}</Text>
            </View>
            <Divider bottom={24} top={24} />

            <View style={styles.row}>
              <Text style={styles.regularTextBold}>
                {t('Booking__Price', 'Price')}
              </Text>
              <Text style={styles.regularText}>
                {price === 0
                  ? t('Booking__Free', 'FREE')
                  : price?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <BookingNextButton
        onPress={async () => {
          const data = bkState.bookingFormData.get();
          try {
            const res = await bookingTransactionAction.createBookingTransaction(
              {
                programId: +data?.programId!,
                bookingSlotDateId: data?.bookingSlotDateId!,
                bookingSlotTimeId: data?.bookingSlotTimeId!,
                ticketsCount: +data?.numberOfTicket!,
              },
            );

            bookingTransactionAction.reset();
            await bookingTransactionAction.fetchBookings({
              fields: 'program',
            });

            const booking = await bookingTransactionAction.getBookingDetail(
              res.id,
            );

            navigation.goBack();
            navigation.goBack();
            navigation.navigate('OrderCompleteScreen', {
              orderId: booking?.orderId ?? '',
              bookingId: booking?.id ?? '',
            });
          } catch (error) {}
        }}
        text={t('Booking__Confirm', 'Confirm')}
      />
      <Loading />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  getTicketButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#FFE35A',
    width: '100%',
    left: 0,
    bottom: 0,
  },
  regularText: {
    fontFamily: 'OneBangkok-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19.2,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 30,
  },
  ticketHead: {
    paddingTop: 18,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  categoryText: {
    fontFamily: 'OneBangkok-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: '#292929',
    lineHeight: 14.4,
  },
  textUnderline: {
    textDecorationLine: 'underline',
  },
  titleText: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 24,
    color: '#292929',
    lineHeight: 26.4,
  },

  detail: {
    padding: 16,
    backgroundColor: '#EFEFEF',
    marginTop: 18,
  },
  regularTextBold: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: '#292929',
    lineHeight: 19.2,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: '#DCDCDC',
    borderStyle: 'solid',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteText: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 14,
    color: '292929',
    lineHeight: 16.8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default BookingSummaryScreen;
