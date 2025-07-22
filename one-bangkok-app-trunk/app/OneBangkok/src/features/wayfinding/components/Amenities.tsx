import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {Icon} from '~/components/atoms';
import {StackNavigation} from '~/navigations/AppNavigation';

type Amenity = {name: string; floor: string};

type Props = {
  amenities: Amenity[];
  seeAllCallBack: (value: Amenity | undefined) => void;
};

const Amenities = (props: Props) => {
  const {amenities, seeAllCallBack} = props;
  const navigation = useNavigation<StackNavigation>();

  const onNavigateAmenities = () => {
    navigation.navigate('AmenitiesScreen', {
      amenities: amenities,
      callBack: seeAllCallBack,
    });
  };

  return (
    <View
      className="p-3 w-full absolute bottom-0 z-50 border-t border-gray-300"
      style={{backgroundColor: '#F5F5F5'}}>
      <Text className="text-lg font-semibold mb-2">Amenities</Text>
      <View className="flex flex-row flex-nowrap">
        <View className="basis-1/4">
          <Pressable
            className="border border-gray-300 rounded py-3 mr-2 bg-white"
            onPress={() => {}}>
            <View>
              <Icon type="obParkingIcon" />
              <Text className="text-center">Parking A</Text>
            </View>
          </Pressable>
        </View>
        <View className="basis-1/4">
          <Pressable
            className="border border-gray-300 rounded py-3 mr-2 bg-white"
            onPress={() => {}}>
            <View>
              <Icon type="obParkingIcon" />
              <Text className="text-center">Parking B</Text>
            </View>
          </Pressable>
        </View>
        <View className="basis-1/4">
          <Pressable
            className="border border-gray-300 rounded py-3 mr-2 bg-white"
            onPress={() => {}}>
            <View>
              <Icon type="toiletIcon" />
              <Text className="text-center">Toilet</Text>
            </View>
          </Pressable>
        </View>
        <View className="basis-1/4">
          <Pressable
            className="border border-gray-300 rounded py-3 mr-2 bg-white"
            onPress={onNavigateAmenities}>
            <View>
              <Icon type="threeDot" />
              <Text className="text-center">See all</Text>
            </View>
          </Pressable>
        </View>
        <View className="basis-1/4">
          <Pressable
            className="border border-gray-300 rounded py-3 mr-2 bg-white"
            onPress={onNavigateAmenities}>
            <View>
              <Icon type="threeDot" />
              <Text className="text-center">See all</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Amenities;
