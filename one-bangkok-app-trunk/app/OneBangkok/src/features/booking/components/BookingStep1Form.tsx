import {useHookstate} from '@hookstate/core';
import dayjs from 'dayjs';
import React, {useEffect, useMemo, useState} from 'react';
import {
  FieldValues,
  FormProvider,
  UseFormReturn,
  useWatch,
} from 'react-hook-form';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import ControlledDropdown from '~/components/molecules/ControlledDropdown';
import t from '~/utils/text';
import {bookingAction} from '../state/booking';
import {
  bookingSettingAction,
  bookingSettingState,
} from '../state/booking-setting';
import {
  bookingSlotDateAction,
  bookingSlotDateState,
} from '../state/booking-slot-date';

type BookingFormProps = {
  form: UseFormReturn<FieldValues, any, undefined>;
  programId: string;
  style?: StyleProp<ViewStyle>;
};

const BookingStep1Form = (props: BookingFormProps) => {
  const {style, form, programId} = props;
  const settingState = useHookstate(bookingSettingState);
  const slotDateState = useHookstate(bookingSlotDateState);
  const dateValue = useWatch({
    control: form.control,
    name: 'bookingSlotDateId',
  });
  const timeValue = useWatch({
    control: form.control,
    name: 'bookingSlotTimeId',
  });
  const numberOfTicketValue = useWatch({
    control: form.control,
    name: 'numberOfTicket',
  });
  const items = useMemo(() => {
    return settingState.bookingSettingDetail
      ?.get()
      ?.bookingSlotDates?.map(slotDate => {
        const today = dayjs();
        const targetDate = dayjs(slotDate.slotDate);
        return {
          label: targetDate.format('DD MMMM YYYY'),
          value: slotDate.id.toString(),
          disabled: targetDate.isBefore(today, 'day'),
        };
      });
  }, [settingState.bookingSettingDetail]);

  const timeItems = useMemo(() => {
    if (!dateValue) {
      return [];
    }
    return slotDateState.bookingSlotDate
      .get()
      ?.bookingSlotTimes.map(slotTime => {
        const beginTime = dayjs(slotTime.beginSlotTime);
        const endTime = dayjs(slotTime.endSlotTime);
        const soldOutText = slotTime.status === 'sold_out' ? ' (Sold out)' : '';
        return {
          label: `${beginTime.format('HH:mm')} - ${endTime.format(
            'HH:mm',
          )}${soldOutText}`,
          value: slotTime.id.toString(),
          disabled:
            slotTime.status !== 'available' ||
            endTime.isBefore(dayjs()) ||
            slotTime.maxTicketsPerSlotTime === slotTime.bookedTicketsCount,
        };
      });
  }, [dateValue, slotDateState.bookingSlotDate]);

  const [numberOfTicketItems, setNumberOfTicketItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    const fetch = async () => {
      const slotDateId = dateValue;
      if (slotDateId) {
        const bookingSlotDate = await bookingSlotDateAction.getBookingSlotDate(
          slotDateId,
        );
        const bookingSlotTime = bookingSlotDate?.bookingSlotTimes?.find(
          v => v.id === timeValue,
        );
        if (!bookingSlotTime) {
          setNumberOfTicketItems([]);
          return;
        }

        const maxTicketsPerTransaction =
          settingState.bookingSettingDetail?.get()?.maxTicketsPerTransaction ??
          0;
        const restTicketsCount =
          bookingSlotTime.maxTicketsPerSlotTime -
          bookingSlotTime.bookedTicketsCount;
        const maxSelectableTickets = Math.min(
          maxTicketsPerTransaction,
          restTicketsCount,
        );

        const data = Array.from(
          {length: maxSelectableTickets},
          (_, i) => i + 1,
        ).map(value => ({
          label: value.toString(),
          value: value.toString(),
        }));
        setNumberOfTicketItems(data);
      }
    };

    if (dateValue && timeValue) {
      fetch();
    }
  }, [dateValue, settingState.bookingSettingDetail, timeValue]);

  useEffect(() => {
    const fetchOption = async () => {
      await bookingSettingAction.fetchBookingSettingDetail(
        programId,
        ['bookingSlotDates', 'program'],
        dayjs().format('YYYY-MM-DD'),
      );
    };
    fetchOption();
  }, [programId]);

  useEffect(() => {
    if (!dateValue) {
      return;
    }
    bookingAction.setBookingForm({bookingSlotTimeId: undefined});
    form.setValue('bookingSlotTimeId', undefined);
    const fetchOption = async () => {
      await bookingSlotDateAction.fetchBookingSlotDate(dateValue);
    };
    fetchOption();
  }, [dateValue, form]);

  useEffect(() => {
    if (dateValue) {
      form.trigger('bookingSlotDateId');
    }
  }, [dateValue, form]);

  useEffect(() => {
    if (timeValue) {
      form.trigger('bookingSlotTimeId');
    }
  }, [form, timeValue]);

  useEffect(() => {
    if (numberOfTicketValue) {
      form.trigger('numberOfTicket');
    }
  }, [form, numberOfTicketValue]);

  return (
    <View style={style}>
      <FormProvider {...form}>
        <ControlledDropdown
          labelText={t('Booking__Select_date', 'Select date')}
          name="bookingSlotDateId"
          items={items ?? []}
          rules={{required: t('Booking__Date_is_required', 'Date is required')}}
        />

        <View style={styles.marginTop24} />
        <ControlledDropdown
          labelText={t('Booking__Select_time', 'Select time')}
          name="bookingSlotTimeId"
          items={timeItems ?? []}
          rules={{required: t('Booking__Time_is_required', 'Time is required')}}
          disabled={!dateValue}
        />

        <View style={styles.marginTop24} />
        <ControlledDropdown
          labelText={t('Booking__Number_of_tickets', 'Number of tickets')}
          name="numberOfTicket"
          items={numberOfTicketItems}
          rules={{
            required: t(
              'Booking__Number_of_tickets_is_required',
              'Number of tickets is required',
            ),
          }}
          disabled={!dateValue || !timeValue}
        />
      </FormProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  marginTop24: {
    marginTop: 18,
  },
});

export default BookingStep1Form;
