import {hookstate} from '@hookstate/core';
import {AxiosError} from 'axios';
import {bookingClient} from '../booking-client';
import {bookingAction} from './booking';

export interface BookingSlotDate {
  id: string;
  createdAt: string;
  updatedAt: string;
  programId: string;
  bookingSettingId: string;
  slotDate: string;
  bookingSlotTimes: Array<{
    id: string;
    beginSlotTime: string;
    endSlotTime: string;
    maxTicketsPerSlotTime: number;
    bookedTicketsCount: number;
    status: string;
  }>;
}

interface BookingSlotDateStateType {
  bookingSlotDate?: BookingSlotDate;
}

export const bookingSlotDateState = hookstate<BookingSlotDateStateType>({
  bookingSlotDate: undefined,
});

export const bookingSlotDateAction = {
  getBookingSlotDate: async (id: string) => {
    await bookingAction.showLoading();
    try {
      const response = await bookingClient.get<{data: BookingSlotDate}>(
        `/booking-slot-dates/${id}`,
      );
      return response.data.data;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
        console.error(error.response);
      }
      console.error(error);
    } finally {
      await bookingAction.dismissLoading();
    }
  },
  fetchBookingSlotDate: async (id: string) => {
    const data = await bookingSlotDateAction.getBookingSlotDate(id);
    bookingSlotDateState.bookingSlotDate.set(data);
  },
  reset: () => {
    bookingSlotDateState.bookingSlotDate.set(undefined);
  },
};
