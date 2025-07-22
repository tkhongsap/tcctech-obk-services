import {ImmutableObject, useHookstate} from '@hookstate/core';
import dayjs from 'dayjs';
import React, {useEffect, useMemo} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Tab,
  TabBody,
  TabContent,
  TabHeader,
  TabItem,
} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import firebaseConfigState from '~/states/firebase';
import t from '~/utils/text';
import BackIconButton from '../components/BackIconButton';
import TicketCardList from '../components/TicketCardList';
import {
  Booking,
  bookingTransactionAction,
  bookingTransactionState,
} from '../state/boking-transaction';
import Loading from './Loading';

const MyTicketScreen = () => {
  const inset = useSafeAreaInsets();
  const {bookings} = useHookstate(bookingTransactionState);
  const navigation = useNavigation();

  const {upcoming, past} = useMemo(() => {
    return [...bookings.value].reduce(
      (acc, booking) => {
        if (booking.showingStatus === 'upcoming') {
          const month = dayjs(booking.slotDate).format('MMMM');
          acc.upcoming[month] ??= [];
          acc.upcoming[month].push(booking);
        } else if (booking.showingStatus === 'past') {
          const year = dayjs(booking.slotDate).get('years');
          acc.past[year] ??= [];
          acc.past[year].push(booking);
        }
        return acc;
      },
      {upcoming: {}, past: {}} as {
        upcoming: {[key: string]: ImmutableObject<Booking>[]};
        past: {[key: string]: ImmutableObject<Booking>[]};
      },
    );
  }, [bookings]);

  useEffect(() => {
    if (firebaseConfigState.enable_artc_booking_ticket.value) {
      const fetch = async () => {
        await bookingTransactionAction.fetchBookings({
          fields: 'program',
        });
      };
      fetch();
    }
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        source={require('../../../assets/images/my_ticket_header.jpg')}>
        <View style={[styles.headerContainer, {paddingTop: inset.top}]}>
          <BackIconButton style={styles.backIconButton} size={20} />
          <Text style={styles.pageTitle1}>
            {t('Booking__One_Bangkok', 'One Bangkok')}
          </Text>
          <Text style={styles.pageTitle2}>
            {t('Booking__My_Tickets', 'My Tickets')}
          </Text>
        </View>
      </ImageBackground>
      <View style={styles.tabContainer}>
        <Tab
          style={styles.flex1}
          bodyStyle={styles.flex1}
          headerStyle={styles.tabHeader}>
          <TabHeader>
            <TabItem>{t('Booking__Upcoming', 'Upcoming')}</TabItem>
            <TabItem>{t('Booking__Past', 'Past')}</TabItem>
          </TabHeader>
          <TabBody style={styles.flex1}>
            <TabContent style={styles.flex1}>
              <TicketCardList
                style={styles.tabScrollView}
                items={upcoming}
                onPress={bookingId => {
                  navigation.navigate('TicketScreen', {
                    bookingId,
                  });
                }}
              />
            </TabContent>
            <TabContent style={styles.flex1}>
              <TicketCardList
                style={styles.tabScrollView}
                items={past}
                onPress={bookingId => {
                  navigation.navigate('TicketScreen', {
                    bookingId,
                  });
                }}
              />
            </TabContent>
          </TabBody>
        </Tab>
      </View>
      <Loading />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    height: 200,
    padding: 20,
  },
  pageTitle1: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 14,
    marginTop: 'auto',
    color: 'white',
  },
  pageTitle2: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 32,
    color: 'white',
  },
  tabContainer: {
    marginTop: 16,
    flex: 1,
  },
  tabScrollView: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  tabHeader: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  flex1: {
    flex: 1,
  },
  backIconButton: {
    marginLeft: -16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'red',
  },
});

export default MyTicketScreen;
