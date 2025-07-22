import {hookstate} from '@hookstate/core';

export interface BookingFormType {
  programId?: string;
  bookingSlotDateId?: string;
  bookingSlotTimeId?: string;
  numberOfTicket?: string;
}

interface BookingStateType {
  loading: boolean;
  loadingCount: number;
  bookingFormData?: BookingFormType;
}

export const bookingState = hookstate<BookingStateType>({
  loading: false,
  loadingCount: 0,
  bookingFormData: undefined,
});

export const bookingAction = {
  showLoading: () => {
    bookingState.loadingCount.set(bookingState.loadingCount.value + 1);
    bookingState.loading.set(true);
  },
  dismissLoading: () => {
    bookingState.loadingCount.set(bookingState.loadingCount.value - 1);
    if (bookingState.loadingCount.value === 0) {
      bookingState.loading.set(false);
    }
  },
  setBookingForm: (form: BookingFormType) => {
    bookingState.bookingFormData.set({
      ...bookingState.bookingFormData.value,
      ...form,
    });
  },
  reset: () => {
    bookingState.bookingFormData.set(undefined);
  },
};
