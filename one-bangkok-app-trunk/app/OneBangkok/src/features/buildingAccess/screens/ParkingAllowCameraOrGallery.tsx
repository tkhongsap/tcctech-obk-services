import React from 'react';
import t from '~/utils/text';
import {View} from 'react-native';
import {Screen} from '~/components/templates';
import {Header, HeadText, StickyButton} from '~/components/molecules';
import {Icon, IconType, Spacing, Text} from '~/components/atoms';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import getTheme from '~/utils/themes/themeUtils';
import {alertTypeAction} from '../store/permissionAlert';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ParkingAllowCameraOrGallery'
>;

const RenderContent = ({type}: {type: 'gallery' | 'camera'}) => {
  const content = {
    camera: {
      icon: 'camera',
      header: t('Announcement__Enable_camera__Title', 'Enable Camera'),
      subHeader: t('General__Camera_not_allowed', 'Camera is not allowed.'),
      description: t(
        'General__Please_allow_to_use_camera',
        'Please allow One Bangkok app to use camera.',
      ),
    },
    gallery: {
      icon: 'gallery',
      header: t(
        'General__Allow_library_access',
        'Allow Access to Photo Library',
      ),
      subHeader: t(
        'General__Library_not_allowed',
        'Photo library access is not allowed',
      ),
      description: t(
        'General__Please_allow_to_use_photo_library',
        'Please allow One Bangkok app to access your photo library.',
      ),
    },
  };
  return (
    <View className="flex flex-col items-center justify-center">
      <Icon type={content[type].icon as IconType} width={48} height={48} />
      <Text weight="bold" size="N1">
        {content[type].header}
      </Text>
      <Spacing height={3} />
      <Text
        weight="regular"
        size="B1"
        className={getTheme('text-center text-subtitle-muted')}>
        {content[type].subHeader}
      </Text>
      <Text
        weight="regular"
        size="B1"
        className={getTheme('text-center text-subtitle-muted')}>
        {content[type].description}
      </Text>
    </View>
  );
};

const ParkingAllowCameraOrGallery = ({
  route: {
    params: {type},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();

  const handleLeftAction = () => {
    alertTypeAction.reset();
    navigation.goBack();
  };

  const handleAllow = () => {
    alertTypeAction.set(type);
    alertTypeAction.setAllReceiptType(type);
    navigation.goBack();
  };

  return (
    <Screen>
      <Header leftAction="goBack" onPressLeftAction={handleLeftAction} />
      <View className="flex-1 px-3">
        <HeadText
          taglineColor="muted"
          tagline={t('General__One_bangkok', 'One Bangkok')}
          title={t('General__My_parking_ticket', 'My Parking Ticket')}
        />
        <View className="flex-1 flex items-center justify-center">
          <RenderContent type={type} />
        </View>
      </View>
      <StickyButton
        title={t('General__Allow_now', 'Allow now')}
        rightIcon="next"
        iconHeight={25}
        iconWidth={25}
        onPress={handleAllow}
      />
    </Screen>
  );
};

export default ParkingAllowCameraOrGallery;
