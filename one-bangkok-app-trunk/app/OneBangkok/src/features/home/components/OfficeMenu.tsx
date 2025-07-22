/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import {activeOpacity} from '~/constants';
import {compact} from 'lodash';
import {memberAction, memberState} from '../../residential/store/member';
import firebaseConfigState from '~/states/firebase';
import {usePermission} from '~/utils/permission';
import {useModal} from '~/components/molecules';
import {EmergencyContactDrawer} from '~/features/buildingAccess/components/EmergencyContactDrawer';
import {SosContactDrawer} from '~/features/buildingAccess/components/SosContactDrawer';
import {logScreenView} from '~/utils/logGA';

type Props = {
  closeDrawer: () => void;
  scrollToBottom: () => void;
};

const OfficeMenu = ({closeDrawer, scrollToBottom}: Props) => {
  const navigation = useNavigation();

  const [isOpen, setisOpen] = useState(false);

  const {permissionList} = usePermission();
  const [_modalState, modalActions] = useModal();
  const closeModal = () => modalActions.hide();

  const [isFsMember, setIsFsMember] = useState(false);

  const getMemberId = useCallback(async () => {
    const result = await memberAction.getMemberId();
    setIsFsMember(result);
  }, []);

  useEffect(() => {
    getMemberId();
  }, [getMemberId]);

  const checkPermission = () => {
    const isServiceRequestAccess =
      permissionList.canDoServiceRequest &&
      firebaseConfigState.enable_building_service.service_request.value;
    const isAcRequestAccess =
      permissionList.canDoACRequest &&
      firebaseConfigState.enable_building_service.air_conditioner_request.value;
    const isRedemptionAccess =
      memberState.redemption.value &&
      firebaseConfigState.enable_building_service.parking_redemption;

    if (isServiceRequestAccess || isAcRequestAccess || isRedemptionAccess) {
      return navigation.navigate('BuildingServiceScreen');
    } else {
      return navigation.navigate('AnnouncementContactScreen', {
        titleHeadText: t('General__Building_service', 'Building service'),
        tagline: t('General__One_bangkok', 'One Bangkok'),
        titleContent: t('Service__No_service__Header', 'Restricted access'),
        messageContent: t(
          'No_service__Description',
          'It seems you don’t currently have the permissions to request services. If you’d like to utilize this service, please contact our Building Management',
        ),
        type: 'unavailable',
      });
    }
  };

  const handleOnEmergencyContact = () => {
    closeDrawer();
    modalActions.setContent(<EmergencyContactDrawer onClose={closeModal} />);
    modalActions.show();
  };

  const handleOnSOSContact = () => {
    closeDrawer();
    modalActions.setContent(<SosContactDrawer onClose={closeModal} />);
    modalActions.show();
  };

  const drawerOfficeMenu = compact([
    {
      name: t('General__Home', 'Home'),
      iconName: 'mcPressAndMedia',
      onPress: () => {
        navigation.navigate('HomeScreen');
        closeDrawer();
      },
    },
    {
      name: t('General__Call_elevator', 'Call elevator'),
      iconName: 'elevator',
      onPress: () => {
        navigation.navigate('CallElevatorScreen');
      },
    },
    memberState.can_preregister.value && {
      name: t('General__Create_visitor_pass', 'Create visitor pass'),
      iconName: 'legal',
      onPress: () => {
        navigation.navigate('VisitorPassScreen');
      },
    },
    firebaseConfigState.enable_building_service_homescreen_and_menu.value && {
      name: t('General__Building_request', 'Building Request'),
      iconName: 'legal',
      onPress: () => {
        checkPermission();
      },
    },
    {
      name: t('General__Directory_contact', 'Directory Contact'),
      iconName: 'cog',
      onPress: () => {
        navigation.navigate('DirectoryContact');
      },
    },
    {
      name: t('General__Personal_escort', 'Personal Escort'),
      iconName: 'cog',
      onPress: () => {
        logScreenView('Personal Escort');
        handleOnEmergencyContact();
        closeDrawer();
      },
    },
    // {
    //   name: t('General__Sos', 'SOS'),
    //   iconName: 'sos',
    //   onPress: () => {
    //     handleOnSOSContact();
    //     closeDrawer();
    //   },
    // },
  ]).filter(item => item !== false);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, scrollToBottom]);

  return isFsMember ? (
    <View>
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={() => setisOpen(prev => !prev)}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text weight="medium" size="H3">
            {t('BU_Workplace', 'Workplace')}
          </Text>
        </View>
      </TouchableOpacity>
      <View>
        <FlatList
          scrollEnabled={false}
          data={drawerOfficeMenu}
          extraData={drawerOfficeMenu}
          renderItem={item => {
            return (
              <>
                <View
                  style={{
                    backgroundColor: item.item.name.includes('SOS')
                      ? '#fff3f1'
                      : 'white',
                  }}
                  className="py-4 border-b border-gray-300 justify-center"
                  key={`${item.item.name}`}>
                  <TouchableOpacity
                    testID="drawer-settings-id"
                    activeOpacity={activeOpacity}
                    onPress={item.item.onPress}>
                    <View className="flex flex-row items-center">
                      <Icon
                        type={item.item.iconName}
                        width={20}
                        height={20}
                        color={item.item.name.includes('SOS') ? '#852425' : ''}
                      />
                      <Spacing width={12} />
                      <Text
                        size="H4"
                        color={
                          item.item.name.includes('SOS')
                            ? 'dark-red'
                            : 'dark-gray'
                        }>
                        {item.item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            );
          }}
        />
        <Spacing height={32} />
      </View>
    </View>
  ) : null;
};

export default OfficeMenu;
