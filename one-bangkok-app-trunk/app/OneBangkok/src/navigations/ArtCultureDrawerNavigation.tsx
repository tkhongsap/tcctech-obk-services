/* eslint-disable react/no-unstable-nested-components */
import {Dimensions} from 'react-native';
import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import ArtCultureLandingScreen from '~/features/artCulture/screens/ArtCultureLandingScreen';
import CustomDrawerMarcom from '~/features/marcom/components/CustomDrawerMarcom';
import CustomDrawer from '~/components/CustomDrawer';
import firebaseConfigState from '~/states/firebase';

const Drawer = createDrawerNavigator();

export default function ArtCultureDrawerNavigation() {
  const enableMarcomMainPage = firebaseConfigState.enable_marcom_mainpage.value;

  return (
    <Drawer.Navigator
      initialRouteName="ArtCultureLandingDrawerScreen"
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
        name="ArtCultureLandingDrawerScreen"
        component={ArtCultureLandingScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}
