/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Platform, SafeAreaView} from 'react-native';

export const SafeAreaViewContent = (props: any) => {
  return Platform.OS === 'ios' ? (
    <SafeAreaView
      className={'items-center h-screen w-full'}
      style={{backgroundColor: 'white'}}>
      {props.children}
    </SafeAreaView>
  ) : (
    props.children
  );
};
