import {View, FlatList, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {Spacing, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DatetimeParser from '../utils/reformatter/datetime';
import t from '~/utils/text';

type Props = {
  index: number;
  item: ParcelList;
  onPress: (id: string) => void;
};

const ParcelBoxCard = ({item, onPress}: Props) => {
  return (
    <View>
      <FlatList
        data={[item]}
        renderItem={({item}) => {
          return <ParcelBoxCardList items={[item]} onPress={onPress} />;
        }}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};
export default ParcelBoxCard;

export type ParcelList = {
  id: string;
  orgId: string;
  companyId: string;
  trackingNumber: string;
  carrierId: string;
  parcelConditionId: string;
  parcelTypeId: string;
  parcelStatus: {
    id: number;
    orgId: number;
    projectId: number;
    statusName: string;
    statusId: number;
    listOrder: number;
    isDefault: boolean;
  };
  parcelPriority: number;
  pickedUpType: number;
  description: string;
  receivedDate: string;
  receivedBy: string;
  pickedUpAt: string;
  qrCode: string;
  barcode: string;
  signature: string;
  parcelViewStatus: string;
  isPendingForApproval: boolean;
  displayId: string;
  isActive: boolean;
  storageLocationId: string;
  moderationStatus: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  readStatus: boolean;
  deliveryDate: string;
  arrivedOn: string;
  returnedOn: string;
  deliveryLocationId: string;
  returnedLocationId: string;
  cancelledOn: string;
  returnedToId: string;
  projectName: string;
  buildingName: string;
  unitNumber: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientEmail: string;
  senderFirstName: string;
  senderLastName: string;
  createdByName: string;
  parcelCondition: {
    id: number;
    parcelCondition: string;
    description: string;
    orgId: number;
    createdBy: number;
    createdAt: number;
    updatedBy: number;
    updatedAt: number;
    isActive: boolean;
    listOrder: number;
  };
  parcelType: {
    id: number;
    parcelType: string;
    description: string;
    orgId: number;
    createdBy: number;
    createdAt: number;
    updatedBy: number;
    updatedAt: number;
    isActive: boolean;
    icon: {
      id: number;
      entityId: number;
      entityType: string;
      s3Url: string;
      title: string;
      name: string;
      createdAt: number;
      updatedAt: number;
      isActive: boolean;
      orgId: number;
      s3Path: string;
      record_id: string;
      source_rid: string;
      refImageUrl: string;
    };
  };
  receivedLocation: {
    id: number;
    orgId: number;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    createdBy: number;
    createdAt: number;
    updatedBy: number;
    updatedAt: number;
  };
  deliveredLocation: {
    id: number;
    orgId: number;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    createdBy: number;
    createdAt: number;
    updatedBy: number;
    updatedAt: number;
  };
  returnedTo: {
    id: number;
    orgId: number;
    code: string;
    name: string;
    mobileNo: string;
    website: string;
    address: string;
    isActive: boolean;
    createdBy: number;
    createdAt: number;
    updatedAt: number;
    updatedBy: number;
  };
  parcelPriorityName: string;
};
type ParcelListProps = {
  items: ParcelList[];
  onPress: (id: string) => void;
};
const ParcelBoxCardList = ({items, onPress}: ParcelListProps) => {
  const navigation = useNavigation<StackNavigation>();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  const parseDateFormat = (timestamp: number) => {
    try {
      if (!timestamp) return '-';
      return `${DatetimeParser.toDMY({language, timestamp})} ${
        language === 'en' ? 'at ' : ''
      }${DatetimeParser.toHM({language, timestamp})}`;
    } catch (error) {
      return '';
    }
  };

  const isReturnedType = (parcelType: string) => {
    return parcelType.toLowerCase().includes('returned');
  };

  const onPressCard = (id: string) => {
    onPress(id);
    navigation.navigate('ParcelBoxDetailScreen', {id});
  };

  const parcelDateTitle = (parcelType: string) => {
    parcelType = parcelType.toLowerCase();
    switch (parcelType) {
      case 'returned':
        return t('Residential__Returned_on', 'Date');
      case 'delivered':
        return t('Residential__Delivery_date', 'Date');
      case 'picked up':
        return t('Residential__Parcel_Box__Pick_up_date', 'Pick up date');
      case 'pick up':
        return t('Residential__Parcel_Box__Pick_up_date', 'Pick up date');
      default:
        return t('Residential__Arrived_on', 'Arrived on');
    }
  };

  const parcelDatetime = (parcel: ParcelList) => {
    const parcelType = parcel.parcelStatus.statusName.toLowerCase();
    switch (parcelType) {
      case 'returned':
        return parcel.returnedOn;
      case 'delivered':
        return parcel.deliveryDate;
      case 'picked up':
        return parcel.deliveryDate;
      case 'pick up':
        return parcel.deliveryDate;
      default:
        return parcel.arrivedOn;
    }
  };

  const getLocation = (parcel: ParcelList) => {
    try {
      const parcelType = parcel.parcelStatus.statusName.toLowerCase();
      switch (parcelType) {
        case 'returned':
          return parcel.returnedTo.name;
        case 'delivered':
          return parcel.deliveredLocation.name;
        case 'picked up':
          return parcel.deliveredLocation.name;
        case 'pick up':
          return parcel.deliveredLocation.name;
        default:
          return parcel.receivedLocation.name;
      }
    } catch (error) {
      return '-';
    }
  };

  return items.map(item => (
    <TouchableOpacity
      key={item.id}
      className={'py-2'}
      onPress={() => onPressCard(item.id)}>
      <View
        className={`justify-between px-4 py-5 flex-row ${getTheme(
          `border border-line ${
            !item.readStatus && 'bg-light-green-unread-dark'
          }`,
        )}`}>
        <View>
          {item?.parcelType?.icon && (
            <Image
              source={{uri: item?.parcelType?.icon?.s3Url}}
              style={{width: 24, height: 24}}
            />
          )}
        </View>
        <Spacing width={16} />
        <View className="flex-1">
          <View className="flex-row justify-between">
            <Text color="subtitle-muted">{item.parcelType.parcelType}</Text>
            <Text color="subtitle-muted">{item.displayId}</Text>
          </View>
          <Spacing height={8} />

          <Text weight="medium">
            {item.recipientFirstName} {item.recipientLastName}
          </Text>
          <Spacing height={8} />

          <View className="flex flex-row justify-between">
            <Text weight="regular" size="B2">
              {isReturnedType(item.parcelStatus.statusName)
                ? t('Residential__Returned_to', 'Return')
                : t('Residential__Location', 'Location')}
            </Text>
            <Text weight="regular" size="B2" className="max-w-[160px]">
              {getLocation(item)}
            </Text>
          </View>
          <Spacing height={8} />
          <View className="flex flex-row justify-between">
            <Text weight="regular" size="B2">
              {parcelDateTitle(item.parcelStatus.statusName)}
            </Text>
            <Text weight="regular" size="B2">
              {parseDateFormat(parseInt(parcelDatetime(item)))}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ));
};
