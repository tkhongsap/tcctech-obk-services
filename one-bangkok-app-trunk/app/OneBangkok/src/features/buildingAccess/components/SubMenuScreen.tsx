import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Header} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import {SubMenuScreenMenuList} from '../types/subMenu';
import {Icon, Text} from '~/components/atoms';
import {Screen} from '~/components/templates';
import getTheme from '~/utils/themes/themeUtils';
import T from '~/utils/text';

interface IProps {
  title: string;
  menuList: SubMenuScreenMenuList[];
}

const ShortCutComponent = ({
  name,
  defaultName,
  iconName,
  navigationTo,
}: SubMenuScreenMenuList) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="w-full"
      onPress={() => navigation.navigate(navigationTo)}>
      <View
        className={`flex-row border-b py-4 justify-between items-center ${getTheme(
          'border-line',
        )}`}>
        <View className="flex-row items-center space-x-2">
          <Icon type={iconName} width={24} height={24} />
          <Text weight="medium">{T(name, defaultName)}</Text>
        </View>
        <Icon type={'right'} width={12} height={12} />
      </View>
    </TouchableOpacity>
  );
};

const SubMenuScreen = ({title, menuList}: IProps) => {
  return (
    <Screen>
      <Header title={title} leftAction="goBack" />
      <ScrollView className="w-full px-4 pt-4">
        {menuList.map((menu, index) => {
          return (
            <ShortCutComponent
              key={`submenu-${title}-${index}-${menu.name}`}
              name={menu.name}
              defaultName={menu.defaultName}
              iconName={menu.iconName}
              navigationTo={menu.navigationTo}
            />
          );
        })}
      </ScrollView>
    </Screen>
  );
};

export default SubMenuScreen;
