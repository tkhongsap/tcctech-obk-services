/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {Icon, IconProps, IconType, Text} from '~/components/atoms';
import {activeOpacity} from '~/constants';
// import authenState from '~/states/authen/authenState';
// import {isEmpty} from 'lodash';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {residentialPersonaActive} from '~/states/residentialTenant/residentialTenantState';
import authenState from '~/states/authen/authenState';
import firebaseConfigState from '~/states/firebase';
import {useAuthorization} from '~/hooks/useAuthorization';

export interface IconButtonProps extends IconProps {
  onPress?: (key: string) => void; // Pass a key as a parameter
}

interface MenuItemProps {
  key: string;
  label: string;
  iconType: IconType;
  onPress: () => void;
}
type MenuItemList = Omit<MenuItemProps, 'onPress'>;

const MenuItem: React.FC<MenuItemProps> = ({label, iconType, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-end space-x-2 mb-4"
    accessible={true}
    accessibilityLabel={label}>
    <Text color="white" weight="regular" size="B1">
      {t('General__Floating_menu_' + label, label)}
    </Text>
    <View className="w-[60px] h-[60px] bg-[#FFFFFF] p-2 rounded-full flex items-center justify-center">
      <Icon type={iconType} width={16} height={16} color="#1A1919" />
    </View>
  </TouchableOpacity>
);

export const FloatingStickyMenu: React.FC<IconButtonProps> = ({}) => {
  // if (isEmpty(authenState.token.value)) {
  //   return null;
  // }
  const navigation = useNavigation();
  const currentLanguage = appLanguageState.currentLanguage.get();

  const [isMenuVisible, setMenuVisible] = useState(false);
  const enableMarcomMainPage = firebaseConfigState.enable_marcom_mainpage.value;
  const enableSustainability = firebaseConfigState.enable_sustainability.value;
  const enableResidential =
    firebaseConfigState.enable_residential.value || false;
  const enableArtCulture = firebaseConfigState.enable_art_culture.value;
  const {checkPermission} = useAuthorization();

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };
  const onActionPress = (key: string) => {
    switch (key) {
      case 'pressAndMedia':
        navigation.navigate('MainPageScreen');
        break;
      case 'work':
        navigation.navigate('HomeScreen');
        break;
      case 'qrCode':
        navigation.navigate('BuildingAccessQrScreen');
        break;
      case 'residential':
        navigation.navigate('ResidentialHomeScreen');
        break;
      case 'art':
        navigation.navigate('ArtCultureLandingScreen');
        break;
      case 'sustainability':
        navigation.navigate('SustainabilityScreen');
        break;
    }

    setMenuVisible(!isMenuVisible);
  };

  const menuItems: MenuItemList[] = [
    // switch future marcom
    {
      key: 'pressAndMedia',
      label: t('BU_Press_And_Media', 'Home'),
      iconType: 'scHomeDarkIcon',
    },
    {
      key: 'work',
      label: t('BU_Workplace', 'Workplace'),
      iconType: 'scWorkIcon',
    },
    {
      key: 'residential',
      label: t('BU_Residential', 'Residences'),
      iconType: 'scSleepBedIcon',
    },
    {
      key: 'art',
      label: t('BU_Art_and_Culture', 'Art & Culture'),
      iconType: 'scArtCIcon',
    },
    {
      key: 'sustainability',
      label: t('BU_Sustain', 'Sustainability & Smart City'),
      iconType: 'scSustainIcon',
    },
    {key: 'qrCode', label: t('Mc_QRCode', 'QR Code'), iconType: 'qrCode'},
  ];

  const [menus, setMenus] = useState<MenuItemList[]>(menuItems);

  const validateEnableFuture = () => {
    let arrMenu = menuItems;

    if (!checkPermission('view', 'Workspace')) {
      arrMenu = arrMenu.filter(e => e.key !== 'work');
    }

    if (!enableMarcomMainPage) {
      arrMenu = arrMenu.filter(e => e.key !== 'pressAndMedia');
    }

    if (!enableSustainability) {
      arrMenu = arrMenu.filter(e => e.key !== 'sustainability');
    }

    if (!enableArtCulture) {
      arrMenu = arrMenu.filter(e => e.key !== 'art');
    }

    if (!enableResidential || !residentialPersonaActive.get()) {
      arrMenu = arrMenu.filter(e => e.key !== 'residential');
    }

    if (
      !checkPermission('view', 'Workspace') &&
      (!enableResidential || !residentialPersonaActive.get())
    ) {
      arrMenu = arrMenu.filter(e => e.key !== 'qrCode');
    }

    setMenus(arrMenu);
  };

  useEffect(() => {
    validateEnableFuture();
  }, [
    currentLanguage,
    authenState,
    isMenuVisible,
    enableMarcomMainPage,
    enableSustainability,
    enableArtCulture,
    enableResidential,
    residentialPersonaActive.get(),
    isMenuVisible,
  ]);

  return (
    <>
      {/* Button to show/hide menu */}
      {!isMenuVisible && (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={toggleMenu} // Toggle the menu visibility
          className="absolute bottom-8 right-5"
          accessible={true}
          accessibilityLabel="Open Menu">
          <View className="w-[60px] h-[60px] border border-[#FDFDFD] rounded-full bg-[#111] flex items-center justify-center shadow-md">
            <Icon type="obNewIcon" width={24} height={24} color="white" />
          </View>
        </TouchableOpacity>
      )}

      {/* Floating menu inside a Modal */}
      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="fade"
        onRequestClose={toggleMenu}>
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu}>
          <View className="absolute bottom-24 right-5 flex-col items-end space-x-6">
            {menus.map(item => (
              <MenuItem
                key={item.key}
                label={item.label}
                iconType={item.iconType}
                onPress={() => onActionPress(item.key)}
              />
            ))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={toggleMenu} // Toggle the menu visibility
          className="absolute bottom-8 right-5"
          accessible={true}
          accessibilityLabel="Close Menu">
          <View className="w-[60px] h-[60px] border border-[#FDFDFD] rounded-full bg-[#111] flex items-center justify-center shadow-md">
            <Icon type="close" width={24} height={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly darker semi-transparent background
  },
});

export default FloatingStickyMenu;
