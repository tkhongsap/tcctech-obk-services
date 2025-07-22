import {View, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {ScreenContainer} from '../components/ScreenContainer';
import {Icon, Text, Spacing} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';

const SceneSuccessfulScreen = () => {
  const navigation = useNavigation();

  return (
    <ScreenContainer bgColor={'#fff'} barStyle={'dark-content'}>
      <ScrollView className="w-full bg-white p-4 py-10 " style={{gap: 12}}>
        <View className="flex flex-col pt-40 justify-start items-start">
          <Icon type={'checkedIcon'} width={40} height={40} color={'#22973F'} />
          <Spacing height={12} />
          <Text size="H2" weight="medium" className="text-kelly-green-light">
            Scenario successfully configured and will be ready in a few minutes.
          </Text>
          <Spacing height={4} />
          <Text size="B1" weight="regular" color="dark-gray">
            Your scenario will be ready to use in a few minutes
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('ScenesScreen')}
        className="w-full flex-row bg-dark-teal-light p-4 justify-between">
        <Text size="B1" weight="medium" color="white">
          I get it!
        </Text>
        <Icon type={'next'} width={20} height={20} color={'#fff'} />
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default SceneSuccessfulScreen;
