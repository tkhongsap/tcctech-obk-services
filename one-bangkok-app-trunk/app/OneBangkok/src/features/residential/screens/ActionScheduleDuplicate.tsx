import {View} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text} from '~/components/atoms';
import InputSearch from '../components/InputSearch';

const ActionScheduleDuplicate = () => {
  return (
    <ScreenContainer bgColor={'#1A1919'} barStyle="light-content">
      <Header
        leftAction="goBack"
        title="Duplicate schedule"
        bgColor="bg-jet-black"
        titleColor="white"
        leftColor="white"
      />
      <View className="bg-[#ffffff] h-[100vh]  w-full pt-10">
        <InputSearch />
      </View>
      <View className="flex flex-row items-center h-[48px] w-full bg-[#014541] px-4 justify-between absolute left-0 bottom-0">
        <Text size="B1" weight="medium" color="default-inverse">
          Duplicate schedule
        </Text>
        <Icon type={'next'} width={20} height={20} color={'#fff'} />
      </View>
    </ScreenContainer>
  );
};

export default ActionScheduleDuplicate;
