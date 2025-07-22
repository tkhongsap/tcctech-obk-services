import {View} from 'react-native';
import {ScreenContainer} from '../components';
import {Text} from '~/components/atoms';

import {useState} from 'react';
import {StickyButton} from '../components';
import t from '~/utils/text';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';

const UnderDevelopment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<StackNavigation>();

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <View className="bg-[#ffffff] w-full pb-32 flex-1 flex-col justify-center items-center">
          <Text
            size="H2"
            color="dark-gray"
            weight="regular"
            className="text-center w-[300px] leading-[38px]">
            We apologize, this feature is currently under development.
          </Text>
        </View>
      </ScreenContainer>
      <StickyButton
        onPress={() => {
          navigation.goBack();
        }}
        title={t('General__Back_to_explore', 'Back to Explore')}
        rightIcon="next"
        iconWidth={20}
        color="dark-teal"
      />
    </>
  );
};

export default UnderDevelopment;
