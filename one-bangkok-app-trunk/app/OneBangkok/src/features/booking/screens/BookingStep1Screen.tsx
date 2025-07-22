import {useHookstate} from '@hookstate/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import BackIconButton from '../components/BackIconButton';
import BookingNextButton from '../components/BookingNextButton';
import BookingStep from '../components/BookingStep';
import BookingStep1Form from '../components/BookingStep1Form';
import {bookingAction, bookingState} from '../state/booking';
import {bookingSlotDateAction} from '../state/booking-slot-date';
import Loading from './Loading';

type BookingStep1ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BookingStep1Screen'
>;

const BookingStep1Screen = ({
  route: {
    params: {programId},
  },
}: BookingStep1ScreenProps) => {
  const inset = useSafeAreaInsets();
  const bkState = useHookstate(bookingState);

  const form = useForm({
    reValidateMode: 'onSubmit',
    mode: 'onSubmit',
    defaultValues: bkState.bookingFormData.get(),
  });
  const navigation = useNavigation();

  useEffect(() => {
    bookingAction.setBookingForm({programId});
    return () => {
      bookingAction.reset();
      bookingSlotDateAction.reset();
    };
  }, [form, programId]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, {marginTop: inset.top}]}>
        <BackIconButton size={25} color="#000000" />
        <Text style={[styles.regularText, {flex: 1, textAlign: 'center'}]}>
          {t('Booking__Confirm', 'Get tickets')}
        </Text>
        <View style={{width: 50}} />
      </View>

      <ScrollView>
        <View
          style={[styles.contentContainer, {marginBottom: inset.bottom + 60}]}>
          <BookingStep step={1} />

          <View style={styles.ticketHead}>
            <Text style={[styles.dateAndTimeText]}>
              {t('Booking__Date_and_time', 'Date and time')}
            </Text>
            <Text style={[styles.titleText, {marginTop: 8, marginBottom: 18}]}>
              {t(
                'Booking__Select_your_preferred_date_and_time_of_visit',
                'Select your preferred date and time of visit',
              )}
            </Text>
          </View>

          <BookingStep1Form form={form} programId={programId} />
        </View>
      </ScrollView>

      <BookingNextButton
        onPress={form.handleSubmit(() => {
          bookingAction.setBookingForm(form.getValues());
          navigation.navigate('BookingSummaryScreen');
        })}
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingTop: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dateAndTimeText: {
    fontFamily: 'OneBangkok-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: '#4D616D',
    lineHeight: 14.4,
  },
  titleText: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 24,
    color: '#292929',
    lineHeight: 26.4,
  },
});

export default BookingStep1Screen;
