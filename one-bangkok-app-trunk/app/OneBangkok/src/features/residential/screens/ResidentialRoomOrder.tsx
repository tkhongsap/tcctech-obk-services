import {ScrollView, View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '~/navigations/AppNavigation';
import {ScreenContainer} from '../components/ScreenContainer';
import RoomOrderItem, {RoomOrder} from '../components/RoomOrderItem';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {Header} from '../components/Header';

const initialData: RoomOrder[] = [
  {id: 'Exhibition', title: 'Exhibition', amount: 13},
  {id: 'Hold Exhibition', title: 'Hold Exhibition', amount: 12},
  {id: 'Laboratory Room', title: 'Laboratory Room', amount: 3},
  {id: 'Living now', title: 'Living now', amount: 1},
  {id: 'Practice room', title: 'Practice room', amount: 5},
  {id: 'Training room', title: 'Training room', amount: 4},
];

const ResidentialRoomOrder = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(initialData);
  const renderItem = ({item, drag, getIndex}: RenderItemParams<RoomOrder>) => {
    const isDragging = useSharedValue(false);
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {scale: isDragging.value ? withSpring(1.1) : withSpring(1)},
        ],
        backgroundColor: isDragging.value ? '#f0f0f0' : 'white',
      };
    });

    return (
      <Animated.View
        key={'animv:' + getIndex()}
        style={[styles.itemContainer, animatedStyle]}>
        <RoomOrderItem
          key={getIndex() + ''}
          amount={item.amount}
          title={item.title}
          id={item.id}
          onLongPress={id => {}}
          onPressIn={id => {
            isDragging.value = true;
            drag();
          }}
          onPressOut={id => setTimeout(() => (isDragging.value = false), 300)}
        />
      </Animated.View>
    );
  };

  const styles = StyleSheet.create({
    itemContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    itemText: {
      fontSize: 16,
    },
  });

  return (
    <ScreenContainer bgColor={'#1A1919'} barStyle="light-content">
      <Header
        leftAction="goBack"
        title="Room Order"
        bgColor="bg-jet-black"
        titleColor="white"
        leftColor="white"
      />
      <ScrollView style={{height: 0}} className="bg-[#ffffff] w-full">
        <View className="bg-[#ffffff] w-full h-[] px-[16px] pt-[40px] flex flex-col">
          {/* Room Name */}
          <View className="w-full flex flex-row items-center justify-between bg-white">
            <Text className="text-[16px] font-[500] text-[#292929]">
              C3A-32001
            </Text>
          </View>

          {/* Room Ordering */}
          <View className="mt-[18px] border-[1px] border-[#DCDCDC] px-[16px] flex flex-col">
            <DraggableFlatList
              data={data}
              onDragEnd={({data}) => setData(data)}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          </View>
        </View>
      </ScrollView>

      {/* <ScrollView className="bg-[#ffffff]">
        <View className="w-full h-[72px] bg-[#1A1919] flex flex-row items-center justify-center">
          <TouchableOpacity
            className="w-[52px] h-[52px] flex items-center justify-center absolute top-[10px] left-[0px]"
            onPress={() =>
              navigation.navigate('ResidentialManageMyHomeScreen')
            }>
            <Icon type={'back'} width={20} height={20} color={'#ddd'} />
          </TouchableOpacity>

          <Text className="text-[16px] font-[500] text-[#FDFDFD]">
            Room Order
          </Text>
        </View>

        <View className="bg-[#ffffff] w-full h-[] px-[16px] pt-[40px] flex flex-col">
          <View className="w-full flex flex-row items-center justify-start mb-[16px]">
            <Text className="text-[16px] font-[500] text-[#292929]">
              C3A-32001
            </Text>
          </View>

          <View className="border-[1px] border-[#DCDCDC] px-[16px] flex flex-col">
            <View className="py-[16px] flex flex-row items-center border-b-[1px] border-[#DCDCDC]">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Exhibition
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  13
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'menu'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>

            <View className="py-[16px] flex flex-row items-center border-b-[1px] border-[#DCDCDC]">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Hold Exhibition
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  12
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'menu'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>

            <View className="py-[16px] flex flex-row items-center border-b-[1px] border-[#DCDCDC]">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Laboratory Room
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  3
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'menu'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>

            <View className="py-[16px] flex flex-row items-center border-b-[1px] border-[#DCDCDC]">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Living now
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  1
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'menu'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>

            <View className="py-[16px] flex flex-row items-center border-b-[1px] border-[#DCDCDC]">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Practice room
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  5
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'menu'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>

            <View className="py-[16px] flex flex-row items-center ">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Training room
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  4
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'menu'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView> */}
    </ScreenContainer>
  );
};
export default ResidentialRoomOrder;
