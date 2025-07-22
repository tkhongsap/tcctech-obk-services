import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import {Icon, Text, HelperText, Label, Spacing} from '~/components/atoms';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import React, {useState} from 'react';
import { ScrollView } from 'react-native-gesture-handler';

const SimpleDropdown = () => {
  return (
    <>
      <View className="flex flex-col w-full">
        <Label text="Floor" />
        <Spacing height={8} />
        <TouchableOpacity className="flex flex-row justify-between items-center px-4 py-3 border border-subtitle-muted-light">
          <Text
            color="subtitle-muted"
            size="B1"
            weight="regular"
            className="italic">
            Floor
          </Text>
          <View className="rotate-0">
            <Icon type="arrowDownIcon" width={20} height={20} color="#000000" />
          </View>
        </TouchableOpacity>
        {/* <Spacing height={2} />
        <HelperText text="Please select the floor" error="Please select the floor" /> */}
      </View>

      <Spacing height={24} />
      <View className="flex flex-col w-full">
        <Label text="Floor" />
        <Spacing height={8} />
        <TouchableOpacity className="flex flex-row justify-between items-center px-4 py-3 border border-subtitle-muted-light">
          <Text
            color="subtitle-muted"
            size="B1"
            weight="regular"
            className="italic">
            Floor
          </Text>
          <View className="rotate-180">
            <Icon type="arrowDownIcon" width={20} height={20} color="#000000" />
          </View>
        </TouchableOpacity>

        <ScrollView className="w-full border border-subtitle-muted-light max-h-[200px]">
          <TouchableOpacity className="flex flex-row justify-between items-center px-4 py-2">
            <Text
              color="dark-gray"
              size="B1"
              weight="regular">
              26
            </Text>
              <Icon
                type="checkedIcon"
                width={20}
                height={20}
                color="#000000"
              />
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row justify-between items-center px-4 py-2">
            <Text
              color="dark-gray"
              size="B1"
              weight="regular">
              25
            </Text>
              {/* <Icon
                type="checkedIcon"
                width={20}
                height={20}
                color="#000000"
              /> */}
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row justify-between items-center px-4 py-2">
            <Text
              color="dark-gray"
              size="B1"
              weight="regular">
              24
            </Text>
              {/* <Icon
                type="checkedIcon"
                width={20}
                height={20}
                color="#000000"
              /> */}
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row justify-between items-center px-4 py-2">
            <Text
              color="dark-gray"
              size="B1"
              weight="regular">
              23
            </Text>
              {/* <Icon
                type="checkedIcon"
                width={20}
                height={20}
                color="#000000"
              /> */}
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row justify-between items-center px-4 py-2">
            <Text
              color="dark-gray"
              size="B1"
              weight="regular">
              22
            </Text>
              {/* <Icon
                type="checkedIcon"
                width={20}
                height={20}
                color="#000000"
              /> */}
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row justify-between items-center px-4 py-2">
            <Text
              color="dark-gray"
              size="B1"
              weight="regular">
              21
            </Text>
              {/* <Icon
                type="checkedIcon"
                width={20}
                height={20}
                color="#000000"
              /> */}
          </TouchableOpacity>
        </ScrollView>

        {/* <Spacing height={2} />
        <HelperText text="Please select the floor" error="Please select the floor" /> */}
      </View>

      <Spacing height={24} />
      <View className="flex flex-col w-full">
        <Label text="Floor" />
        <Spacing height={8} />
        <TouchableOpacity className="flex flex-row justify-between items-center px-4 py-3 border border-error-dark bg-error-light">
          <Text color="dark-gray" size="B1" weight="regular">
            Floor
          </Text>
          <View className="rotate-0">
            <Icon type="arrowDownIcon" width={20} height={20} color="#000000" />
          </View>
        </TouchableOpacity>
        <Spacing height={2} />
        <HelperText
          text="Please select the floor"
          error="Please select the floor"
        />
      </View>
    </>
  );
};

export default SimpleDropdown;
