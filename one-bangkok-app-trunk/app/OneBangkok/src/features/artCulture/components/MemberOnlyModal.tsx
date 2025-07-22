import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, View} from 'react-native';
import {Text} from '~/components/atoms';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';

interface IMemberOnlyModal {
  onClose: () => void;
}

const MemberOnlyModal = ({onClose}: IMemberOnlyModal) => {
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;

  return (
    <View className="absolute w-full h-screen top-0 left-0 z-50">
      <Pressable
        className="w-full h-full absolute top-0 left-0"
        style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        onPress={() => onClose()}
      />
      <View className="bg-white absolute top-1/2 left-[5%] w-[90%] mx-auto h-[190px] -mt-[80px] rounded-lg p-4 flex flex-col justify-between">
        <Text className="text-lg font-bold text-center capitalize">
          {t('For_Member_Only', 'For Member Only Please Sign In')}
        </Text>
        <Text className="pt-2 text-base text-center">
          {t(
            'Please_Sign_In_To_Use_Bookmark',
            'Please sign in or sign up to bookmark this content.',
          )}
        </Text>
        <View className="flex flex-row justify-center pt-6 w-full">
          <View className="w-1/2 pr-2">
            <Pressable
              className="w-full bg-muted-50-light border border-line-light py-3 px-4"
              onPress={() => onClose()}>
              <Text className="text-center font-obMedium">
                {t('Close', 'Close')}
              </Text>
            </Pressable>
          </View>

          <View className="w-1/2 pl-2">
            <Pressable
              className="w-full bg-white border border-jet-black-light py-3 px-4"
              onPress={() => {
                onClose();
                navigation.push('SignInScreen');
              }}>
              <Text className="text-center font-obMedium">
                {t('Sign_In', 'Sign In')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MemberOnlyModal;
