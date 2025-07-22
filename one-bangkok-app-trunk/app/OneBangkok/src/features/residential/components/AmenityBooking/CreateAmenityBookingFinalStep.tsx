import {View, TouchableOpacity} from 'react-native';
import {Text} from '~/components/atoms';
import React, {useEffect} from 'react';
import t from '~/utils/text';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import dayjs from 'dayjs';
import {Facility} from './CreateAmenityBookingFirstStep';
import {useModal} from '../ResidentialModal';
import ErrorAmenityBookingAvailableTimeModal from './ErrorAmenityBookingAvailableTimeModal';

interface Props {
  facility: Facility;
  date: string;
  timePeriod: string;
  details?: string;
  onPressEditBookingDetails: () => void;
  onPressEditRemark: () => void;
  hasError: boolean;
}
const CreateAmenityBookingFinalStep = ({
  facility,
  date,
  timePeriod,
  details,
  onPressEditBookingDetails,
  onPressEditRemark,
  hasError,
}: Props) => {
  const [_, modalActions] = useModal();
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;

  date = dayjs(date)
    .locale(language)
    .format(`DD MMMM ${language === 'th' ? 'BBBB' : 'YYYY'}`);

  const getBuilding = () => {
    try {
      return language === 'th'
        ? facility.area.th.split('|')[0]
        : facility.area.en.split('|')[0];
    } catch (error) {
      return '-';
    }
  };

  const getFloor = () => {
    try {
      return language === 'th'
        ? facility.area.th.split('|')[1]
        : facility.area.en.split('|')[1];
    } catch (error) {
      return '-';
    }
  };
  const openErrorModal = (title: string, description: string) => {
    modalActions.setContent(
      <ErrorAmenityBookingAvailableTimeModal
        title={title}
        description={description}
      />,
    );
    modalActions.show();
  };
  useEffect(() => {
    if (hasError) {
      openErrorModal(
        t(
          'Residential__Amenity_Invalid__time__selection',
          'Invalid time selection',
        ),
        t(
          'Residential__Amenity_Time__slots__must__be__booked',
          'Time slots must be booked consecutively. Please adjust your selection.',
        ),
      );
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasError]);
  return (
    <View className="px-4 pb-10 flex flex-col" style={{gap: 16}}>
      <View className="flex flex-col border-[1px] border-[#dcdcdc] px-[16px]">
        <View className="flex flex-row items-center justify-between py-[20px] w-full ">
          <Text weight="medium">
            {t(
              'Residential__Amenity_Booking__Booking_Details',
              'Booking Details',
            )}
          </Text>
          <TouchableOpacity onPress={onPressEditBookingDetails}>
            <Text color="primary">{t('General__Edit', 'Edit')}</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full border-t-[1px] border-[#dcdcdc]"></View>
        <View className="py-[20px] flex flex-col items-start" style={{gap: 24}}>
          <View style={{gap: 4}}>
            <Text size="C1" color="subtitle-muted">
              {t('General__Building', 'Building')}
            </Text>
            <Text>{getBuilding()}</Text>
          </View>
          <View style={{gap: 4}}>
            <Text size="C1" color="subtitle-muted">
              {t('General__Floor', 'Floor')}
            </Text>
            <Text>{getFloor()}</Text>
          </View>
          <View style={{gap: 4}}>
            <Text size="C1" color="subtitle-muted">
              {t('Residential__Amenity_Booking__Room_name', 'Amenity Name')}
            </Text>
            <Text>{facility?.name}</Text>
          </View>
          <View style={{gap: 4}}>
            <Text size="C1" color="subtitle-muted">
              {t('Residential__Amenity_Booking__Date', 'Booking Date')}
            </Text>
            <Text>{date}</Text>
          </View>
          <View style={{gap: 4}}>
            <Text size="C1" color="subtitle-muted">
              {t('Residential__Amenity_Booking__Time_Remark', 'Booking Time')}
            </Text>
            <Text>{timePeriod}</Text>
          </View>
        </View>
      </View>
      <View className="flex flex-col border-[1px] border-[#dcdcdc] px-[16px]">
        <View className="flex flex-row items-center justify-between py-[20px] w-full ">
          <Text weight="medium">
            {t('Residential__Amenity_Booking__Remark_des', 'Remark')}
          </Text>
          <TouchableOpacity onPress={onPressEditRemark}>
            <Text color="primary">{t('General__Edit', 'Edit')}</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full border-t-[1px] border-[#dcdcdc]"></View>
        <View className="py-[20px] flex flex-col items-start" style={{gap: 24}}>
          <View style={{gap: 4}}>
            <Text>{details}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CreateAmenityBookingFinalStep;
