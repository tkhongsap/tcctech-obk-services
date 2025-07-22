import {hookstate} from '@hookstate/core';
import {AxiosError} from 'axios';
import {Dayjs} from 'dayjs';
import {getArtCToken} from '~/services/artCultureService/authService';
import {bookingPublicClient} from '../booking-public-client';
import {Program} from './boking-transaction';
import {bookingAction} from './booking';
import {BookingSlotDate} from './booking-slot-date';

interface BookingSetting {
  id: number;
  programId: string;
  createdAt: string;
  updatedAt: string;
  conditionText: string;
  ticketPrice: number;
  maxTicketsPerTransaction: number;
  openBookingTime: string;
  closeBookingTime: string;
  program: Program;
  bookingSlotDates: BookingSlotDate[];
}

interface BookingAvailable {
  programId: number;
  isAvailable: boolean;
}

interface BookingSettingStateType {
  bookingSettingDetail?: BookingSetting;
}

export const bookingSettingState = hookstate<BookingSettingStateType>({
  bookingSettingDetail: undefined,
});

export const bookingSettingAction = {
  fetchBookingSettingDetail: async (
    programId: string,
    fields?: string[],
    minDate?: string,
  ) => {
    await bookingAction.showLoading();
    const token = await getArtCToken();
    try {
      const response = await bookingPublicClient.get<{data: BookingSetting}>(
        '/booking-settings/detail',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            fields: fields?.join(','),
            programId,
            minDate,
          },
        },
      );
      bookingSettingState.bookingSettingDetail.set(response.data.data);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
      }
      console.error(error);
    } finally {
      await bookingAction.dismissLoading();
    }
  },
  fetchAvailablePrograms: async (programIds: number[], time: Dayjs) => {
    const token = await getArtCToken();
    try {
      const response = await bookingPublicClient.post<{
        data: BookingAvailable[];
      }>(
        '/booking-settings/check-availability',
        {
          time: time.format(),
          programIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const hash = response.data.data.reduce((acc, curr) => {
        acc[curr.programId] = curr.isAvailable;
        return acc;
      }, {} as Record<number, boolean>);
      return hash;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
      }
      console.error(error);
      return {};
    }
  },
  reset: () => {
    bookingSettingState.bookingSettingDetail.set(undefined);
  },
};
