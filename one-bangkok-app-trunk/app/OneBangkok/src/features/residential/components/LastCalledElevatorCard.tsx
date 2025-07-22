import {View, ScrollView, TouchableOpacity} from 'react-native';
import {Spacing, Text, Icon} from '~/components/atoms';
import t from '~/utils/text';
import React from 'react'

const LastCalledElevatorCard = () => {
  return (
    <View
            className='w-full transform justify-center bg-dark-teal-light'>
            <Spacing height={20} />
            <View className="justify-between flex-row px-5">
              <Text color="default-inverse" weight="medium">
                {t('General__Last_called', 'Last called')}
              </Text>
              <TouchableOpacity>
                <Icon type="close" width={20} height={20} color="white" />
              </TouchableOpacity>
            </View>
            <Spacing height={20} />
            <View className="flex-row">
              <View className="px-5 w-6/12">
                <View className=" flex-column">
                  <Text color="sky-blue" size="B1" weight="medium">
                    {t('General__Elevator', 'Elevator')}
                  </Text>
                  <Text color="default-inverse" size="H1">
                    C
                  </Text>
                </View>
              </View>
              <View className="px-5">
                <View className=" flex-column">
                  <Text color="sky-blue" size="B1" weight="medium">
                    {t('General__Destination_floor', 'Destination floor')}
                  </Text>
                  <Text color="default-inverse" size="H1">
                    LB
                  </Text>
                </View>
              </View>
            </View>
            <Spacing height={20} />
          </View>
  )
}

export default LastCalledElevatorCard