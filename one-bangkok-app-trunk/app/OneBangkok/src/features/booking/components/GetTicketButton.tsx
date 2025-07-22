import dayjs from 'dayjs';
import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation} from '~/navigations/AppNavigation';
import authenState from '~/states/authen/authenState';
import firebaseConfigState from '~/states/firebase';
import t from '~/utils/text';
import {bookingSettingAction} from '../state/booking-setting';
import BookingMemberOnlyModal from './BookingMemberOnlyModal';
import BookingNextButton from './BookingNextButton';
import {logEvent} from '~/utils/logGA';

type GetTicketButtonProps = {
  programId?: string;
};

const GetTicketButton = (props: GetTicketButtonProps) => {
  const {programId} = props;
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const showGetTicketButton = useMemo(() => {
    return isAvailable && firebaseConfigState.enable_artc_booking_ticket.value;
  }, [isAvailable]);

  useEffect(() => {
    if (firebaseConfigState.enable_artc_booking_ticket.value && programId) {
      const fetch = async () => {
        const hash = await bookingSettingAction.fetchAvailablePrograms(
          [+programId],
          dayjs(),
        );
        setIsAvailable(hash[+programId]);
      };

      fetch();
    }
    return () => {
      bookingSettingAction.reset();
    };
  }, [programId]);

  return showGetTicketButton ? (
    <>
      {isModalVisible && (
        <BookingMemberOnlyModal
          onClose={() => {
            setIsModalVisible(false);
          }}
        />
      )}

      <BookingNextButton
        onPress={() => {
          logEvent('button_click', {
            screen_name: 'ProgramFullDetailItem',
            feature_name: 'Booking',
            action_type: 'click',
            bu: 'Art & Culture',
          });
          if (!authenState.token.value) {
            setIsModalVisible(true);
            return;
          }
          if (programId) {
            navigation.navigate('BookingStep1Screen', {
              programId: programId,
            });
          }
        }}
        text={t('', 'Get Ticket')}
        iconType="ticketIconWhite"
        iconSize={[20, 20]}
      />
    </>
  ) : null;
};

export default GetTicketButton;
