/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {IContentLayout} from './ISustainability';
import {Spacing, Text} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {activeOpacity} from '~/constants';

const SustainabilityLayout3 = (props: IContentLayout) => {
  const currentLanguage = appLanguageState.currentLanguage.get();
  const navigation = useNavigation();

  const [heightBox, setHeightBox] = useState(0);
  let styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
    },
    certContainer: {
      backgroundColor: 'white',
      padding: 15,
    },
    certDetailBox: {
      width: Dimensions.get('window').width - 55,
      borderColor: '#eee',
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: 5,
    },
    certDetailText: {
      width: Dimensions.get('window').width - 125,
      padding: 10,
      flexDirection: 'column',
      justifyContent: 'center',
    },
  });

  const handlePress = (sID: string) => {
    navigation.navigate('NormalContentScreen', {
      id: sID,
    });
  };

  return (
    <View
      style={{
        height: 250 + heightBox,
        backgroundColor: '#efefef',
      }}>
      <View>
        <FastImage
          source={{
            uri: props.sLayoutBackground + '',
            priority: FastImage.priority.low,
          }}
          style={{
            width: Dimensions.get('window').width,
            height: 250,
          }}>
          <View className="absolute bottom-[0] w-full" style={{height: 90}}>
            <LinearGradient
              colors={['rgba(255,255,255, 0)', 'rgba(255,255,255, 1)']}
              style={styles.linearGradient}
            />
          </View>
        </FastImage>
      </View>

      <View className="px-3 absolute top-[200] w-full" style={{height: '100%'}}>
        <View
          style={styles.certContainer}
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            setHeightBox(layout.height - 10);
          }}>
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
          <Spacing height={5} />
          {props.lstSub.map((item, index) => (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              key={item.sLabel + index}
              onPress={() => handlePress(item.sID)}>
              <View style={styles.certDetailBox}>
                <FastImage
                  source={{
                    uri: item.sPath,
                    priority: FastImage.priority.low,
                  }}
                  style={{
                    width: 75,
                    height: 75,
                  }}
                />
                <View style={styles.certDetailText}>
                  <View>
                    <Text style={{fontWeight: 'bold'}}>{item.sLabel}</Text>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: currentLanguage === 'th' ? 20 : 14,
                        color: 'gray',
                      }}>
                      {item.sLabelDesc}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};
export default SustainabilityLayout3;
