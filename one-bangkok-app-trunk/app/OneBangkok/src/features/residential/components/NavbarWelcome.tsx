import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '~/components/atoms';
import {modalActions} from './ResidentialModal';
import NavbarModal from './NavbarModal';

const NavbarWelcome = () => {
  const onPressHamburger = () => {
    modalActions.setContent(<NavbarModal />);
    modalActions.setStates({
      animationIn: 'slideInLeft',
      animationOut: 'slideOutLeft',
      className: 'm-0',
    });
    modalActions.show();
  };

  return (
    <View className="flex w-full absolute top-[0px] left-[0px] z-[99]">
      <View className="p-4 bg-transparent flex flex-row justify-between ">
        <View className="flex flex-row">
          <TouchableOpacity onPress={onPressHamburger}>
            <Icon type={'menu'} width={22} height={22} color={'#fff'} />
          </TouchableOpacity>

          <Icon type={'obLogoIcon'} height={22} width={136} color={'#fff'} />
        </View>

        <View className="flex flex-row w-[53px] justify-between items-center">
          <Icon type={'qrCode'} height={22} width={22} color={'#fff'} />
          <Icon type={'bell'} height={22} width={22} color={'#fff'} />
        </View>
      </View>
    </View>
  );
};

export default NavbarWelcome;
