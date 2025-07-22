import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import clsx from 'clsx';
import {Icon} from '~/components/atoms';
interface MainNavbarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}
const MainNavbar = ({activeTab, onTabPress}: MainNavbarProps) => {
  return (
    <View className={'bg-white border-b-[1px] border-b-[#ccc]'}>
    
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navbar}>
        {['News', 'Workspace', 'Residence', 'Arts+C'].map(tab => (
          <TouchableOpacity
            key={tab}
            className={'flex-row  mx-6'}
            onPress={() => onTabPress(tab)}>
            <View className={'relative  items-center'}>
              <Text
                className={clsx(
                  'font-obRegular',
                  getTheme(
                    activeTab === tab
                      ? 'text-dark-teal-dark font-bold'
                      : 'text-gray-light',
                  ),
                )}>
                {tab}
              </Text>
              {activeTab === tab && (
                <View
                  className={getTheme(
                    'absolute bottom-[-10px] w-[130%] h-0.5 bg-[#014541]',
                  )}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default MainNavbar;
