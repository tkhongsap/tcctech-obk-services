import {Dimensions} from 'react-native';
import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import MainPageScreen from '~/features/marcom/screens/MainPageScreen';
import CustomDrawerMarcom from '~/features/marcom/components/CustomDrawerMarcom';
import CustomDrawer from '../components/CustomDrawer';
import firebaseConfigState from '~/states/firebase';

const Drawer = createDrawerNavigator();

export default function DrawerNavigationMarcom() {
  const enableMarcomMainPage = firebaseConfigState.enable_marcom_mainpage.value;
  return (
    <Drawer.Navigator
      initialRouteName="Marcom"
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
        name="Marcom"
        component={MainPageScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}
