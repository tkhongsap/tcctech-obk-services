import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '~/navigations/AppNavigation';
import getTheme from '~/utils/themes/themeUtils';
import IconArrowRight from '../../../assets/icons/icon-ob-arrow-right.svg';
import IconMock from '../../../assets/icons/icon-ob-mock.svg';
import {Icon, Text} from '~/components/atoms';
import {useModal} from './ResidentialModal';
import {phoneCall} from '../utils/phoneCall';
import t from '~/utils/text';
import firebaseConfigState from '~/states/firebase';

export type Service = {
  icon: string;
  name: string;
  type: string;
  data: {
    phoneNumber?: string;
    unreadMsgCount?: string;
  };
  chatAvatar: {
    id: string;
    entityId: string;
    entityType: string;
    s3Url: string;
    title: string;
    name: string;
    isActive: boolean;
    orgId: number;
    s3Path: string;
    record_id: string;
    source_rid: string;
    refImageUrl: string;
  };
};

const getUniqueDataByType = (data: Service[]): Service[] => {
  const uniqueMap = new Map<string, Service>();
  data.forEach(item => {
    if (!uniqueMap.has(item.type)) {
      uniqueMap.set(item.type, item);
    }
  });
  return Array.from(uniqueMap.values());
};

export const Services = ({services}: {services: Service[]}) => {
  const uniqueServices = getUniqueDataByType(services);
  const navigation = useNavigation();
  const enableConcierge =
    firebaseConfigState.enable_residential_contact_concierge.value || false;
  const enableBillAndPayment =
    firebaseConfigState.enable_residential_bill_and_payment.value || false;
  const enableLiveChat =
    firebaseConfigState.enable_residential_live_chat.value || false;
  const enableServiceRequest =
    firebaseConfigState.enable_residential_service_request.value || false;
  const enableMaintenanceRepair =
    firebaseConfigState.enable_residential_maintenance_and_repair.value ||
    false;

  const getServiceNavigateRoute = (service: Service) => {
    switch (service.type) {
      case 'concierge':
        return enableConcierge
          ? phoneCall(service.data?.phoneNumber ?? '')
          : navigation.navigate('RestrictedAccessScreen', {
              title: service.name,
            });
      case 'maintenanceRepair':
        return enableMaintenanceRepair
          ? navigation.navigate('ResidentialMaintenanceScreen')
          : navigation.navigate('RestrictedAccessScreen', {
              title: service.name,
            });
      case 'facilityBooking':
        return navigation.navigate('RestrictedAccessScreen', {
          title: service.name,
        });
      case 'sos':
        return navigation.navigate('EmergencyScreen', {
          phone: service.data?.phoneNumber ?? '',
        });
      case 'serviceRequest':
        return enableServiceRequest
          ? navigation.navigate('ServiceRequestHomeScreen')
          : navigation.navigate('RestrictedAccessScreen', {
              title: service.name,
            });
      case 'chat':
        return enableLiveChat
          ? navigation.navigate('ResidentialLiveChatScreen', {
              conciergeAvatar: service?.chatAvatar?.s3Url ?? '',
            })
          : navigation.navigate('RestrictedAccessScreen', {
              title: service.name,
            });
      case 'billPayments':
        return enableBillAndPayment
          ? navigation.navigate('ResidentialVisitorPassHomeScreen')
          : navigation.navigate('RestrictedAccessScreen', {
              title: service.name,
            });
      default:
        return navigation.navigate('RestrictedAccessScreen', {
          title: service.name,
        });
    }
  };

  const getIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'concierge':
        return <Icon type="phoneIcon" width={18} height={18} />;
      case 'maintenanceRepair':
        return <Icon type="svMaintenanceIcon" width={18} height={18} />;
      case 'serviceRequest':
        return <Icon type="svRequestIcon" width={18} height={18} />;
      case 'chat':
        return <Icon type="svLiveIcon" width={18} height={18} />;
      case 'billPayments':
        return <Icon type="svBillIcon" width={18} height={18} />;
      default:
        return (
          <IconMock
            color={serviceType === 'sos' ? '#FFFFFF' : '#000000'}
            width="18"
            height="18"
          />
        );
    }
  };

  const isNotZeroString = (value?: string) => {
    try {
      if (!value) return false;
      const num = parseInt(value);
      return num > 0;
    } catch (error) {
      return false;
    }
  };

  const displayUnreadMsgCount = (count?: string) => {
    try {
      if (!count) return 0;
      const countNumber = parseInt(count);
      if (countNumber > 99) return '99+';
      return countNumber;
    } catch (error) {
      return 0;
    }
  };

  return (
    <View className={'flex-1 flex-col py-5 h-full'}>
      <View className="flex-1 flex-col px-4">
        <Text size="H4" color="default" weight="medium">
          {t('Residential__Home__Services', 'Services')}
        </Text>
        <View className={'flex-1 flex-col mt-4'}>
          {uniqueServices.map(service => (
            <TouchableOpacity
              key={service.type}
              className={`flex flex-row justify-between items-center p-[10px] mt-1 
                ${service.type === 'sos' ? 'bg-[#842525]' : 'bg-[#F4F6F7]'}`}
              onPress={() => getServiceNavigateRoute(service)}>
              <View className={'flex flex-row items-center'}>
                {getIcon(service.type)}
                <Text
                  className={getTheme(
                    `text-${
                      service.type === 'sos' ? 'white' : 'dark-gray'
                    } text-sm ml-1`,
                  )}>
                  {service.name}
                </Text>
                {isNotZeroString(service.data.unreadMsgCount) && (
                  <View className="rounded-[2px] bg-dark-teal-dark p-[2px] flex items-center justify-center min-w-[29px] ml-[8px]">
                    <Text size="C1" color="white">
                      {displayUnreadMsgCount(service.data.unreadMsgCount)}
                    </Text>
                  </View>
                )}
              </View>
              <IconArrowRight
                color={service.type === 'sos' ? '#FFFFFF' : '#000000'}
                width="15"
                height="15"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const ConciergeModal = () => {
  const [_, modalAction] = useModal();

  return (
    <View className="bg-white py-6 px-4 w-full h-fit absolute bottom-0">
      <View className="flex-row w-full justify-between pb-1">
        <Text color="dark-gray" weight="bold">
          Contact Concierge
        </Text>
      </View>
      <Text className="text-[16px] text-[#7C7C7C] font-[400]">
        If you need assistance, please feel free to contact our concierge
      </Text>

      <View className="mt-6">
        <TouchableOpacity className="px-4 border flex flex-col border-line-light w-full  mb-3">
          <View className="py-4 flex flex-row gap-x-1 items-center">
            <Icon
              type={'LiveChatIcon'}
              width={16}
              height={16}
              color={'#292929'}
            />
            <Text className="text-dark-gray-light mt-2 font-medium m-0">
              Live Chat
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="px-4 border flex flex-col border-line-light w-full mb-3">
          <View className="py-4 flex flex-row gap-x-1 items-center">
            <Icon type={'phoneIcon'} width={16} height={16} color={'#292929'} />
            <Text className="text-dark-gray-light mt-2 font-medium m-0">
              +66(0)2 483 5555
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 border flex flex-col border-fire-engine-red-light w-full mb-3"
          onPress={() => modalAction.hide()}>
          <View className="py-4 flex flex-row justify-center items-center">
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-fire-engine-red-light mt-2 text-center font-medium m-0">
                Cancel
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
