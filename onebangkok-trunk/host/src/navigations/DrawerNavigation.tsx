import {Dimensions} from 'react-native';
import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import HomeScreen from '~/features/home/screens/HomeScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props: any) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerStyle: {
          width: Dimensions.get('window').width - 32,
          paddingHorizontal: 24,
        },
        overlayColor: 'black',
      }}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}
