import {View, TouchableOpacity, Image} from 'react-native';
import {Text} from '~/components/atoms';
import React from 'react';
import t from '~/utils/text';
import appLanguageState from '~/states/appLanguage/appLanguageState';

export type FacilityUtility = {
  _id: string;
  amount: number;
  id: {
    _id: string;
    nameTh: string;
    nameEn: string;
    icon: string;
    isFixed: boolean;
    deleted: boolean;
    _search: string;
    __v: number;
  };
};
type Editor = {
  _id: string;
  id: string;
  email: string;
  displayName: string;
  ssoProviders: null;
};

export type TFacilityConditionQuota = {
  currentMonth: number;
  nextMonth: number;
  twoMonthsLater: number;
};

export type TFacilityConditionDetail = {
  textCondition: string;
  textConditionEn: string;
  minPeriod: number;
  maxPeriod: number;
  advanceBooking: number;
  capacity: number;
};

type Condition = {
  reserve: {
    _id: string;
    __t: string;
    __v: number;
    name: string;
    enabled: boolean;
    deleted: boolean;
    checkinTimeAllow: null;
    isApproveRequired: boolean;
    isCheckinRequired: boolean;
    isInvitation: boolean;
    reserveTimeLimit: string;
    releaseTime: string;
    isIndividually: boolean;
    isAllowSameTime: boolean;
    isAllowExtendTime: boolean;
    cluster: string;
    facilities: string[];
    advanceBooking: number;
    period: {
      start: string;
      end: string;
    };
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  };
  quota: TFacilityConditionQuota;
  condition: TFacilityConditionDetail;
};

export type Facility = {
  _id: string;
  id: string;
  __v: number;
  start: string;
  end: string;
  name: string;
  nameEn: string;
  nameTh: string;
  details: string;
  type: string;
  utilities: FacilityUtility[];
  area: {
    _id: string;
    id: string;
    name: string;
    th: string;
    en: string;
  };
  sync: any[];
  deleted: boolean;
  image: string;
  imageUrl: string;
  imageBase64: string;
  thumbnailUrl: string;
  condition: Condition;
  createdAt: string;
  updatedAt: string;
  createdBy: Editor;
  updatedBy: Editor;
};
type Props = {
  facilities: Facility[];
  onPress?: (facility: Facility) => void;
};
const CreateAmenityBookingFirstStep = ({facilities, onPress}: Props) => {
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  const handleOnPress = (facility: Facility) => {
    onPress && onPress(facility);
  };

  const getAreaName = (facility: Facility) => {
    try {
      const area = language === 'th' ? facility.area.th : facility.area.en;
      const areaName = area.includes('|') ? area.split('|')[1] : area;
      const {start, end} = facility.condition.reserve.period;
      return `${areaName.trim()} | ${start} - ${end}`;
    } catch {
      return '-';
    }
  };

  const getName = (facility: Facility) => {
    try {
      return language === 'th' ? facility.nameTh : facility.nameEn;
    } catch (error) {
      return '-';
    }
  };

  return (
    <View className="px-4 pb-10 flex flex-col" style={{gap: 32}}>
      <Text size="B2" color="subtitle-muted">
        {t('Residential__Amenity_Booking__Amenity_room', 'Amenity Room')}
      </Text>
      {facilities.map(facility => (
        <TouchableOpacity
          className="w-full border-[1px] border-[#DCDCDC] flex flex-col items-start px-[16px] py-[20px]"
          key={facility.id}
          onPress={() => handleOnPress(facility)}>
          <Text weight="bold">{getName(facility)}</Text>
          <Text>{getAreaName(facility)}</Text>
          <View className="my-[20px] border-t-[1px] w-full border-[#DCDCDC]"></View>
          <Image
            source={{uri: facility.imageBase64}}
            className="w-full h-[100px]"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CreateAmenityBookingFirstStep;
