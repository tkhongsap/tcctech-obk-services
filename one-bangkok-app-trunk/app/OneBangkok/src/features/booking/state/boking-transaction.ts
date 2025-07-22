import {hookstate} from '@hookstate/core';
import {AxiosError} from 'axios';
import {Alert} from 'react-native';
import {accountStateAction} from '~/states/account/accountState';
import {bookingClient} from '../booking-client';
import {bookingAction} from './booking';

export interface BookingTickets {
  checkedInAt?: string;
  id: string;
  status: string;
  ticketNo: string;
}

export interface Program {
  periodAt: string;
  periodEnd: string;
  artCTitle: string;
  locale: string;
  locations: string[];
  title: string;
  thumbnail: string;
  banner: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  programId: string;
  bookingSlotDateId: string;
  bookingSlotTimeId: string;
  orderId: string;
  slotDate: string;
  beginSlotTime: string;
  endSlotTime: string;
  bookerName: string;
  bookerEmail: string;
  bookerPhoneNumber: string;
  ticketsCount: number;
  showingStatus: string;
  price: number;
  program?: Program;
  bookingTickets: BookingTickets[];
}

interface BookingTransactionStateType {
  bookings: Booking[];
  bookingDetail: Record<string, Booking>;
}

export const bookingTransactionState = hookstate<BookingTransactionStateType>({
  bookings: [],
  bookingDetail: {},
});

export const bookingTransactionAction = {
  fetchBookings: async (options?: {fields?: string}) => {
    await bookingAction.showLoading();
    try {
      const response = await bookingClient.get<{data: Booking[]}>(
        '/booking-transactions',
        {
          params: {fields: options?.fields},
        },
      );
      bookingTransactionState.bookings.set(response.data.data);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
      }
      console.error(error);
    } finally {
      await bookingAction.dismissLoading();
    }
  },
  getBookingDetail: async (id: string) => {
    await bookingAction.showLoading();
    try {
      const response = await bookingClient.get<{data: Booking}>(
        `/booking-transactions/${id}`,
      );
      const booking = response.data.data;
      return booking;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
      }
      console.error(error);
    } finally {
      await bookingAction.dismissLoading();
    }
  },
  fetchBookingDetail: async (id: string) => {
    if (bookingTransactionState.bookingDetail.get()[id]) {
      return;
    }
    const booking = await bookingTransactionAction.getBookingDetail(id);
    if (booking) {
      bookingTransactionState.bookingDetail.set({[booking.id]: booking});
    }
  },
  createBookingTransaction: async (params: {
    programId: number;
    bookingSlotDateId: string;
    bookingSlotTimeId: string;
    ticketsCount: number;
  }) => {
    await bookingAction.showLoading();
    try {
      const response = await bookingClient.post<{data: {id: string}}>(
        '/booking-transactions',
        {
          ...params,
          bookerName: accountStateAction.getFullName(),
          bookerEmail:
            accountStateAction.getIdentifiers('email')?.[0]?.identifier,
          bookerPhoneNumber:
            accountStateAction.getIdentifiers('phone')?.[0]?.identifier,
        },
      );
      return response.data.data;
    } catch (error: any) {
      let message = 'Please try again';
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
        console.error(error.response?.data.message);
      }
      Alert.alert('Something went wrong', message);
      console.error(error);
      return Promise.reject(error);
    } finally {
      await bookingAction.dismissLoading();
    }
  },
  reset: () => {
    bookingTransactionState.bookings.set([]);
    bookingTransactionState.bookingDetail.set({});
  },
};
