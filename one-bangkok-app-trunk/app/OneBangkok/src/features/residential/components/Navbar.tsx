import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '~/components/atoms';
import {modalActions} from './ResidentialModal';
import NavbarModal from './NavbarModal';

const Navbar = () => {
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
    <View className="flex w-full">
      <View className="p-4 bg-jet-black-light flex flex-row justify-between ">
        <View className="flex flex-row">
          <TouchableOpacity onPress={onPressHamburger}>
            <Icon type={'menu'} width={22} height={22} color={'#bdbdbd'} />
          </TouchableOpacity>

          <Icon type={'obLogoIcon'} height={22} width={136} color={'#fff'} />
        </View>

        <View className="flex ">
          <Icon type={'bell'} height={22} width={22} color={'#bdbdbd'} />
        </View>
      </View>
    </View>
  );
};

export default Navbar;
