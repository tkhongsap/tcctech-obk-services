import {View, TouchableOpacity} from 'react-native';
import {ScreenContainer} from '../components';
import {Icon, Spacing, Text} from '~/components/atoms';
import {HeadText} from '~/components/molecules';
import t from '~/utils/text';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Header} from '../components/Header';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {phoneCall} from '../utils/phoneCall';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'RestrictedAccessScreen'
>;

const RestrictedAccessScreen = ({
  route: {
    params: {title},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const phone =
        await residentialTenantAction.getContactConciergePhoneNumber();
      setPhoneNumber(phone);
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const onPressContactConcierge = async () => {
    try {
      setIsLoading(true);
      if (phoneNumber) await phoneCall(phoneNumber);
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'RestrictedAccessScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('RestrictedAccessScreen', {title}),
    });
  };

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={isLoading}>
      <View className="w-full bg-white flex">
        <Header leftAction="goBack" titleColor="dark-gray" bgColor="bg-white" />
        <Spacing height={8} />
        <View className="px-5">
          <HeadText
            tagline={t('General__Residential', 'Residences')}
            title={title}
            titleColor="default"
            taglineColor="subtitle-muted"
            descriptionColor="subtitle-muted"
            descriptionSpacing={16}
            titleClamps="leading-[44px]"
          />
        </View>
      </View>
      <View className="w-full px-5 grow flex flex-col items-center justify-center space-y-10">
        <View className="flex flex-col items-center">
          <Icon
            type="RestrictedIcon"
            width={44}
            height={52.59}
            color="#000000"
          />
          <Text size="H3" color="default" weight="bold" className="text-center">
            {t('Service__No_service__Header', 'Restricted access')}
          </Text>
          <Text size="B1" color="muted" className="text-center">
            {t(
              'Restricted_access__Description',
              'This feature is currently unavailable.\nIf you wish to access this service,\nplease feel free to contact our\nconcierge for assistance',
            )}
          </Text>
        </View>
        <TouchableOpacity
          className="w-full h-[48px] border border-light-silver-light flex flex-row items-center justify-center space-x-3"
          disabled={isLoading}
          onPress={onPressContactConcierge}>
          <Icon type="phoneIcon" width={20} height={20} color="#292929" />
          <Text size="B1" color="dark-gray">
            {t('Residential__Contact_concierge', 'Contact Concierge')}
          </Text>
        </TouchableOpacity>
        <Spacing height={100} />
      </View>
    </ScreenContainer>
  );
};

export default RestrictedAccessScreen;
