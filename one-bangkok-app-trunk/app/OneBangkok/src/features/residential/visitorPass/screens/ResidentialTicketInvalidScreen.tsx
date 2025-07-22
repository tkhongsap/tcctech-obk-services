import React from 'react';
import {View} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import {ScreenContainer, StickyButton} from '../../components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialTicketInvalidScreen'
>;

const ResidentialTicketInvalidScreen = ({
  route: {
    params: {description},
  },
}: Props) => {
  const navigation = useNavigation();

  return (
    <>
      <ScreenContainer
        className="w-full bg-white"
        bgColor="#ffffff"
        barStyle="dark-content">
        <View className="flex flex-col items-center pt-[35vh] h-screen px-4">
          <Icon type="close" width={48} height={48} />
          <Spacing height={14} />
          <Text className="text-center" weight="medium" size="H2">
            {t(
              'Residential__Redemption_Car_Park__Ticket_invalid_title',
              'Ticket Invalid',
            )}
          </Text>
          <Text className="text-center w-[343px]" color="dark-gray">
            {description}
          </Text>
        </View>
      </ScreenContainer>
      <StickyButton
        title={t('General__Back_to_explore', 'Back to Explore')}
        className="bg-dark-teal-dark"
        rightIcon="next"
        iconHeight={20}
        iconWidth={20}
        onPress={() => navigation.navigate('ResidentialVisitorPassHomeScreen')}
      />
    </>
  );
};

export default ResidentialTicketInvalidScreen;
