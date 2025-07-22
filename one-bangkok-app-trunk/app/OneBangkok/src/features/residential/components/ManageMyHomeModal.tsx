import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import {modalActions, useModal} from './ResidentialModal';

const ManageMyHomeModal = () => {
  const onPress = () => {
    modalActions.setContent(<Modal />);
    modalActions.show();
  };
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Icon type={'horizontal'} width={20} height={20} color={'#ddd'} />
      </TouchableOpacity>
    </View>
  );
};

export default ManageMyHomeModal;

const Modal = () => {
  const navigation = useNavigation();
  const [_, modalAction] = useModal();

  const onPressRoomsOrder = () => {
    modalAction.hide();
    navigation.navigate('ResidentialRoomOrder');
  };

  const onPressRename = () => {
    modalAction.hide();
    navigation.navigate('ResidentialRenameScreen');
  };

  return (
    <View className="bg-white w-full h-fit absolute bottom-[-20px] flex flex-col py-[24px] px-[16px]">
      <View className="flex flex-row items-center justify-between mb-[24px]">
        <TouchableOpacity onPress={() => modalAction.hide()}>
          <Text className="text-[16px] font-[400] text-[#068EFF]">Cancel</Text>
        </TouchableOpacity>

        <Text className="text-[16px] font-[500] text-[#292929]">Options</Text>
        <TouchableOpacity onPress={() => modalAction.hide()}>
          <Text className="text-[16px] font-[400] text-[#068EFF]">Done</Text>
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity className="p-[16px] flex flex-row items-center border-[1px] border-[#DCDCDC] mb-[12px]" onPress={onPressRename}>
        <Icon type={'homeEdit'} width={24} height={24} color={'#ddd'} />
        <Text className="text-[16px] font-[400] text-[#292929] ml-[12px]">
          Rename
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        className="p-[16px] flex flex-row items-center border-[1px] border-[#DCDCDC] mb-[12px]"
        onPress={onPressRoomsOrder}>
        <Icon type={'sort'} width={24} height={24} color={'#ddd'} />
        <Text className="text-[16px] font-[400] text-[#292929] ml-[12px]">
          Rooms order
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity className="p-[16px] flex flex-row items-center border-[1px] border-[#DCDCDC] mb-[12px]">
        <Icon
          type={'serviceRequestIcon'}
          width={24}
          height={24}
          color={'#ddd'}
        />
        <Text className="text-[16px] font-[400] text-[#292929] ml-[12px]">
          Home Information
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};
