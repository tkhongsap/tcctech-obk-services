import {Dimensions} from 'react-native';
import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import HomeScreen from '~/features/home/screens/HomeScreen';
import firebaseConfigState from '~/states/firebase';
import CustomDrawerMarcom from '~/features/marcom/components/CustomDrawerMarcom';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  const enableMarcomMainPage = firebaseConfigState.enable_marcom_mainpage.value;

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props: any) =>
        enableMarcomMainPage ? (
          <CustomDrawerMarcom {...props} />
        ) : (
          <CustomDrawer {...props} />
        )
      }
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
