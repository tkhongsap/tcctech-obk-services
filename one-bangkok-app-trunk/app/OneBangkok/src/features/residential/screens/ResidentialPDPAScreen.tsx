import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {useNavigation} from '~/navigations/AppNavigation';
import {Header} from '../components/Header';
import {Spacing} from '~/components/atoms';
import {ScreenContainer} from '../components/ScreenContainer';

type PDPA = {
  id: string;
  version: string;
  title: string;
  pdpa: string;
};

const ResidentialPDPAScreen = () => {
  const navigation = useNavigation();
  const [pdpa, setPDPA] = useState<PDPA>();

  const getPDPA = async () => {
  };

  useEffect(() => {
    getPDPA().catch(e => {});
  }, []);

  useEffect(() => {
    const unauthorizedListener = serviceMindService.eventEmitter.addListener(
      'unauthorized',
      async () => {
        navigation.reset({routes: [{name: 'ResidentialWelcomeScreen'}]});
      },
    );
    return () => {
      unauthorizedListener.remove();
    };
  }, [navigation]);

  const acceptPDPA = async () => {
    console.log('acceptPDPA: ', pdpa?.title);
  };

  return (
    <ScreenContainer bgColor={'#FFFFFF'} barStyle={'dark-content'}>
      <View className="w-full h-full bg-[#FFFFFF]">
        <Header
          leftAction="goBack"
          rightAction="switchLanguage"
          title="Privacy Policy"
        />
        <ScrollView className="px-[16px] pt-[24px] pb-[40px] w-full bg-white">
          <Text className="text-[28px] text-[#292929] font-[500] leading-[30.8px]">
            Privacy policy
          </Text>
          <Spacing height={24} />
          <View>
            <Text className="text-[24px] text-[#292929] font-[500] leading-[30.8px]">
              1.Introduction
            </Text>
            <Spacing height={16} />
            <Text className="text-[16px] text-[#7C7C7C] font-[400] leading-[30.8px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              interdum, purus quis venenatis viverra, erat metus porttitor quam,
              quis feugiat dui nunc eu eros. Maecenas condimentum rhoncus
              tempus. Quisque auctor finibus elit, ac vestibulum enim lacinia
              eget. Nullam vulputate, ex nec faucibus pharetra, nisi erat varius
              mauris, in auctor elit lacus vitae eros. Fusce tristique aliquet
              porta. Donec elementum nisl sapien, non pharetra purus iaculis
              quis. Integer mattis id nunc quis porttitor. Nulla fringilla
              mauris placerat nulla pretium, eget placerat ante fermentum.
            </Text>
          </View>
          <Spacing height={40} />
          <View>
            <Text className="text-[24px] text-[#292929] font-[500] leading-[30.8px]">
              2.Application scope
            </Text>
            <Spacing height={16} />
            <Text className="text-[16px] text-[#7C7C7C] font-[400] leading-[30.8px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              interdum, purus quis venenatis viverra, erat metus porttitor quam,
              quis feugiat dui nunc eu eros. Maecenas condimentum rhoncus
              tempus. Quisque auctor finibus elit, ac vestibulum enim lacinia
              eget. Nullam vulputate, ex nec faucibus pharetra, nisi erat varius
              mauris, in auctor elit lacus vitae eros. Fusce tristique aliquet
              porta. Donec elementum nisl sapien, non pharetra purus iaculis
              quis. Integer mattis id nunc quis porttitor. Nulla fringilla
              mauris placerat nulla pretium, eget placerat ante fermentum.
            </Text>
          </View>
          <Spacing height={40} />
          <View>
            <Text className="text-[24px] text-[#292929] font-[500] leading-[30.8px]">
              2.Application scope
            </Text>
            <Spacing height={16} />
            <Text className="text-[16px] text-[#7C7C7C] font-[400] leading-[30.8px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              interdum, purus quis venenatis viverra, erat metus porttitor quam,
              quis feugiat dui nunc eu eros. Maecenas condimentum rhoncus
              tempus. Quisque auctor finibus elit, ac vestibulum enim lacinia
              eget. Nullam vulputate, ex nec faucibus pharetra, nisi erat varius
              mauris, in auctor elit lacus vitae eros. Fusce tristique aliquet
              porta. Donec elementum nisl sapien, non pharetra purus iaculis
              quis. Integer mattis id nunc quis porttitor. Nulla fringilla
              mauris placerat nulla pretium, eget placerat ante fermentum.
            </Text>
          </View>
          <Spacing height={40} />
          <View>
            <Text className="text-[24px] text-[#292929] font-[500] leading-[30.8px]">
              2.Application scope
            </Text>
            <Spacing height={16} />
            <Text className="text-[16px] text-[#7C7C7C] font-[400] leading-[30.8px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              interdum, purus quis venenatis viverra, erat metus porttitor quam,
              quis feugiat dui nunc eu eros. Maecenas condimentum rhoncus
              tempus. Quisque auctor finibus elit, ac vestibulum enim lacinia
              eget. Nullam vulputate, ex nec faucibus pharetra, nisi erat varius
              mauris, in auctor elit lacus vitae eros. Fusce tristique aliquet
              porta. Donec elementum nisl sapien, non pharetra purus iaculis
              quis. Integer mattis id nunc quis porttitor. Nulla fringilla
              mauris placerat nulla pretium, eget placerat ante fermentum.
            </Text>
          </View>
          <Spacing height={40} />
          {/* <Text>{pdpa?.pdpa}</Text> */}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
};

export default ResidentialPDPAScreen;
