/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {activeOpacity} from '~/constants';
import {Spacing, Text} from '~/components/atoms';
import {IContentCardWhatHappen} from './IMarcom';
import {useNavigation} from '~/navigations/AppNavigation';
import {logEvent} from '~/utils/logGA';

const WhatHappenBox = (props: IContentCardWhatHappen) => {
  const navigation = useNavigation() as any;

  const styles = StyleSheet.create({
    whatHappenBox: {
      width: '100%',
      height: 120,
      borderColor: '#ededed',
      borderWidth: 2,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      borderRadius: 10,
      zIndex: 10,
    },
    whatHappenText: {
      width: Dimensions.get('window').width - 160,
      paddingTop: 4,
      paddingLeft: 10,
      paddingRight: 10,
    },
  });

  const handlePressWhatHeppen = (sID: string) => {
    const eventParams = {
      title_name: props.sTitle,
      screen_name: 'MainPageScreen',
      action_type: 'click',
      bu: 'MarCom',
    };
    logEvent('button_click', eventParams);
    navigation.navigate('MarcomContentScreen', {
      id: sID,
      sMode: 'WhatHappening',
      isBanner: false,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={() => handlePressWhatHeppen(props.sID)}>
      <View style={styles.whatHappenBox}>
        <FastImage
          source={{
            uri: props.sCoverImagePath,
            priority: FastImage.priority.low,
          }}
          style={{
            width: 120,
            height: '100%',
            zIndex: 1,
            borderTopLeftRadius: 7,
            borderBottomLeftRadius: 7,
          }}
        />
        <View style={styles.whatHappenText}>
          <Spacing width={10} />
          <Text style={{fontSize: 12, color: '#adadad'}}>
            {props.sCategory}
          </Text>
          <Text
            numberOfLines={2}
            weight="medium"
            style={{fontSize: 16, lineHeight: 18, height: 40}}>
            {props.sTitle}
          </Text>
          <Text numberOfLines={1} style={{fontSize: 12, color: '#adadad'}}>
            {props.sLocation}
          </Text>
          <Text
            numberOfLines={1}
            weight="medium"
            style={{fontSize: 14, lineHeight: 14}}>
            {props.sDate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WhatHappenBox;
