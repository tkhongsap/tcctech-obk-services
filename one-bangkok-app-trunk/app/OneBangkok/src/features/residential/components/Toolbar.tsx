import React from 'react';
import { View} from 'react-native';
import {Icon} from '~/components/atoms';

const Toolbar = () => {
  return (
    <View className="flex w-full  top-[0px] left-[0px] z-[99]">
        <View className="p-4 bg-transparent flex flex-row justify-center ">
          <Icon type={'obLogoIcon'} height={22} width={136} color={'#111'} />
        </View>
      </View>
  )
}
  
  export default Toolbar;
