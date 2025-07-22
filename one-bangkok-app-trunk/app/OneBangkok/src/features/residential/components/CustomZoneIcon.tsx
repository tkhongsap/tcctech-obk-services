import {View, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms'; 


const CustomZoneIcon = () => {

  return (
    <View className=' bg-[#FFCD29] w-[16px] h-[16px] flex items-center justify-center rounded-[2px]'>
        <Text weight='medium' color='white' className='text-[13px] mt-[-4px]'> 0 </Text>
    </View>

  );
};

export default CustomZoneIcon;
