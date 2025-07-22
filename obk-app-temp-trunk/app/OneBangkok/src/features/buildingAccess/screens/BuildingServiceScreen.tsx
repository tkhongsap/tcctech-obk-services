import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Icon, IconType, Spacing, Text} from '~/components/atoms';
import {HeadText, Header} from '~/components/molecules';
import {Screen} from '~/components/templates';
import {useNavigation} from '~/navigations/AppNavigation';

import t from '~/utils/text';
import {memberState} from '../store/member';
import getTheme from '~/utils/themes/themeUtils';
import firebaseConfigState from '~/states/firebase';
import {usePermission} from '~/utils/permission';

interface ShortCutComponent {
  iconType: IconType;
  title: string;
  subTitle: string;
  onPress: Function;
}

const ShortCutComponent = (props: ShortCutComponent) => {
  const {iconType, title, subTitle, onPress} = props;

  return (
    <TouchableOpacity
      className={`py-[30px] flex-row justify-between`}
      onPress={() => {
        onPress();
      }}>
      <View className="flex-row items-center">
        <View className="pr-4">
          <Icon type={iconType} width={24} height={24} />
        </View>
        <View>
          <Text weight="medium">{title}</Text>
          <Text size="C1" color="default">
            {subTitle}
          </Text>
        </View>
      </View>
      <Icon type={'arrowRightIcon'} width={16} height={16} />
    </TouchableOpacity>
  );
};

const ShortCut = () => {
  const {permissionList} = usePermission();
  const navigation = useNavigation();

  const isRedemption =
    memberState.redemption.value &&
    firebaseConfigState.enable_building_service.parking_redemption;

  const borderLineAirCon = isRedemption
    ? getTheme('border-b-[1px] border-line')
    : '';
  return (
    <View className={`${getTheme('border-[1px] border-line')}`}>
      {firebaseConfigState.enable_building_service.service_request.value &&
        permissionList.canDoServiceRequest && (
          <View className={`px-4 ${getTheme('border-b-[1px] border-line')}`}>
            <ShortCutComponent
              iconType="serviceRequestIcon"
              title={t('General__Request_service', 'Request service')}
              subTitle={t(
                'General__Request_service_description',
                'Request maintenance in the building',
              )}
              onPress={() => navigation.navigate('RequestServiceScreen')}
            />
          </View>
        )}
      {firebaseConfigState.enable_building_service.air_conditioner_request
        .value &&
        permissionList.canDoACRequest && (
          <View className={`px-4 ${borderLineAirCon}`}>
            <ShortCutComponent
              iconType="airConditionerRequestIcon"
              title={t(
                'General__Air_conditioner_request',
                'Air conditioner request',
              )}
              subTitle={t(
                'General__Air_conditioner_request_description',
                'Overtime air conditioner request',
              )}
              onPress={() => {
                navigation.navigate('AirConditionerRequestScreen');
              }}
            />
          </View>
        )}
      {isRedemption && (
        <View className="px-4">
          <ShortCutComponent
            iconType="smartParkingIcon"
            title={t('General__Park_redemption', 'Parking redemption')}
            subTitle={t(
              'General__Park_redemption_description',
              'Redeem time for all entering your space',
            )}
            onPress={() => navigation.navigate('ParkingRedemptionScreen')}
          />
        </View>
      )}
    </View>
  );
  // TODO:Improve when can check permission
  // return (
  //   <View className="flex items-center justify-center h-full mt-20 text-center">
  //     <Icon type="bell" width={48} height={48} />
  //     <Text size="H3" weight="medium">
  //       {t('no_key', 'Upcoming Features')}
  //     </Text>
  //     <Text size="B1" weight="regular" color="subtitle-muted">
  //       {t(
  //         'no_key',
  //         'Explore current building services, and stay tuned for exciting upcoming features soon.',
  //       )}
  //     </Text>
  //   </View>
  // );
};
const CheckPermission = () => {
  return (
    <>
      <Text color="subtitle-muted" weight="regular" size="B1">
        {t(
          'Building__service__List__Description',
          'Easily create service tickets for requesting resolution of any issue you encounter',
        )}
      </Text>
    </>
  );
};

const BuildingServiceScreen = () => {
  return (
    <Screen>
      <Header title="" leftAction="goBack" />
      <ScrollView className="w-full px-5">
        <HeadText
          tagline={t('General__One_bangkok', 'One Bangkok')}
          taglineColor={'vp-pass-date'}
          title={t('General__Building_service', 'Building service')}
          titleSize="H3"
          titleClamps="leading-[26.4]"
        />
        <Spacing height={24} />
        <CheckPermission />

        <Spacing height={24} />
        <ShortCut />
      </ScrollView>
    </Screen>
  );
};

export default BuildingServiceScreen;
