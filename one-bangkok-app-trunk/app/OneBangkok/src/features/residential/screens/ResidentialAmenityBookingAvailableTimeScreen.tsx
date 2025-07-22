import React, {useState, useEffect} from 'react';
import {ScreenContainer, StickyButton} from '../components';
import {Header} from '../components/Header';
import t from '~/utils/text';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import {ListSelect} from '~/features/residential/components/AmenityBooking/SelectList';
import getTheme from '~/utils/themes/themeUtils';
import {activeOpacity} from '~/constants';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {useModal} from '../components/ResidentialModal';
import ErrorAmenityBookingAvailableTimeModal from '../components/AmenityBooking/ErrorAmenityBookingAvailableTimeModal';
import dayjs from 'dayjs';

export type TAvailableTimeListSelect = ListSelect & {
  key: number;
  selected: boolean;
};
type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialAmenityBookingAvailableTimeScreen'
>;

const ResidentialAmenityBookingAvailableTimeScreen = ({
  route: {params},
}: Props) => {
  const [options, setOptions] = useState<TAvailableTimeListSelect[]>(
    params.availableTimeList,
  );
  const [_, modalActions] = useModal();
  const navigation = useNavigation();

  const onPressSelected = (index: number) => {
    setOptions(prev => {
      const updated = [...prev];
      updated[index] = {...updated[index], selected: !updated[index].selected};
      return updated;
    });
  };
  useEffect(() => {
    const selectedOptions = options.filter(e => e.selected);
    onPressValidate(selectedOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const onPressValidate = (selectedOptions: TAvailableTimeListSelect[]) => {
    if (selectedOptions.length === 0) {
      return;
    }

    // Validation The selected time slots are not consecutive
    const selectedKeys = selectedOptions.map(e => e.key);
    if (!isIncreasingByOne(selectedKeys)) {
      openErrorModal(
        t('Residential__Amenity_Invalid__time__selection', 'Invalid Time Slot'),
        t(
          'Residential__Amenity_Time__slots__must__be__booked',
          'Time slots must be selected consecutively.',
        ),
      );
      return;
    }

    // Validation Limited Booking Hours
    const date = dayjs().format('YYYY-MM-DD');
    const startTime = dayjs(
      `${date} ${selectedOptions[0].name.split('-')[0].trim()}`,
      'HH:mm',
    );
    const endTime = dayjs(
      `${date} ${selectedOptions[selectedOptions.length - 1].name
        .split('-')[1]
        .trim()}`,
      'HH:mm',
    );
    const differenceInMinutes = endTime.diff(startTime, 'minute');
    if (
      differenceInMinutes > params.maxPeriod ||
      differenceInMinutes < params.minPeriod
    ) {
      openErrorModal(
        t(
          'Residential__Amenity_Booking__time__restriction',
          'Reselect Time Slot',
        ),
        t(
          'Residential__Amenity_Booking__time__restriction__detail1',
          `Bookings are available from 30 minutes to {{x}} hours.`,
          {x: params.maxPeriod / 60},
        ),
      );
      return;
    }
  };

  const onPressDone = () => {
    const selectedOptions = options.filter(e => e.selected);
    // Validation Time slot selection required
    if (selectedOptions.length === 0) {
      openErrorModal(
        t(
          'Residential__Amenity_Booking__Time__slot__selection__required',
          'Time Slot Required',
        ),
        t(
          'Residential__Amenity_Booking__Time__slot__selection__required__detail',
          'Time slots must be selected to proceed with booking.',
        ),
      );
      return;
    }

    // Validation The selected time slots are not consecutive
    const selectedKeys = selectedOptions.map(e => e.key);
    if (!isIncreasingByOne(selectedKeys)) {
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

    // Validation Limited Booking Hours
    const date = dayjs().format('YYYY-MM-DD');
    const startTime = dayjs(
      `${date} ${selectedOptions[0].name.split('-')[0].trim()}`,
      'HH:mm',
    );
    const endTime = dayjs(
      `${date} ${selectedOptions[selectedOptions.length - 1].name
        .split('-')[1]
        .trim()}`,
      'HH:mm',
    );
    const differenceInMinutes = endTime.diff(startTime, 'minute');
    if (
      differenceInMinutes > params.maxPeriod ||
      differenceInMinutes < params.minPeriod
    ) {
      openErrorModal(
        t(
          'Residential__Amenity_Booking__time__restriction',
          'Reselect Time Slot',
        ),
        t(
          'Residential__Amenity_Booking__time__restriction__detail1',
          `Bookings are available from 30 minutes to {{x}} hours.`,
          {x: params.maxPeriod / 60},
        ),
      );
      return;
    }
    navigation.navigate('AmenityBookingCreateScreen', {
      availableTimeList: options,
    });
  };

  const isIncreasingByOne = (arr: number[]) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] !== arr[i - 1] + 1) {
        return false;
      }
    }
    return true;
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

  return (
    <>
      <ScreenContainer
        className="w-full bg-white"
        bgColor="#ffffff"
        barStyle="dark-content">
        <Header
          leftAction="goBack"
          title={t(
            'Residential__Amenity_Booking__Header__Available_time_Select',
            'Select Available time',
          )}
          bgColor="bg-vp-list"
          titleColor="dark-gray"
          leftColor="#292929"
        />
        <View className="w-full px-4 bg-white mb-6 overflow-y-scroll mt-8">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <SelectList data={options} selected="" /> */}
            <View className={getTheme('flex flex-col')}>
              {options.map(({name, selected, key}, index) => (
                <TouchableOpacity
                  key={key}
                  activeOpacity={activeOpacity}
                  onPress={() => onPressSelected(index)}>
                  <View
                    className={`min-h-[48px] px-5 py-3 flex flex-row justify-between items-center ${getTheme(
                      `border-[1px] ${
                        selected
                          ? 'bg-light-gray border-[#014541] text-dark-teal-dark'
                          : 'border-line'
                      }`,
                    )} `}>
                    <View className="w-full max-w-[90%]">
                      <Text
                        weight={selected ? 'medium' : 'regular'}
                        size="B1"
                        color={selected ? 'dark-teal' : 'dark-gray'}>
                        {name}
                      </Text>
                    </View>
                    {selected ? (
                      <View className="flex flex-col items-end">
                        <Icon
                          type={'checkedIcon'}
                          width={20}
                          height={20}
                          color={'#014541'}
                        />
                      </View>
                    ) : null}
                  </View>
                  <Spacing height={12} />
                </TouchableOpacity>
              ))}
            </View>
            <Spacing height={200} />
          </ScrollView>
        </View>
      </ScreenContainer>
      <StickyButton
        title={t('Residential__Car_Park_Payment__Done', 'Done')}
        className="bg-dark-teal-dark"
        rightIcon="next"
        iconHeight={20}
        iconWidth={20}
        onPress={onPressDone}
      />
    </>
  );
};

export default ResidentialAmenityBookingAvailableTimeScreen;
