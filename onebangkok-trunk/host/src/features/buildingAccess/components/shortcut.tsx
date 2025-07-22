import {View} from 'react-native';
import React from 'react';
import getTheme from '~/utils/themes/themeUtils';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import {Button, modalActions} from '~/components/molecules';
import {memberState} from '~/features/buildingAccess/store/member';

interface ShortCutInterface {
  isFsMember: boolean;
}

const FsMemberResultCard = (props: ShortCutInterface) => {
  const {isFsMember} = props;
  const navigation = useNavigation();

  if (isFsMember) {
    return (
      <>
        <View className={`px-5 ${getTheme('bg-light-gray')}`}>
          <Spacing height={24} />
          <Button
            title={t('General__Calling_elevator', 'Calling Elevator')}
            color="light-gray"
            rounded={false}
            leftIcon="elevator"
            buttonHeight={55}
            ghost
            rightIcon="arrowRightIcon"
            onPress={() => navigation.navigate('CallElevatorScreen')}
          />
          <Spacing height={12} />
          {memberState.can_preregister.value && (
            <Button
              title={t('General__Create_visitor_pass', 'Create Visitor Pass')}
              color="light-gray"
              rounded={false}
              leftIcon="createVisitorPassIcon"
              rightIcon="arrowRightIcon"
              ghost
              buttonHeight={55}
              onPress={() => navigation.navigate('VisitorPassScreen')}
            />
          )}
          <Spacing height={12} />
          <Button
            title={t('General__Smart_parking', 'Smart Parking')}
            color="light-gray"
            rounded={false}
            leftIcon={'smartParkingIcon'}
            rightIcon="arrowRightIcon"
            ghost
            onPress={() => {
              navigation.navigate('SmartParkingScreen');
            }}
          />
          <Spacing height={40} />
        </View>
      </>
    );
  }
};

const ShortCut = (props: ShortCutInterface) => {
  const {isFsMember} = props;
  return <FsMemberResultCard isFsMember={isFsMember} />;
};

export default ShortCut;
