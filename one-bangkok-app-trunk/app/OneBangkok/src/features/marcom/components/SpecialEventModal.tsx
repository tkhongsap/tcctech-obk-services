/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon, Spacing} from '~/components/atoms';
import {activeOpacity} from '~/constants';
import {IEvent, IMainPage} from './IMarcom';
import Swiper from 'react-native-swiper';
import SwiperV2 from 'react-native-swiper-android';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {t} from 'i18next';
import {CheckField} from '~/components/molecules/CheckField';

const SpecialEventModal = (props: IMainPage) => {
  const [isOpen, setIsOpen] = useState(true);

  const [lstEvent, setLstEvent] = useState<IEvent[]>([]);

  const [isCheckedDontShow, setIsCheckedDontShow] = useState(false);

  const nBannerHeight = 510;
  const nBannerWidth = 340;
  const nNotShowHeight = 55;

  const handlePressDontShow = async () => {
    setIsCheckedDontShow(prev => !prev);
  };

  const onPressClose = async () => {
    setIsOpen(false);
    if (isCheckedDontShow) {
      let lstDontShowAsync = await AsyncStorage.getItem(
        'lstNotShowSpecialEvent',
      );
      let lstDontShowID = [];
      if (lstDontShowAsync) {
        lstDontShowID = JSON.parse(lstDontShowAsync);
      }

      await AsyncStorage.setItem(
        'lstNotShowSpecialEvent',
        JSON.stringify([...lstDontShowID, ...lstEvent.map(m => m.sID)]),
      );
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: isOpen ? 'flex' : 'none',
    },
    modalView: {
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    modalRow: {
      height:
        nBannerHeight + (props.canCheckDontShowEvent ? nNotShowHeight : 0) - 12,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    detailBox: {
      backgroundColor: 'white',
      width: nBannerWidth,
    },
    wrapperBanner: {
      height: nBannerHeight - nNotShowHeight,
      backgroundColor: 'grey',
    },
    bannerActive: {
      backgroundColor: '#333333',
      width: 100,
      height: 3,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
    },
    bannerInactive: {
      backgroundColor: '#a1a1a1',
      width: 25,
      height: 3,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
    },
  });

  useEffect(() => {
    setLstEvent(props.lstEvent);
  }, [props.lstEvent]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={onPressClose}>
        <View style={styles.modalView}>
          <View style={styles.modalRow}>
            <View style={styles.detailBox}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  padding: 10,
                }}>
                <TouchableOpacity
                  activeOpacity={activeOpacity}
                  onPress={onPressClose}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Icon
                      color="#7c7c7c"
                      type={'close'}
                      width={15}
                      height={15}
                    />
                    <Text
                      style={{marginLeft: 5, fontSize: 18, color: '#4d616d'}}>
                      Close
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Swiper */}
              {lstEvent.length > 0 &&
                (Platform.OS === 'ios' ? (
                  <Swiper
                    key={'swiperEvent-ios'}
                    style={styles.wrapperBanner}
                    showsButtons={false}
                    loop={true}
                    dot={<View style={styles.bannerInactive} />}
                    activeDot={<View style={styles.bannerActive} />}
                    loadMinimal
                    loadMinimalSize={lstEvent.length}
                    paginationStyle={{bottom: 7}}>
                    {lstEvent.map(item => (
                      <View key={item.sImagePath}>
                        <FastImage
                          source={{
                            uri: item.sImagePath + '',
                            priority: FastImage.priority.low,
                          }}
                          resizeMode="cover"
                          style={{
                            marginBottom: nNotShowHeight,
                            width: nBannerWidth,
                            height: nBannerHeight - nNotShowHeight,
                          }}
                        />
                      </View>
                    ))}
                  </Swiper>
                ) : (
                  <SwiperV2
                    key={'swiperEvent-android'}
                    style={styles.wrapperBanner}
                    showsButtons={false}
                    loop={true}
                    dot={<View style={styles.bannerInactive} />}
                    activeDot={<View style={styles.bannerActive} />}
                    loadMinimal
                    loadMinimalSize={lstEvent.length}
                    paginationStyle={{bottom: 7}}>
                    {lstEvent.map(item => (
                      <View key={item.sImagePath}>
                        <FastImage
                          source={{
                            uri: item.sImagePath + '',
                            priority: FastImage.priority.low,
                          }}
                          resizeMode="cover"
                          style={{
                            marginBottom: nNotShowHeight,
                            width: nBannerWidth,
                            height: nBannerHeight - nNotShowHeight,
                          }}
                        />
                      </View>
                    ))}
                  </SwiperV2>
                ))}

              {lstEvent.length > 0 && props.canCheckDontShowEvent ? (
                <View style={{height: nNotShowHeight}}>
                  <Spacing height={12} />

                  <TouchableOpacity
                    activeOpacity={activeOpacity}
                    onPress={handlePressDontShow}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginLeft: 12,
                      }}>
                      <CheckField
                        value={isCheckedDontShow}
                        onPress={handlePressDontShow}>
                        <View className="flex flex-row flex-wrap mr-[30px]">
                          <Spacing width={4} />
                          <Text style={{color: '#4d616d', fontSize: 16}}>
                            {t(
                              'Marcom_DontShowEventPopup',
                              'Do not show this again',
                            )}
                          </Text>
                        </View>
                      </CheckField>
                    </View>
                  </TouchableOpacity>
                  <Spacing height={13} />
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default SpecialEventModal;
