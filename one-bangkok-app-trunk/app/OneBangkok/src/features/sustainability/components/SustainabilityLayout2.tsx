/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {IContentLayout} from './ISustainability';
import GridViewLayout2 from './GridViewLayout2';
import {useNavigation} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {activeOpacity} from '~/constants';

const SustainabilityLayout2 = (props: IContentLayout) => {
  const currentLanguage = appLanguageState.currentLanguage.get();
  const navigation = useNavigation();

  let styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
    },
    textLabel: {
      fontSize: 16,
      color: 'white',
      lineHeight: 16,
    },
    textLabelTH: {
      fontSize: 16,
      color: 'white',
      lineHeight: 22,
    },
  });

  const handlePress = (sID: string) => {
    navigation.navigate('NormalContentScreen', {
      id: sID,
    });
  };

  return (
    <>
      <View className="px-3">
        <Text
          weight="medium"
          style={
            currentLanguage === 'th'
              ? {fontSize: 24, lineHeight: 32}
              : {fontSize: 24}
          }>
          {props.sTitle}
        </Text>
        <Spacing height={5} />
        <Text
          weight="regular"
          style={{
            fontSize: 14,
            lineHeight: currentLanguage === 'th' ? 20 : 14,
            color: 'gray',
          }}>
          {props.sIntroduce}
        </Text>
      </View>
      <View>
        <GridViewLayout2
          data={props.lstSub}
          col={3}
          renderItem={item => {
            return (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={() => handlePress(item.sID)}>
                <View>
                  <FastImage
                    source={{
                      uri: item.sPath,
                      priority: FastImage.priority.low,
                    }}
                    style={{
                      width: Dimensions.get('window').width / 3 - 15,
                      height: 200,
                    }}>
                    <View
                      className="absolute bottom-[0] w-full"
                      style={{height: 80}}>
                      <LinearGradient
                        colors={[
                          'rgba(255, 255, 255, 0)',
                          'rgba(0, 0, 0, 0.4)',
                          'rgba(0, 0, 0, 1)',
                        ]}
                        style={styles.linearGradient}
                      />
                    </View>
                    <View className="absolute bottom-[3px] items-start px-2 w-full">
                      <Text weight="medium" style={styles.textLabel}>
                        {item.sLabel}
                      </Text>
                    </View>
                  </FastImage>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </>
  );
};
export default SustainabilityLayout2;
